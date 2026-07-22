package com.agrilink.repository;

import com.agrilink.entity.product.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByFarmerId(String farmerId);
    
    @Query("{ 'farmerId' : ?0, 'isSeeded' : { '$ne' : true } }")
    List<Product> findByFarmerIdAndNotSeeded(String farmerId);

    long countByFarmerId(String farmerId);

    @Query(value = "{ 'farmerId' : ?0, 'isSeeded' : { '$ne' : true } }", count = true)
    long countByFarmerIdAndNotSeeded(String farmerId);
    List<Product> findByCategory(String category);
    List<Product> findByStatus(String status);

    @Query("{'$or': [{'name': {'$regex': ?0, '$options': 'i'}}, {'category': {'$regex': ?0, '$options': 'i'}}, {'farmerName': {'$regex': ?0, '$options': 'i'}}]}")
    List<Product> searchProducts(String query);

    List<Product> findByNameContainingIgnoreCase(String name);
}
