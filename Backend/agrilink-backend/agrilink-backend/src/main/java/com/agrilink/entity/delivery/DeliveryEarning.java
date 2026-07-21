package com.agrilink.entity.delivery;

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
@Document(collection = "delivery_earnings")
public class DeliveryEarning {
    @Id
    private String id;

    @Indexed
    private String partnerId;

    private String orderId;
    private double commission;
    private String date;
    private String status;
}
