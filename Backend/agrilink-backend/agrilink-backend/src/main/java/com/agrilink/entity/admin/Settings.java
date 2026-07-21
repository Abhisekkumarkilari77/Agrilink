package com.agrilink.entity.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "settings")
public class Settings {
    @Id
    private String id;

    @Builder.Default
    private double deliveryCharge = 40.0;

    @Builder.Default
    private double commission = 15.0;

    @Builder.Default
    private double gst = 5.0;

    @Builder.Default
    private double maxRadius = 15.0;
}
