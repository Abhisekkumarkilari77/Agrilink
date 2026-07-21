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
@Document(collection = "delivery_trackings")
public class DeliveryTracking {
    @Id
    private String id;

    @Indexed
    private String orderId;

    @Indexed
    private String partnerId;

    private String status;
    private String pickupOtp;
    private String deliveryOtp;

    private Instant assignedAt;
    private Instant acceptedAt;
    private Instant pickedUpAt;
    private Instant deliveredAt;
}
