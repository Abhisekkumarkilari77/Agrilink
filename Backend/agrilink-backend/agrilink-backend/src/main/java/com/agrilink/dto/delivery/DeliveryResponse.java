package com.agrilink.dto.delivery;

import com.agrilink.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {
    private String id;
    private String userId;
    private String name;
    private String email;
    private String mobile;
    private AccountStatus status;
    private String vehicleNumber;
    private boolean isOnline;
}
