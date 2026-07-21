package com.agrilink.entity.complaint;

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
@Document(collection = "complaints")
public class Complaint {
    @Id
    private String id;

    private String type;    // CUSTOMER, FARMER, DELIVERY
    private String title;
    private String detail;

    @Indexed
    private String orderId;

    @Indexed
    private String userId;

    @Builder.Default
    private String status = "PENDING";

    @CreatedDate
    private Instant createdAt;
}
