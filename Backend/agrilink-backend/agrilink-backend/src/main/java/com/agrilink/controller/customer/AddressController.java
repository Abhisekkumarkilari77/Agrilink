package com.agrilink.controller.customer;

import com.agrilink.entity.customer.Address;
import com.agrilink.repository.AddressRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressRepository addressRepository;

    private String getUserId(String requestedUserId) {
        if (requestedUserId != null && !requestedUserId.isEmpty()) {
            return requestedUserId;
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getId();
        }
        return "guest";
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Address>>> getAddresses(@RequestParam(required = false) String userId) {
        String uid = getUserId(userId);
        List<Address> addresses = addressRepository.findByUserId(uid);
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved successfully", addresses));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Address>>> getAddressesByUser(@PathVariable String userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved successfully", addresses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Address>> createAddress(@RequestBody Address address, @RequestParam(required = false) String userId) {
        String uid = getUserId(userId);
        address.setUserId(uid);
        List<Address> existing = addressRepository.findByUserId(uid);
        if (existing.isEmpty()) {
            address.setDefault(true);
        }
        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.success("Address created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Address>> updateAddress(@PathVariable String id, @RequestBody Address address) {
        Address existing = addressRepository.findById(id).orElseThrow(() -> new RuntimeException("Address not found"));
        existing.setName(address.getName());
        existing.setHouseNo(address.getHouseNo());
        existing.setStreet(address.getStreet());
        existing.setLandmark(address.getLandmark());
        existing.setCity(address.getCity());
        existing.setState(address.getState());
        existing.setPincode(address.getPincode());
        existing.setDefault(address.isDefault());
        Address updated = addressRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(@PathVariable String id) {
        addressRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", id));
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<ApiResponse<Address>> setDefaultAddress(@PathVariable String id, @RequestParam(required = false) String userId) {
        String uid = getUserId(userId);
        List<Address> addresses = addressRepository.findByUserId(uid);
        Address target = null;
        for (Address addr : addresses) {
            if (addr.getId().equals(id)) {
                addr.setDefault(true);
                target = addr;
            } else {
                addr.setDefault(false);
            }
        }
        if (target != null) {
            addressRepository.saveAll(addresses);
            return ResponseEntity.ok(ApiResponse.success("Default address updated", target));
        }
        throw new RuntimeException("Address not found");
    }
}
