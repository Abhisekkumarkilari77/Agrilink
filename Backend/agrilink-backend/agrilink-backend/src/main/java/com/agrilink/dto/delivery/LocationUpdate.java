package com.agrilink.dto.delivery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationUpdate {
    private String orderId;
    private String latitude;
    private String longitude;
    private String driverName;
    private String status;
}
