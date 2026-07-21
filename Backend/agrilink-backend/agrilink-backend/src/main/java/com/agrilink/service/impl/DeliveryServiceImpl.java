package com.agrilink.service.impl;

import com.agrilink.dto.order.OrderResponse;
import com.agrilink.entity.delivery.DeliveryTracking;
import com.agrilink.enums.OrderStatus;
import com.agrilink.exception.BadRequestException;
import com.agrilink.exception.ResourceNotFoundException;
import com.agrilink.repository.DeliveryTrackingRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.DeliveryService;
import com.agrilink.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final OrderService orderService;
    private final DeliveryTrackingRepository trackingRepository;

    @Override
    public ApiResponse<OrderResponse> acceptOrder(String deliveryPartnerId, String orderId) {
        // Assign the delivery partner using OrderService
        ApiResponse<OrderResponse> response = orderService.assignDeliveryPartner(orderId, deliveryPartnerId);
        
        // Create delivery tracking record
        DeliveryTracking tracking = DeliveryTracking.builder()
                .orderId(orderId)
                .partnerId(deliveryPartnerId)
                .status("ACCEPTED")
                .assignedAt(Instant.now())
                .acceptedAt(Instant.now())
                // In a real app, these OTPs would be generated securely and sent via SMS
                .pickupOtp("1234") 
                .deliveryOtp("5678")
                .build();
                
        trackingRepository.save(tracking);
        
        return ApiResponse.success("Order accepted successfully", response.getData());
    }

    @Override
    public ApiResponse<OrderResponse> verifyPickupOtp(String orderId, String otp) {
        DeliveryTracking tracking = trackingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tracking record not found"));

        if (!tracking.getPickupOtp().equals(otp)) {
            throw new BadRequestException("Invalid pickup OTP");
        }

        tracking.setStatus("PICKED_UP");
        tracking.setPickedUpAt(Instant.now());
        trackingRepository.save(tracking);

        return orderService.updateOrderTracking(orderId, "Order picked up from farm", OrderStatus.PICKED_UP);
    }

    @Override
    public ApiResponse<OrderResponse> verifyDeliveryOtp(String orderId, String otp) {
        DeliveryTracking tracking = trackingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tracking record not found"));

        if (!tracking.getDeliveryOtp().equals(otp)) {
            throw new BadRequestException("Invalid delivery OTP");
        }

        tracking.setStatus("DELIVERED");
        tracking.setDeliveredAt(Instant.now());
        trackingRepository.save(tracking);

        return orderService.updateOrderTracking(orderId, "Order successfully delivered", OrderStatus.DELIVERED);
    }
}
