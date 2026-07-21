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
@Document(collection = "farmer_revenues")
public class FarmerRevenue {
    @Id
    private String id;

    @Indexed(unique = true)
    private String farmerId;

    @Builder.Default
    private double today = 0;
    @Builder.Default
    private double weekly = 0;
    @Builder.Default
    private double monthly = 0;
    @Builder.Default
    private double lifetime = 0;

    @Builder.Default
    private List<RevenueTransaction> transactions = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueTransaction {
        private String id;
        private String orderId;
        private String customer;
        private double amount;
        private String date;
        private String status;
    }
}
