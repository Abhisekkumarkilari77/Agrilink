package com.agrilink.controller.delivery;

import com.agrilink.dto.order.OrderResponse;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.DeliveryService;
import com.agrilink.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DELIVERY')")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final OrderService orderService;

    @GetMapping("/available-orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAvailableOrders() {
        return ResponseEntity.ok(orderService.getAvailableOrdersForDelivery());
    }

    @PostMapping("/{deliveryPartnerId}/accept/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(
            @PathVariable String deliveryPartnerId,
            @PathVariable String orderId) {
        return ResponseEntity.ok(deliveryService.acceptOrder(deliveryPartnerId, orderId));
    }

    @PostMapping("/{orderId}/verify-pickup")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyPickupOtp(
            @PathVariable String orderId,
            @RequestParam String otp) {
        return ResponseEntity.ok(deliveryService.verifyPickupOtp(orderId, otp));
    }

    @PostMapping("/{orderId}/verify-delivery")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyDeliveryOtp(
            @PathVariable String orderId,
            @RequestParam String otp) {
        return ResponseEntity.ok(deliveryService.verifyDeliveryOtp(orderId, otp));
    }
}
