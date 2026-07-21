package com.agrilink.repository;

import com.agrilink.entity.farmer.Farm;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmRepository extends MongoRepository<Farm, String> {
    Optional<Farm> findByFarmerId(String farmerId);
}
