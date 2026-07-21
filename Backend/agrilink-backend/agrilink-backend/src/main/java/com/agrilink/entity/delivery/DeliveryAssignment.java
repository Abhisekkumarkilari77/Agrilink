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
@Document(collection = "deliveryAssignments")
public class DeliveryAssignment {
    @Id
    private String id;

    @Indexed
    private String orderId;

    @Indexed
    private String customerId;

    @Indexed
    private String farmerId;

    @Indexed
    private String deliveryPartnerId;

    private String assignmentStatus; // AVAILABLE, ACCEPTED, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED
    private Instant assignedAt;
    private Instant acceptedAt;
    private Instant pickedUpAt;
    private Instant deliveredAt;
    private String currentStatus;
}
