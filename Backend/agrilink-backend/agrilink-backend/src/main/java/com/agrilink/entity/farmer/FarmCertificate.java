package com.agrilink.entity.farmer;

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
@Document(collection = "farm_certificates")
public class FarmCertificate {
    @Id
    private String id;

    private String farmId;
    private String name;
    private String fileUrl;

    @Builder.Default
    private boolean verified = false;
}
