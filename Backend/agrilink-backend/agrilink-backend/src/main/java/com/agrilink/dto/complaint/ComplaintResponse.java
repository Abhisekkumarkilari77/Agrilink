package com.agrilink.dto.complaint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {
    private String id;
    private String type;
    private String title;
    private String detail;
    private String orderId;
    private String status;
}
