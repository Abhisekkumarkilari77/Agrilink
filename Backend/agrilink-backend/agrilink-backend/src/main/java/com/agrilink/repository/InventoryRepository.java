package com.agrilink.repository;

import com.agrilink.entity.farmer.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends MongoRepository<Inventory, String> {
    List<Inventory> findByFarmerId(String farmerId);
    Optional<Inventory> findByProductId(String productId);
}
