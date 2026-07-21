package com.agrilink.mapper;

import com.agrilink.dto.order.OrderResponse;
import com.agrilink.entity.auth.User;
import com.agrilink.entity.farmer.Farm;
import com.agrilink.entity.order.Order;
import com.agrilink.repository.FarmRepository;
import com.agrilink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final UserRepository userRepository;
    private final FarmRepository farmRepository;

    public OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }

        OrderResponse.OrderResponseBuilder builder = OrderResponse.builder()
                .id(order.getId())
                .date(order.getCreatedAt() != null ? DateTimeFormatter.ISO_INSTANT.format(order.getCreatedAt()) : null)
                .items(order.getItems())
                .address(order.getAddress())
                .slot(order.getDeliverySlot())
                .paymentMethod(order.getPaymentMethod())
                .total(order.getTotal())
                .status(order.getStatus())
                .trackingSteps(order.getTrackingSteps())
                .deliveryPartnerId(order.getDeliveryPartnerId())
                .farmerId(order.getFarmerId())
                .pickupStatus(order.getPickupStatus())
                .deliveryStatus(order.getDeliveryStatus())
                .deliveryAssignmentStatus(order.getDeliveryAssignmentStatus())
                .deliveryAcceptedAt(order.getDeliveryAcceptedAt())
                .deliveryCompletedAt(order.getDeliveryCompletedAt())
                .paymentStatus(order.getPaymentStatus())
                .transactionId(order.getTransactionId())
                .paymentTime(order.getPaymentTime())
                .amountPaid(order.getAmountPaid())
                .paymentCollected(order.getPaymentCollected())
                .otpVerified(order.getOtpVerified());

        // Map customer details
        if (order.getUserId() != null) {
            Optional<User> customerOpt = userRepository.findById(order.getUserId());
            if (customerOpt.isPresent()) {
                User customer = customerOpt.get();
                builder.customerName(customer.getName())
                       .customerPhone(customer.getMobile())
                       .customerEmail(customer.getEmail());
            }
        }

        // Map farmer details
        if (order.getFarmerId() != null) {
            Optional<User> farmerOpt = userRepository.findById(order.getFarmerId());
            if (farmerOpt.isPresent()) {
                User farmer = farmerOpt.get();
                builder.farmerName(farmer.getName())
                       .farmerPhone(farmer.getMobile());
            }
            Optional<Farm> farmOpt = farmRepository.findByFarmerId(order.getFarmerId());
            if (farmOpt.isPresent()) {
                builder.farmerAddress(farmOpt.get().getCompleteAddress());
            }
        }

        return builder.build();
    }
}
