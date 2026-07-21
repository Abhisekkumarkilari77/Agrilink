package com.agrilink.dto.order;

import com.agrilink.entity.order.OrderItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotEmpty(message = "Order items cannot be empty")
    private List<OrderItem> items;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Delivery slot is required")
    private String slot;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotNull(message = "Total amount is required")
    private Double total;
}
