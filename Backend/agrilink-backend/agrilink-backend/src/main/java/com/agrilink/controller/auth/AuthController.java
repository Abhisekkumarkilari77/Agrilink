package com.agrilink.controller.auth;

import com.agrilink.dto.auth.*;
import com.agrilink.entity.auth.User;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthenticationResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register/customer")
    public ResponseEntity<ApiResponse<User>> registerCustomer(@Valid @RequestBody CustomerRegisterRequest request) {
        return ResponseEntity.ok(authService.registerCustomer(request));
    }

    @PostMapping("/register/farmer")
    public ResponseEntity<ApiResponse<User>> registerFarmer(@Valid @RequestBody FarmerRegisterRequest request) {
        return ResponseEntity.ok(authService.registerFarmer(request));
    }

    @PostMapping("/register/delivery")
    public ResponseEntity<ApiResponse<User>> registerDelivery(@Valid @RequestBody DeliveryRegisterRequest request) {
        return ResponseEntity.ok(authService.registerDelivery(request));
    }

    @PostMapping({"/otp/send", "/send-otp"})
    public ResponseEntity<ApiResponse<String>> sendOtp(@Valid @RequestBody OtpRequest request) {
        return ResponseEntity.ok(authService.sendOtp(request));
    }

    @PostMapping({"/otp/verify", "/verify-otp"})
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody OtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam String email) {
        return ResponseEntity.ok(authService.forgotPassword(email));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestParam String otp, @RequestParam String newPassword) {
        return ResponseEntity.ok(authService.resetPassword(otp, newPassword));
    }
}
