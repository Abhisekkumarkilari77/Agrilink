package com.agrilink.entity.payment;

import com.agrilink.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;

    @Indexed
    private String orderId;

    @Indexed
    private String userId;

    private double amount;
    private String method;

    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    private String transactionId;

    @CreatedDate
    private Instant createdAt;
}
