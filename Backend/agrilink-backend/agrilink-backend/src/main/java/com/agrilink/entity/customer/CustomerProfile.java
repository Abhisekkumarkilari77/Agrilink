package com.agrilink.entity.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "customer_profiles")
public class CustomerProfile {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String name;
    private String email;
    private String mobile;
    private String avatar;
}
