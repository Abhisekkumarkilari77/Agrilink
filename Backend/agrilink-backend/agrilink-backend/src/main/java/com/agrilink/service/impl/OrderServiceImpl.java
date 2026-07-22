package com.agrilink.service.impl;

import com.agrilink.dto.order.OrderRequest;
import com.agrilink.dto.order.OrderResponse;
import com.agrilink.entity.auth.User;
import com.agrilink.entity.order.Order;
import com.agrilink.entity.order.OrderItem;
import com.agrilink.enums.OrderStatus;
import com.agrilink.exception.ResourceNotFoundException;
import com.agrilink.entity.delivery.DeliveryAssignment;
import com.agrilink.mapper.OrderMapper;
import com.agrilink.repository.DeliveryAssignmentRepository;
import com.agrilink.repository.OrderRepository;
import com.agrilink.repository.UserRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DeliveryAssignmentRepository deliveryAssignmentRepository;
    private final OrderMapper orderMapper;

    @Override
    public ApiResponse<OrderResponse> createOrder(String userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Deduce farmerId from the first item (assuming single-farmer orders for now)
        String farmerId = null;
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            farmerId = request.getItems().get(0).getFarmerId();
        }

        List<String> trackingSteps = new ArrayList<>();
        trackingSteps.add("Order Placed");

        Order order = Order.builder()
                .userId(userId)
                .customerName(user.getName())
                .items(request.getItems())
                .address(request.getAddress())
                .deliverySlot(request.getSlot())
                .paymentMethod(request.getPaymentMethod())
                .total(request.getTotal())
                .status(OrderStatus.ORDER_PLACED)
                .farmerId(farmerId)
                .trackingSteps(trackingSteps)
                .build();

        order = orderRepository.save(order);
        return ApiResponse.success("Order created successfully", orderMapper.toResponse(order));
    }

    @Override
    public ApiResponse<OrderResponse> getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return ApiResponse.success("Order fetched successfully", orderMapper.toResponse(order));
    }

    @Override
    public ApiResponse<List<OrderResponse>> getCustomerOrders(String userId) {
        List<OrderResponse> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Customer orders fetched successfully", orders);
    }

    @Override
    public ApiResponse<List<OrderResponse>> getFarmerOrders(String farmerId) {
        List<OrderResponse> orders = orderRepository.findByFarmerId(farmerId).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Farmer orders fetched successfully", orders);
    }

    @Override
    public ApiResponse<List<OrderResponse>> getDeliveryPartnerOrders(String deliveryPartnerId) {
        List<OrderResponse> orders = orderRepository.findByDeliveryPartnerId(deliveryPartnerId).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Delivery partner orders fetched successfully", orders);
    }

    @Override
    public ApiResponse<OrderResponse> updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (status == OrderStatus.REJECTED) {
            // Treatment as delivery partner rejection of assignment
            order.setDeliveryPartnerId(null);
            order.setStatus(OrderStatus.FARMER_ACCEPTED);
            order.setDeliveryAssignmentStatus("AVAILABLE");
            order.getTrackingSteps().add("Delivery Partner rejected assignment. Order returned to available pool.");
            order = orderRepository.save(order);

            Optional<DeliveryAssignment> assignmentOpt = deliveryAssignmentRepository.findByOrderId(orderId);
            if (assignmentOpt.isPresent()) {
                DeliveryAssignment assignment = assignmentOpt.get();
                assignment.setDeliveryPartnerId(null);
                assignment.setAssignmentStatus("AVAILABLE");
                assignment.setCurrentStatus("AVAILABLE");
                deliveryAssignmentRepository.save(assignment);
            }
            return ApiResponse.success("Delivery request rejected", orderMapper.toResponse(order));
        }

        order.setStatus(status);
        order.getTrackingSteps().add("Order status updated to: " + status.name());

        // Keep DeliveryAssignment status in sync
        Optional<DeliveryAssignment> assignmentOpt = deliveryAssignmentRepository.findByOrderId(orderId);
        if (assignmentOpt.isPresent()) {
            DeliveryAssignment assignment = assignmentOpt.get();
            assignment.setCurrentStatus(status.name());
            if (status == OrderStatus.PICKED_UP) {
                assignment.setAssignmentStatus("PICKED_UP");
                assignment.setPickedUpAt(Instant.now());
            } else if (status == OrderStatus.IN_TRANSIT) {
                assignment.setAssignmentStatus("OUT_FOR_DELIVERY");
            } else if (status == OrderStatus.OUT_FOR_DELIVERY) {
                assignment.setAssignmentStatus("OUT_FOR_DELIVERY");
            } else if (status == OrderStatus.DELIVERED) {
                assignment.setAssignmentStatus("DELIVERED");
                assignment.setDeliveredAt(Instant.now());
            }
            deliveryAssignmentRepository.save(assignment);
        }
        
        order = orderRepository.save(order);
        return ApiResponse.success("Order status updated", orderMapper.toResponse(order));
    }

    @Override
    public ApiResponse<OrderResponse> assignDeliveryPartner(String orderId, String deliveryPartnerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setDeliveryPartnerId(deliveryPartnerId);
        order.setStatus(OrderStatus.CONFIRMED);
        order.getTrackingSteps().add("Delivery Partner Assigned");

        order = orderRepository.save(order);
        return ApiResponse.success("Delivery partner assigned successfully", orderMapper.toResponse(order));
    }

    @Override
    public ApiResponse<List<OrderResponse>> getAvailableOrdersForDelivery() {
        // Retrieve current logged in partner ID from security context
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String currentPartnerId = null;
        if (auth != null && auth.getPrincipal() instanceof com.agrilink.security.CustomUserDetails) {
            currentPartnerId = ((com.agrilink.security.CustomUserDetails) auth.getPrincipal()).getId();
        }
        final String finalPartnerId = currentPartnerId;

        // Fetch orders that are pending and have no delivery partner assigned OR are explicitly assigned to this partner but not yet accepted
        List<OrderResponse> orders = orderRepository.findByStatus(OrderStatus.FARMER_ACCEPTED).stream()
                .filter(order -> order.getDeliveryPartnerId() == null || order.getDeliveryPartnerId().equals(finalPartnerId))
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Available orders fetched successfully", orders);
    }

    @Override
    public ApiResponse<OrderResponse> updateOrderTracking(String orderId, String trackingStep, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (status != null) {
            order.setStatus(status);
        }
        order.getTrackingSteps().add(trackingStep);

        order = orderRepository.save(order);
        return ApiResponse.success("Order tracking updated", orderMapper.toResponse(order));
    }
}
