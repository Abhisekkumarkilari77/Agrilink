package com.agrilink.dto.farmer;

import com.agrilink.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerResponse {
    private String id;
    private String userId;
    private String name;
    private String email;
    private String mobile;
    private AccountStatus status;
    private String farmName;
    private String farmType;
    private String description;
    private String state;
    private String district;
    private String village;
    private String completeAddress;
    private String pincode;
    private String lat;
    private String lng;
    private String contact;
    private String workingHours;
    private List<String> certificates;
}
