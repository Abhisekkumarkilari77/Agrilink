package com.agrilink.repository;

import com.agrilink.entity.auth.User;
import com.agrilink.enums.AccountStatus;
import com.agrilink.enums.RoleType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    Optional<User> findByEmailOrMobile(String email, String mobile);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
    List<User> findByRole(RoleType role);
    List<User> findByStatus(AccountStatus status);
    List<User> findByRoleAndStatus(RoleType role, AccountStatus status);
}
