package com.agrilink.entity.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "refunds")
public class Refund {
    @Id
    private String id;

    @Indexed
    private String paymentId;

    @Indexed
    private String orderId;

    private double amount;
    private String reason;
    private String status;

    private Instant createdAt;
}
