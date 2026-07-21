package com.agrilink.service;

import com.agrilink.dto.auth.*;
import com.agrilink.entity.auth.User;
import com.agrilink.response.ApiResponse;

public interface AuthService {
    ApiResponse<JwtAuthenticationResponse> login(LoginRequest request);
    
    ApiResponse<User> registerCustomer(CustomerRegisterRequest request);
    ApiResponse<User> registerFarmer(FarmerRegisterRequest request);
    ApiResponse<User> registerDelivery(DeliveryRegisterRequest request);
    
    ApiResponse<String> sendOtp(OtpRequest request);
    ApiResponse<?> verifyOtp(OtpRequest request);
    
    ApiResponse<User> getCurrentUser();
    ApiResponse<String> forgotPassword(String email);
    ApiResponse<String> resetPassword(String otp, String newPassword);
}
