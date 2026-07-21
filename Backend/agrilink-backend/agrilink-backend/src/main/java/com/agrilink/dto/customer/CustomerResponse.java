package com.agrilink.dto.customer;

import com.agrilink.entity.customer.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private String id;
    private String userId;
    private String name;
    private String email;
    private String mobile;
    private String avatar;
    private List<Address> addresses;
    private List<String> preferences;
}
