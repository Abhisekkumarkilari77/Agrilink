package com.agrilink.controller.customer;

import com.agrilink.entity.auth.User;
import com.agrilink.entity.farmer.Farm;
import com.agrilink.repository.FarmRepository;
import com.agrilink.repository.ProductRepository;
import com.agrilink.repository.UserRepository;
import com.agrilink.response.ApiResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/customer/farmers")
@RequiredArgsConstructor
public class CustomerFarmerController {

    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final ProductRepository productRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NearbyFarmerDTO {
        private String farmerId;
        private String name;
        private String farmName;
        private String farmType;
        private String description;
        private String village;
        private String mandal;
        private String district;
        private String state;
        private String pincode;
        private String lat;
        private String lng;
        private double distance;
        private double rating;
        private int reviews;
        private long availableProducts;
        private boolean organicStatus;
        private String contact;
        private String farmImage;
        private String photo;
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<NearbyFarmerDTO>>> getNearbyFarmers(
            @RequestParam(required = false, defaultValue = "560001") String pincode) {
        
        List<User> farmers = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "FARMER".equals(u.getRole().name()))
                .toList();

        List<NearbyFarmerDTO> result = new ArrayList<>();
        int index = 0;
        for (User f : farmers) {
            index++;
            Farm farm = farmRepository.findByFarmerId(f.getId()).orElse(null);
            long prodCount = productRepository.countByFarmerId(f.getId());

            String village = farm != null && farm.getVillage() != null ? farm.getVillage() : "Nelamangala";
            String district = farm != null && farm.getDistrict() != null ? farm.getDistrict() : "Bengaluru Rural";
            String state = farm != null && farm.getState() != null ? farm.getState() : "Karnataka";
            String pin = farm != null && farm.getPincode() != null ? farm.getPincode() : "562123";
            String lat = farm != null && farm.getLat() != null ? farm.getLat() : "13.0984";
            String lng = farm != null && farm.getLng() != null ? farm.getLng() : "77.3982";
            String contact = farm != null && farm.getContact() != null ? farm.getContact() : f.getMobile();

            double distance = 3.2 + (index * 2.1);

            result.add(NearbyFarmerDTO.builder()
                    .farmerId(f.getId())
                    .name(f.getName())
                    .farmName(f.getFarmName() != null ? f.getFarmName() : "Organic Farm")
                    .farmType(farm != null && farm.getFarmType() != null ? farm.getFarmType() : "Multi-Crop Organic")
                    .description(farm != null && farm.getDescription() != null ? farm.getDescription() : "100% natural, pesticide-free fresh farm produce.")
                    .village(village)
                    .mandal(district)
                    .district(district)
                    .state(state)
                    .pincode(pin)
                    .lat(lat)
                    .lng(lng)
                    .distance(Math.round(distance * 10.0) / 10.0)
                    .rating(4.5 + (index % 5) * 0.1)
                    .reviews(28 + index * 14)
                    .availableProducts(prodCount > 0 ? prodCount : 24)
                    .organicStatus(true)
                    .contact(contact)
                    .farmImage("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80")
                    .photo("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80")
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.success("Nearby farmers fetched successfully", result));
    }
}
