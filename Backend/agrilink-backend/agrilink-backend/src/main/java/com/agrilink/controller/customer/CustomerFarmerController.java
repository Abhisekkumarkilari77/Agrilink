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

        if (farmers.size() <= 5) {
            // Return the 7 default nearby farmers/locations
            result.add(NearbyFarmerDTO.builder()
                    .farmerId("f-1")
                    .name("Kishore Kumar")
                    .farmName("Ananthapuram Paddy Fields")
                    .farmType("Rice & Wheat Millers")
                    .description("Direct whole grain sona masuri rice straight from the agricultural fields of Angallu.")
                    .village("Angallu (Madanapalle Rural)")
                    .mandal("Madanapalle Rural")
                    .district("Chittoor")
                    .state("Andhra Pradesh")
                    .pincode("517325")
                    .lat("13.6415")
                    .lng("78.4322")
                    .distance(6.5)
                    .rating(4.6)
                    .reviews(42)
                    .availableProducts(10)
                    .organicStatus(false)
                    .contact("9908877665")
                    .farmImage("https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=600")
                    .photo("https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200")
                    .build());

            result.add(NearbyFarmerDTO.builder()
                    .farmerId("f-2")
                    .name("Gangadhar Rao")
                    .farmName("Gangadhara Organic Dairy")
                    .farmType("Pure Cow Milk & Butter Ghee")
                    .description("Grass-fed cow milk and unadulterated ghee prepared under strict hygienic conditions near Basinikonda.")
                    .village("Basinikonda Rural")
                    .mandal("Madanapalle Mandi")
                    .district("Chittoor")
                    .state("Andhra Pradesh")
                    .pincode("517325")
                    .lat("13.6212")
                    .lng("78.5211")
                    .distance(2.1)
                    .rating(4.8)
                    .reviews(83)
                    .availableProducts(12)
                    .organicStatus(true)
                    .contact("9121234321")
                    .farmImage("https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600")
                    .photo("https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200")
                    .build());

            result.add(NearbyFarmerDTO.builder()
                    .farmerId("f-3")
                    .name("Mohan Babu")
                    .farmName("Madanapalle Groundnut Farm")
                    .farmType("Premium Groundnuts & Oils")
                    .description("Sun-dried high-yield groundnuts and cold-pressed pure peanut oil from Chittoor agricultural belt.")
                    .village("Nimmanapalle")
                    .mandal("Nimmanapalle")
                    .district("Chittoor")
                    .state("Andhra Pradesh")
                    .pincode("517325")
                    .lat("13.5824")
                    .lng("78.5101")
                    .distance(9.8)
                    .rating(4.5)
                    .reviews(31)
                    .availableProducts(18)
                    .organicStatus(false)
                    .contact("9550322114")
                    .farmImage("https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=600")
                    .photo("https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200")
                    .build());

            result.add(NearbyFarmerDTO.builder()
                    .farmerId("f-4")
                    .name("Siva Narayana")
                    .farmName("Arogyavaram Organic Farms")
                    .farmType("Spices & Organic Turmeric")
                    .description("Certified organic turmeric powder and dry red chillies grown with rainwater harvesting.")
                    .village("Arogyavaram")
                    .mandal("Madanapalle Rural")
                    .district("Chittoor")
                    .state("Andhra Pradesh")
                    .pincode("517330")
                    .lat("13.6501")
                    .lng("78.5412")
                    .distance(4.8)
                    .rating(4.9)
                    .reviews(62)
                    .availableProducts(25)
                    .organicStatus(true)
                    .contact("9885011992")
                    .farmImage("https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=600")
                    .photo("https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200")
                    .build());

            result.add(NearbyFarmerDTO.builder()
                    .farmerId("f-5")
                    .name("Radhamma Gowd")
                    .farmName("Radha Floriculture")
                    .farmType("Jasmine & Marigold Gardens")
                    .description("Fresh strings of Jasmine and bright orange Marigold cut flowers harvested early morning.")
                    .village("Punganur Road")
                    .mandal("Madanapalle Mandi")
                    .district("Chittoor")
                    .state("Andhra Pradesh")
                    .pincode("517325")
                    .lat("13.6198")
                    .lng("78.4901")
                    .distance(2.5)
                    .rating(4.7)
                    .reviews(44)
                    .availableProducts(8)
                    .organicStatus(true)
                    .contact("8122334455")
                    .farmImage("https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=600")
                    .photo("https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200")
                    .build());

            result.add(NearbyFarmerDTO.builder()
                    .farmerId("f-6")
                    .name("Chiranjeevi Naidu")
                    .farmName("Angallu Exotic Herbs")
                    .farmType("Greenhouse Basil & Mint Leaves")
                    .description("Premium quality mint leaves, lemongrass and basil cultivated under polyhouse temperature controls.")
                    .village("Angallu Outskirts")
                    .mandal("Madanapalle Rural")
                    .district("Chittoor")
                    .state("Andhra Pradesh")
                    .pincode("517325")
                    .lat("13.6489")
                    .lng("78.4415")
                    .distance(5.9)
                    .rating(4.8)
                    .reviews(50)
                    .availableProducts(19)
                    .organicStatus(true)
                    .contact("9912883344")
                    .farmImage("https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=600")
                    .photo("https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200")
                    .build());

            result.add(NearbyFarmerDTO.builder()
                    .farmerId("f-7")
                    .name("Bhaskar Raju")
                    .farmName("Raju Seasonal Crops")
                    .farmType("Sweet Corn & Watermelons")
                    .description("Fresh American sweet corn ears and giant watermelons grown near local lake reservoirs.")
                    .village("Kurabalakota Rural")
                    .mandal("Kurabalakota")
                    .district("Chittoor")
                    .state("Andhra Pradesh")
                    .pincode("517350")
                    .lat("13.6922")
                    .lng("78.4902")
                    .distance(9.1)
                    .rating(4.6)
                    .reviews(38)
                    .availableProducts(30)
                    .organicStatus(true)
                    .contact("9440232233")
                    .farmImage("https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=600")
                    .photo("https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200")
                    .build());
        } else {
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
                        .farmImage("https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=600")
                        .photo("https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200")
                        .build());
            }
        }

        return ResponseEntity.ok(ApiResponse.success("Nearby farmers fetched successfully", result));
    }
}
