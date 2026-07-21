package com.agrilink.dto.order;

import com.agrilink.entity.order.OrderItem;
import com.agrilink.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private String date;
    private List<OrderItem> items;
    private String address;
    private String slot;
    private String paymentMethod;
    private double total;
    private OrderStatus status;
    private List<String> trackingSteps;

    // Enhanced details
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String farmerId;
    private String farmerName;
    private String farmerPhone;
    private String farmerAddress;
    private String deliveryPartnerId;
    private String pickupStatus;
    private String deliveryStatus;
    private String deliveryAssignmentStatus;
    private java.time.Instant deliveryAcceptedAt;
    private java.time.Instant deliveryCompletedAt;
    private String paymentStatus;
    private String transactionId;
    private java.time.Instant paymentTime;
    private Double amountPaid;
    private Boolean paymentCollected;
    private Boolean otpVerified;
}
