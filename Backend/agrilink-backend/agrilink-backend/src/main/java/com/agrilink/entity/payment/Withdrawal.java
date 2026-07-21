package com.agrilink.entity.payment;

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
@Document(collection = "withdrawals")
public class Withdrawal {
    @Id
    private String id;

    @Indexed
    private String userId;

    private double amount;
    private String bankDetails;
    private String status;

    @CreatedDate
    private Instant createdAt;
}
