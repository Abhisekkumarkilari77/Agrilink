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
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/farmer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FARMER')")
public class FarmerController {

    private final OrderRepository orderRepository;
    private final DeliveryAssignmentRepository deliveryAssignmentRepository;
    private final OrderMapper orderMapper;

    @PutMapping("/orders/{orderId}/accept")
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(@PathVariable String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Update Order
        order.setStatus(OrderStatus.FARMER_ACCEPTED);
        order.setDeliveryAssignmentStatus("AVAILABLE");
        order.getTrackingSteps().add("Farmer Accepted Order");
        order = orderRepository.save(order);

        // Create Delivery Assignment
        DeliveryAssignment assignment = DeliveryAssignment.builder()
                .orderId(order.getId())
                .customerId(order.getUserId())
                .farmerId(order.getFarmerId())
                .assignmentStatus("AVAILABLE")
                .assignedAt(Instant.now())
                .currentStatus("AVAILABLE")
                .build();
        deliveryAssignmentRepository.save(assignment);

        return ResponseEntity.ok(ApiResponse.success("Order accepted and delivery assignment created", orderMapper.toResponse(order)));
    }
}
