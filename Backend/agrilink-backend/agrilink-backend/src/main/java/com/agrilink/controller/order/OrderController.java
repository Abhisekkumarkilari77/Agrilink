package com.agrilink.controller.order;

import com.agrilink.dto.order.OrderRequest;
import com.agrilink.dto.order.OrderResponse;
import com.agrilink.enums.OrderStatus;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/customer/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@PathVariable String userId, @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(userId, request));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/customer/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getCustomerOrders(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getCustomerOrders(userId));
    }

    @GetMapping("/farmer/{farmerId}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getFarmerOrders(@PathVariable String farmerId) {
        return ResponseEntity.ok(orderService.getFarmerOrders(farmerId));
    }

    @GetMapping("/delivery/{deliveryPartnerId}")
    @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getDeliveryPartnerOrders(@PathVariable String deliveryPartnerId) {
        return ResponseEntity.ok(orderService.getDeliveryPartnerOrders(deliveryPartnerId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(@PathVariable String orderId, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @PutMapping("/{orderId}/assign/{deliveryPartnerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> assignDeliveryPartner(@PathVariable String orderId, @PathVariable String deliveryPartnerId) {
        return ResponseEntity.ok(orderService.assignDeliveryPartner(orderId, deliveryPartnerId));
    }
}
