package com.agrilink.entity.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "otp_verifications")
public class OTPVerification {
    @Id
    private String id;

    private String target; // email or mobile
    private String otp;
    private Instant expiresAt;

    @Builder.Default
    private boolean verified = false;

    @CreatedDate
    private Instant createdAt;
}
