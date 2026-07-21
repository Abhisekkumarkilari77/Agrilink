package com.agrilink.service;

import com.agrilink.dto.order.OrderResponse;
import com.agrilink.response.ApiResponse;

import java.util.List;

public interface DeliveryService {
    ApiResponse<OrderResponse> acceptOrder(String deliveryPartnerId, String orderId);
    ApiResponse<List<OrderResponse>> getOrdersForDeliveryPartner(String deliveryPartnerId);
    ApiResponse<OrderResponse> generatePickupOtp(String orderId);
    ApiResponse<OrderResponse> verifyPickupOtp(String orderId, String otp);
    ApiResponse<OrderResponse> confirmPaymentAndCompleteDelivery(String orderId, String paymentMethod);
    ApiResponse<OrderResponse> verifyDeliveryOtp(String orderId, String otp);
}
