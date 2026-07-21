package com.agrilink.entity.order;

import com.agrilink.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "order_status_history")
public class OrderStatusHistory {
    @Id
    private String id;

    @Indexed
    private String orderId;

    private OrderStatus status;
    private Instant timestamp;
    private String note;
}
