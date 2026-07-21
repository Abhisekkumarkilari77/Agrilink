package com.agrilink.repository;

import com.agrilink.entity.delivery.DeliveryPartner;
import com.agrilink.enums.AccountStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends MongoRepository<DeliveryPartner, String> {
    Optional<DeliveryPartner> findByUserId(String userId);
    List<DeliveryPartner> findByIsOnlineTrue();
    List<DeliveryPartner> findByStatus(AccountStatus status);
}
