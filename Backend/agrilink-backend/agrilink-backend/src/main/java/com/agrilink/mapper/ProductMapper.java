package com.agrilink.mapper;

import com.agrilink.dto.product.ProductResponse;
import com.agrilink.entity.product.Product;
import com.agrilink.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final ReviewRepository reviewRepository;

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .farmerId(product.getFarmerId())
                .farmerName(product.getFarmerName())
                .farmName(product.getFarmName())
                .category(product.getCategory())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .organic(product.isOrganic())
                .rating(product.getRating())
                .distance(product.getDistance())
                .harvestDate(product.getHarvestDate())
                .freshness(product.getFreshness())
                .description(product.getDescription())
                .image(product.getImage())
                .status(product.getStatus())
                .ordersReceived(product.getOrdersReceived())
                .reviews(reviewRepository.findByProductId(product.getId()))
                .build();
    }
}
