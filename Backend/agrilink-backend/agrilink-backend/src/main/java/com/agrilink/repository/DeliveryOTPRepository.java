package com.agrilink.repository;

import com.agrilink.entity.delivery.DeliveryOTP;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryOTPRepository extends MongoRepository<DeliveryOTP, String> {
    Optional<DeliveryOTP> findTopByOrderIdOrderByGeneratedAtDesc(String orderId);
    void deleteByOrderId(String orderId);
}
