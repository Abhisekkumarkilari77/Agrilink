package com.agrilink.dto.order;

import com.agrilink.entity.order.OrderItem;
import com.agrilink.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private String date;
    private List<OrderItem> items;
    private String address;
    private String slot;
    private String paymentMethod;
    private double total;
    private OrderStatus status;
    private List<String> trackingSteps;
}
