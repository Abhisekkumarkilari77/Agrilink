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

    @GetMapping("/orders/{deliveryPartnerId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersForDeliveryPartner(
            @PathVariable String deliveryPartnerId) {
        return ResponseEntity.ok(deliveryService.getOrdersForDeliveryPartner(deliveryPartnerId));
    }

    @PostMapping("/{orderId}/generate-pickup-otp")
    public ResponseEntity<ApiResponse<OrderResponse>> generatePickupOtp(
            @PathVariable String orderId) {
        return ResponseEntity.ok(deliveryService.generatePickupOtp(orderId));
    }

    @PostMapping("/{orderId}/verify-pickup-otp")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyPickupOtp(
            @PathVariable String orderId,
            @RequestParam String otp) {
        return ResponseEntity.ok(deliveryService.verifyPickupOtp(orderId, otp));
    }

    @PostMapping("/{orderId}/confirm-payment")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmPayment(
            @PathVariable String orderId,
            @RequestParam String paymentMethod) {
        return ResponseEntity.ok(deliveryService.confirmPaymentAndCompleteDelivery(orderId, paymentMethod));
    }

    @PostMapping("/{orderId}/verify-otp")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyDeliveryOtp(
            @PathVariable String orderId,
            @RequestParam String otp) {
        return ResponseEntity.ok(deliveryService.verifyDeliveryOtp(orderId, otp));
    }

    // New Mapped APIs for Delivery Assignments Flow
    @GetMapping("/orders/available")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAvailableOrdersList() {
        return ResponseEntity.ok(orderService.getAvailableOrdersForDelivery());
    }

    @PostMapping("/orders/{orderId}/accept")
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrderPost(@PathVariable String orderId) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        com.agrilink.security.CustomUserDetails userDetails = (com.agrilink.security.CustomUserDetails) auth.getPrincipal();
        String deliveryPartnerId = userDetails.getId();
        return ResponseEntity.ok(deliveryService.acceptOrder(deliveryPartnerId, orderId));
    }

    @PostMapping("/orders/{orderId}/pickup/generate")
    public ResponseEntity<ApiResponse<OrderResponse>> generatePickupOtpPost(@PathVariable String orderId) {
        return ResponseEntity.ok(deliveryService.generatePickupOtp(orderId));
    }

    @PostMapping("/orders/{orderId}/pickup")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyPickupOtpPost(
            @PathVariable String orderId,
            @RequestParam String otp) {
        return ResponseEntity.ok(deliveryService.verifyPickupOtp(orderId, otp));
    }

    @PostMapping("/orders/{orderId}/complete")
    public ResponseEntity<ApiResponse<OrderResponse>> completeDeliveryPost(
            @PathVariable String orderId,
            @RequestParam String paymentMethod) {
        return ResponseEntity.ok(deliveryService.confirmPaymentAndCompleteDelivery(orderId, paymentMethod));
    }
}
