package com.agrilink.dto.product;

import com.agrilink.entity.product.ProductReview;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private String farmerId;
    private String farmerName;
    private String farmName;
    private String category;
    private double price;
    private int quantity;
    private boolean organic;
    private double rating;
    private double distance;
    private String harvestDate;
    private String freshness;
    private String description;
    private String image;
    private String status;
    private int ordersReceived;
    private List<ProductReview> reviews;
}
