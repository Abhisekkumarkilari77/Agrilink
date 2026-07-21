package com.agrilink.repository;

import com.agrilink.entity.farmer.Farmer;
import com.agrilink.enums.AccountStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerRepository extends MongoRepository<Farmer, String> {
    Optional<Farmer> findByUserId(String userId);
    List<Farmer> findByStatus(AccountStatus status);
}
