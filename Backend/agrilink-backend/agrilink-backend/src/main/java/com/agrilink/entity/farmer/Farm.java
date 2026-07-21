package com.agrilink.entity.farmer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "farms")
public class Farm {
    @Id
    private String id;

    @Indexed
    private String farmerId;

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

    @Builder.Default
    private List<String> certificates = new ArrayList<>();
}
