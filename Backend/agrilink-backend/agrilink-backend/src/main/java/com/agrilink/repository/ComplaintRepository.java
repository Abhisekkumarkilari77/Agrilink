package com.agrilink.repository;

import com.agrilink.entity.complaint.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    List<Complaint> findByStatus(String status);
    List<Complaint> findByUserId(String userId);
}
