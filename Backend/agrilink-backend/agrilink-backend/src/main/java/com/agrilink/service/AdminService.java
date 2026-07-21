package com.agrilink.service;

import com.agrilink.entity.auth.User;
import com.agrilink.response.ApiResponse;

import java.util.List;

public interface AdminService {
    ApiResponse<List<User>> getPendingFarmers();
    ApiResponse<List<User>> getPendingDeliveryPartners();
    
    ApiResponse<User> approveUser(String userId);
    ApiResponse<User> rejectUser(String userId, String reason);
}
