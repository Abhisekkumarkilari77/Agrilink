package com.agrilink.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FarmerRegisterRequest extends RegisterRequest {
    @NotBlank(message = "Farm name is required")
    private String farmName;

    @NotBlank(message = "Aadhaar number is required")
    private String aadhaarNumber;
}
