package com.agrilink.repository;

import com.agrilink.entity.delivery.DeliveryAssignment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryAssignmentRepository extends MongoRepository<DeliveryAssignment, String> {
    Optional<DeliveryAssignment> findByOrderId(String orderId);
    List<DeliveryAssignment> findByAssignmentStatus(String assignmentStatus);
    List<DeliveryAssignment> findByDeliveryPartnerId(String deliveryPartnerId);
    List<DeliveryAssignment> findByDeliveryPartnerIdAndAssignmentStatus(String deliveryPartnerId, String assignmentStatus);
}
