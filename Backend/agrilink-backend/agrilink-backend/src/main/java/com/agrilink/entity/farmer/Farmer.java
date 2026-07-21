package com.agrilink.entity.farmer;

import com.agrilink.enums.AccountStatus;
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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "farmers")
public class Farmer {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String farmName;
    private String farmType;
    private String description;
    private String aadhaarNumber;

    @Builder.Default
    private AccountStatus status = AccountStatus.PENDING;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
