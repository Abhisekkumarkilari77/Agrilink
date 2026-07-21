package com.agrilink.entity.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    @Id
    private String id;

    @Indexed
    private String farmerId;

    private String farmerName;
    private String farmName;

    @TextIndexed
    private String name;

    @Indexed
    private String category;

    private double price;
    private int quantity;

    @Builder.Default
    private boolean organic = false;

    @Builder.Default
    private double rating = 0.0;

    private double distance;
    private String harvestDate;
    private String freshness;

    @TextIndexed
    private String description;

    private String image;

    @Builder.Default
    private String status = "Available";

    @Builder.Default
    private int ordersReceived = 0;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
