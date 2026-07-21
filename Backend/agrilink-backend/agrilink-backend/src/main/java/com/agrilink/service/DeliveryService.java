package com.agrilink.service;

import com.agrilink.dto.order.OrderResponse;
import com.agrilink.response.ApiResponse;

public interface DeliveryService {
    ApiResponse<OrderResponse> acceptOrder(String deliveryPartnerId, String orderId);
    ApiResponse<OrderResponse> verifyPickupOtp(String orderId, String otp);
    ApiResponse<OrderResponse> verifyDeliveryOtp(String orderId, String otp);
}
