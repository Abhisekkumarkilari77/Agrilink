package com.agrilink.entity.order;

import com.agrilink.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;

    @Indexed
    private String userId;

    private String customerName;

    private List<OrderItem> items;

    private String address;
    private String deliverySlot;
    private String paymentMethod;
    private double total;

    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Builder.Default
    private List<String> trackingSteps = new ArrayList<>();

    private String deliveryPartnerId;
    private String farmerId;

    // Delivery & OTP flow enhancements
    private String pickupStatus;
    private String deliveryStatus;
    private Instant pickupTime;
    private Instant deliveryTime;
    private String deliveryAssignmentStatus;
    private Instant deliveryAcceptedAt;
    private Instant deliveryCompletedAt;
    private String paymentStatus;
    private String transactionId;
    private Instant paymentTime;
    private Double amountPaid;
    private Boolean paymentCollected;
    private Boolean otpVerified;
    private String otpGenerated;
    private Instant otpGeneratedAt;
    private Instant otpExpiry;
    private Integer otpAttempts;
    private Instant otpVerifiedAt;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
