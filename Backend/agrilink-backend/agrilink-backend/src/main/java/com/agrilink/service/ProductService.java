package com.agrilink.service;

import com.agrilink.dto.product.ProductRequest;
import com.agrilink.dto.product.ProductResponse;
import com.agrilink.response.ApiResponse;

import java.util.List;

public interface ProductService {
    ApiResponse<ProductResponse> createProduct(String farmerId, ProductRequest request);
    ApiResponse<ProductResponse> updateProduct(String productId, ProductRequest request);
    ApiResponse<Void> deleteProduct(String productId);
    
    ApiResponse<ProductResponse> getProductById(String productId);
    ApiResponse<List<ProductResponse>> getAllProducts();
    ApiResponse<List<ProductResponse>> getProductsByFarmer(String farmerId);
    ApiResponse<List<ProductResponse>> searchProducts(String query);
    ApiResponse<List<ProductResponse>> getProductsByCategory(String category);
}
