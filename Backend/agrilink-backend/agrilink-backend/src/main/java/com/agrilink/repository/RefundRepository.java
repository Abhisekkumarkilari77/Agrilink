package com.agrilink.repository;

import com.agrilink.entity.payment.Refund;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundRepository extends MongoRepository<Refund, String> {
    List<Refund> findByOrderId(String orderId);
}
