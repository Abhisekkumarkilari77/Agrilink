package com.agrilink.entity.product;

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
@Document(collection = "product_reviews")
public class ProductReview {
    @Id
    private String id;

    @Indexed
    private String productId;

    @Indexed
    private String userId;

    private String userName;
    private double rating;
    private String comment;

    @CreatedDate
    private Instant createdAt;
}
