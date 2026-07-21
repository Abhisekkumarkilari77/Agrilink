package com.agrilink.mapper;

import com.agrilink.dto.order.OrderResponse;
import com.agrilink.entity.order.Order;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }

        return OrderResponse.builder()
                .id(order.getId())
                .date(order.getCreatedAt() != null ? DateTimeFormatter.ISO_INSTANT.format(order.getCreatedAt()) : null)
                .items(order.getItems())
                .address(order.getAddress())
                .slot(order.getDeliverySlot())
                .paymentMethod(order.getPaymentMethod())
                .total(order.getTotal())
                .status(order.getStatus())
                .trackingSteps(order.getTrackingSteps())
                .build();
    }
}
