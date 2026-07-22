package com.agrilink.controller.admin;

import com.agrilink.entity.auth.User;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/pending-farmers")
    public ResponseEntity<ApiResponse<List<User>>> getPendingFarmers() {
        return ResponseEntity.ok(adminService.getPendingFarmers());
    }

    @GetMapping("/pending-delivery-partners")
    public ResponseEntity<ApiResponse<List<User>>> getPendingDeliveryPartners() {
        return ResponseEntity.ok(adminService.getPendingDeliveryPartners());
    }

    @PutMapping("/users/{userId}/approve")
    public ResponseEntity<ApiResponse<User>> approveUser(@PathVariable String userId) {
        return ResponseEntity.ok(adminService.approveUser(userId));
    }

    @PutMapping("/users/{userId}/reject")
    public ResponseEntity<ApiResponse<User>> rejectUser(@PathVariable String userId, @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(adminService.rejectUser(userId, reason));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getDashboardData() {
        return ResponseEntity.ok(adminService.getDashboardData());
    }
}
