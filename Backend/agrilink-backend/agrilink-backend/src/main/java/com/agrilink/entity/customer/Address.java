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
@Document(collection = "addresses")
public class Address {
    @Id
    private String id;

    @Indexed
    private String userId;

    private String name;      // e.g., "Home", "Office"
    private String houseNo;
    private String street;
    private String landmark;
    private String city;
    private String state;
    private String pincode;
}
