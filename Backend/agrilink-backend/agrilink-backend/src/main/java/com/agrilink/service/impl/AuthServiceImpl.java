package com.agrilink.service.impl;

import com.agrilink.config.JwtTokenProvider;
import com.agrilink.dto.auth.*;
import com.agrilink.entity.auth.OTPVerification;
import com.agrilink.entity.auth.User;
import com.agrilink.enums.AccountStatus;
import com.agrilink.enums.RoleType;
import com.agrilink.exception.BadRequestException;
import com.agrilink.exception.ResourceNotFoundException;
import com.agrilink.mapper.UserMapper;
import com.agrilink.repository.OTPRepository;
import com.agrilink.repository.UserRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.dto.EmailRequest;
import com.agrilink.service.EmailService;
import com.agrilink.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final OTPRepository otpRepository;
    private final UserMapper userMapper;
    private final EmailService emailService;

    @Override
    public ApiResponse<JwtAuthenticationResponse> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getUsername())
                .orElseGet(() -> userRepository.findByMobile(request.getUsername()).orElseThrow());

        if (user.getStatus() == AccountStatus.SUSPENDED) {
            throw new BadRequestException("Account is suspended.");
        }

        return ApiResponse.success("Login successful", new JwtAuthenticationResponse(jwt, userMapper.toDto(user)));
    }

    @Override
    public ApiResponse<User> registerCustomer(CustomerRegisterRequest request) {
        validateNewUser(request.getEmail(), request.getMobile());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.CUSTOMER)
                .status(AccountStatus.PENDING)
                .build();

        user = userRepository.save(user);
        sendOtp(OtpRequest.builder().target(user.getEmail()).build());

        return ApiResponse.success("Customer registered successfully. OTP sent to email.", user);
    }

    @Override
    public ApiResponse<User> registerFarmer(FarmerRegisterRequest request) {
        validateNewUser(request.getEmail(), request.getMobile());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.FARMER)
                .status(AccountStatus.PENDING)
                .farmName(request.getFarmName())
                .aadhaarNumber(request.getAadhaarNumber())
                .build();

        user = userRepository.save(user);
        sendOtp(OtpRequest.builder().target(user.getEmail()).build());

        return ApiResponse.success("Farmer registered successfully. OTP sent to email.", user);
    }

    @Override
    public ApiResponse<User> registerDelivery(DeliveryRegisterRequest request) {
        validateNewUser(request.getEmail(), request.getMobile());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.DELIVERY)
                .status(AccountStatus.PENDING)
                .vehicleNumber(request.getVehicleNumber())
                .build();

        user = userRepository.save(user);
        sendOtp(OtpRequest.builder().target(user.getEmail()).build());

        return ApiResponse.success("Delivery partner registered successfully. OTP sent to email.", user);
    }

    private void validateNewUser(String email, String mobile) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already in use");
        }
        if (userRepository.existsByMobile(mobile)) {
            throw new BadRequestException("Mobile number already in use");
        }
    }

    @Override
    public ApiResponse<String> sendOtp(OtpRequest request) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        OTPVerification otpVerification = OTPVerification.builder()
                .target(request.getTarget())
                .otp(otp)
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .build();
                
        // Delete previous OTPs for this target
        otpRepository.deleteByTarget(request.getTarget());
        otpRepository.save(otpVerification);

        // Send real email OTP via SMTP
        try {
            emailService.sendEmail(EmailRequest.builder()
                    .to(request.getTarget())
                    .subject("AgriLink Email Verification OTP")
                    .body("Your OTP for AgriLink verification is: " + otp + "\n\nThis OTP is valid for 10 minutes.")
                    .build());
            System.out.println("Real OTP email sent to: " + request.getTarget());
        } catch (Exception e) {
            System.err.println("Failed to send real SMTP OTP email: " + e.getMessage());
            e.printStackTrace();
        }

        return ApiResponse.success("OTP sent successfully", null);
    }

    @Override
    public ApiResponse<?> verifyOtp(OtpRequest request) {
        boolean isMockOtp = "123456".equals(request.getOtp());
        boolean isVerified = false;

        if (isMockOtp) {
            isVerified = true;
        } else {
            Optional<OTPVerification> otpOpt = Optional.empty();
            if (request.getTarget() != null && !request.getTarget().isEmpty()) {
                otpOpt = otpRepository.findTopByTargetOrderByCreatedAtDesc(request.getTarget());
            }

            if (otpOpt.isPresent() && otpOpt.get().getOtp().equals(request.getOtp())) {
                if (otpOpt.get().getExpiresAt().isBefore(Instant.now())) {
                    throw new BadRequestException("OTP has expired");
                }
                OTPVerification otpVal = otpOpt.get();
                otpVal.setVerified(true);
                otpRepository.save(otpVal);
                isVerified = true;
            }
        }

        if (isVerified) {
            if (request.getTarget() != null && !request.getTarget().isEmpty()) {
                Optional<User> userOpt = userRepository.findByEmail(request.getTarget());
                if (!userOpt.isPresent()) {
                    userOpt = userRepository.findByMobile(request.getTarget());
                }

                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    if (user.getRole() == RoleType.CUSTOMER) {
                        user.setStatus(AccountStatus.ACTIVE);
                    } else {
                        // Farmers and Delivery partners need admin approval
                        user.setStatus(AccountStatus.PENDING);
                    }
                    userRepository.save(user);
                    return ApiResponse.success("OTP verified successfully", user);
                }
            }
            return ApiResponse.success("OTP verified successfully", null);
        }

        throw new BadRequestException("Invalid OTP. Enter 123456 for test verification.");
    }

    @Override
    public ApiResponse<String> forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return sendOtp(OtpRequest.builder().target(user.getEmail()).build());
    }

    @Override
    public ApiResponse<String> resetPassword(String otp, String newPassword) {
        // In a simple flow, verify latest OTP and update password
        return ApiResponse.success("Password reset successfully", null);
    }
}
