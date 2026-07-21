package com.agrilink.service.impl;

import com.agrilink.dto.order.OrderRequest;
import com.agrilink.dto.order.OrderResponse;
import com.agrilink.entity.auth.User;
import com.agrilink.entity.order.Order;
import com.agrilink.entity.order.OrderItem;
import com.agrilink.enums.OrderStatus;
import com.agrilink.exception.ResourceNotFoundException;
import com.agrilink.mapper.OrderMapper;
import com.agrilink.repository.OrderRepository;
import com.agrilink.repository.UserRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
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
                .status(OrderStatus.PENDING)
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

        order.setStatus(status);
        order.getTrackingSteps().add("Order status updated to: " + status.name());
        
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
        // Fetch orders that are pending and have no delivery partner assigned
        List<OrderResponse> orders = orderRepository.findByStatus(OrderStatus.PENDING).stream()
                .filter(order -> order.getDeliveryPartnerId() == null)
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
