package com.agrilink.entity.delivery;

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
@Document(collection = "delivery_otps")
public class DeliveryOTP {
    @Id
    private String id;

    @Indexed
    private String orderId;

    @Indexed
    private String customerId;

    @Indexed
    private String deliveryPartnerId;

    private String otp;
    private Instant generatedAt;
    private Instant expiresAt;
    private Instant verifiedAt;

    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, VERIFIED, EXPIRED

    @Builder.Default
    private int attempts = 0;
}
