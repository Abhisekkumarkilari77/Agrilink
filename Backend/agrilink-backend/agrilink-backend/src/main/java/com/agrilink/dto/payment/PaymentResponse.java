package com.agrilink.dto.payment;

import com.agrilink.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String id;
    private String orderId;
    private String userId;
    private double amount;
    private String method;
    private PaymentStatus status;
    private String transactionId;
    private String createdAt;
}
