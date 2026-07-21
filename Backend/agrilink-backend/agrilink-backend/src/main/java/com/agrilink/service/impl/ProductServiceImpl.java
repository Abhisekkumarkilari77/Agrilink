package com.agrilink.service.impl;

import com.agrilink.dto.product.ProductRequest;
import com.agrilink.dto.product.ProductResponse;
import com.agrilink.entity.auth.User;
import com.agrilink.entity.product.Product;
import com.agrilink.exception.ResourceNotFoundException;
import com.agrilink.mapper.ProductMapper;
import com.agrilink.repository.ProductRepository;
import com.agrilink.repository.UserRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Override
    public ApiResponse<ProductResponse> createProduct(String farmerId, ProductRequest request) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        Product product = Product.builder()
                .farmerId(farmerId)
                .farmerName(farmer.getName())
                .farmName(farmer.getFarmName())
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .organic(Boolean.TRUE.equals(request.getOrganic()))
                .description(request.getDescription())
                .image(request.getImage())
                .build();

        product = productRepository.save(product);
        return ApiResponse.success("Product created successfully", productMapper.toResponse(product));
    }

    @Override
    public ApiResponse<ProductResponse> updateProduct(String productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setOrganic(Boolean.TRUE.equals(request.getOrganic()));
        product.setDescription(request.getDescription());
        
        if (request.getImage() != null) {
            product.setImage(request.getImage());
        }

        product = productRepository.save(product);
        return ApiResponse.success("Product updated successfully", productMapper.toResponse(product));
    }

    @Override
    public ApiResponse<Void> deleteProduct(String productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(productId);
        return ApiResponse.success("Product deleted successfully", null);
    }

    @Override
    public ApiResponse<ProductResponse> getProductById(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return ApiResponse.success("Product fetched successfully", productMapper.toResponse(product));
    }

    @Override
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productRepository.findAll().stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Products fetched successfully", products);
    }

    @Override
    public ApiResponse<List<ProductResponse>> getProductsByFarmer(String farmerId) {
        List<ProductResponse> products = productRepository.findByFarmerId(farmerId).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Farmer products fetched successfully", products);
    }

    @Override
    public ApiResponse<List<ProductResponse>> searchProducts(String query) {
        List<ProductResponse> products = productRepository.searchProducts(query).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Search results fetched successfully", products);
    }

    @Override
    public ApiResponse<List<ProductResponse>> getProductsByCategory(String category) {
        List<ProductResponse> products = productRepository.findByCategory(category).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Category products fetched successfully", products);
    }
}
