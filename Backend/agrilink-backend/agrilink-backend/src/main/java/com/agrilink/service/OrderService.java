package com.agrilink.service;

import com.agrilink.dto.order.OrderRequest;
import com.agrilink.dto.order.OrderResponse;
import com.agrilink.enums.OrderStatus;
import com.agrilink.response.ApiResponse;

import java.util.List;

public interface OrderService {
    ApiResponse<OrderResponse> createOrder(String userId, OrderRequest request);
    ApiResponse<OrderResponse> getOrderById(String orderId);
    
    ApiResponse<List<OrderResponse>> getCustomerOrders(String userId);
    ApiResponse<List<OrderResponse>> getFarmerOrders(String farmerId);
    ApiResponse<List<OrderResponse>> getDeliveryPartnerOrders(String deliveryPartnerId);
    
    ApiResponse<OrderResponse> updateOrderStatus(String orderId, OrderStatus status);
    ApiResponse<OrderResponse> assignDeliveryPartner(String orderId, String deliveryPartnerId);
    
    ApiResponse<List<OrderResponse>> getAvailableOrdersForDelivery();
    ApiResponse<OrderResponse> updateOrderTracking(String orderId, String trackingStep, OrderStatus status);
}
