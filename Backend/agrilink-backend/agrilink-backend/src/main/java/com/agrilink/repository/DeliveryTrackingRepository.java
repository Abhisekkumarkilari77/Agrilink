package com.agrilink.repository;

import com.agrilink.entity.delivery.DeliveryTracking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryTrackingRepository extends MongoRepository<DeliveryTracking, String> {
    Optional<DeliveryTracking> findByOrderId(String orderId);
}
