package com.agrilink.controller.farmer;

import com.agrilink.dto.order.OrderResponse;
import com.agrilink.entity.delivery.DeliveryAssignment;
import com.agrilink.entity.order.Order;
import com.agrilink.enums.OrderStatus;
import com.agrilink.exception.ResourceNotFoundException;
import com.agrilink.mapper.OrderMapper;
import com.agrilink.repository.DeliveryAssignmentRepository;
import com.agrilink.repository.OrderRepository;
import com.agrilink.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.agrilink.entity.delivery.DeliveryPartner;
import com.agrilink.repository.DeliveryPartnerRepository;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/farmer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FARMER')")
public class FarmerController {

    private final OrderRepository orderRepository;
    private final DeliveryAssignmentRepository deliveryAssignmentRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final OrderMapper orderMapper;

    @PutMapping("/orders/{orderId}/accept")
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(@PathVariable String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Check for online delivery partners
        List<DeliveryPartner> onlinePartners = deliveryPartnerRepository.findByIsOnlineTrue();
        String assignedPartnerId = null;
        String assignmentStatus = "AVAILABLE";

        if (onlinePartners != null && !onlinePartners.isEmpty()) {
            // Assign the first online delivery partner
            assignedPartnerId = onlinePartners.get(0).getUserId();
            assignmentStatus = "ACCEPTED"; // Or ASSIGNED; let's keep it consistent
        }

        // Update Order
        order.setStatus(OrderStatus.FARMER_ACCEPTED);
        order.setDeliveryPartnerId(assignedPartnerId);
        order.setDeliveryAssignmentStatus(assignedPartnerId != null ? "ASSIGNED" : "AVAILABLE");
        order.getTrackingSteps().add(assignedPartnerId != null ? "Farmer Accepted Order — Assigned to Delivery Partner" : "Farmer Accepted Order");
        order = orderRepository.save(order);

        // Create Delivery Assignment
        DeliveryAssignment assignment = DeliveryAssignment.builder()
                .orderId(order.getId())
                .customerId(order.getUserId())
                .farmerId(order.getFarmerId())
                .deliveryPartnerId(assignedPartnerId)
                .assignmentStatus(assignedPartnerId != null ? "ACCEPTED" : "AVAILABLE")
                .assignedAt(Instant.now())
                .currentStatus(assignedPartnerId != null ? "ACCEPTED" : "AVAILABLE")
                .build();
        deliveryAssignmentRepository.save(assignment);

        String message = assignedPartnerId != null 
                ? "Order accepted and auto-assigned to delivery partner"
                : "Order accepted and added to available pool";

        return ResponseEntity.ok(ApiResponse.success(message, orderMapper.toResponse(order)));
    }
}
