package com.agrilink.repository;

import com.agrilink.entity.order.Order;
import com.agrilink.enums.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByFarmerId(String farmerId);
    List<Order> findByDeliveryPartnerId(String deliveryPartnerId);
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
}
