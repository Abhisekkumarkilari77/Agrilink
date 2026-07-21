package com.agrilink.repository;

import com.agrilink.entity.admin.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByAdminIdOrderByTimestampDesc(String adminId);
}
