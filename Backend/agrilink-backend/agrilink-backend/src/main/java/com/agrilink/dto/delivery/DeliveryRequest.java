package com.agrilink.dto.delivery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequest {
    private String vehicleNumber;
    private String currentLatitude;
    private String currentLongitude;
    private boolean isOnline;
}
