package com.agrilink.service.impl;

import com.agrilink.entity.auth.User;
import com.agrilink.enums.AccountStatus;
import com.agrilink.enums.RoleType;
import com.agrilink.exception.ResourceNotFoundException;
import com.agrilink.repository.UserRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    public ApiResponse<List<User>> getPendingFarmers() {
        List<User> pendingFarmers = userRepository.findByRoleAndStatus(RoleType.FARMER, AccountStatus.PENDING);
        return ApiResponse.success("Pending farmers fetched successfully", pendingFarmers);
    }

    @Override
    public ApiResponse<List<User>> getPendingDeliveryPartners() {
        List<User> pendingDelivery = userRepository.findByRoleAndStatus(RoleType.DELIVERY, AccountStatus.PENDING);
        return ApiResponse.success("Pending delivery partners fetched successfully", pendingDelivery);
    }

    @Override
    public ApiResponse<User> approveUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setStatus(AccountStatus.ACTIVE);
        user = userRepository.save(user);

        return ApiResponse.success("User approved successfully", user);
    }

    @Override
    public ApiResponse<User> rejectUser(String userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setStatus(AccountStatus.REJECTED);
        // Optionally store the reason in a new 'rejectionReason' field if we add it to the User entity later
        user = userRepository.save(user);

        return ApiResponse.success("User rejected", user);
    }
}
