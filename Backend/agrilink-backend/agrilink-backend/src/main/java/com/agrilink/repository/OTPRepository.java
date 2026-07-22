package com.agrilink.repository;

import com.agrilink.entity.auth.OTPVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OTPRepository extends MongoRepository<OTPVerification, String> {
    Optional<OTPVerification> findByTargetAndVerifiedFalse(String target);
    Optional<OTPVerification> findTopByTargetOrderByCreatedAtDesc(String target);
    Optional<OTPVerification> findTopByOtpOrderByCreatedAtDesc(String otp);
    void deleteByTarget(String target);
}
