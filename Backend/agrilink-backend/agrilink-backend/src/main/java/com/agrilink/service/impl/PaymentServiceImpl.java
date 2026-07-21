package com.agrilink.service.impl;

import com.agrilink.dto.payment.PaymentRequest;
import com.agrilink.dto.payment.PaymentResponse;
import com.agrilink.entity.order.Order;
import com.agrilink.entity.payment.Payment;
import com.agrilink.enums.PaymentStatus;
import com.agrilink.exception.ResourceNotFoundException;
import com.agrilink.repository.OrderRepository;
import com.agrilink.repository.PaymentRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Override
    public ApiResponse<PaymentResponse> initiatePayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Payment payment = Payment.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(PaymentStatus.PENDING)
                .transactionId(request.getTransactionId())
                .build();

        payment = paymentRepository.save(payment);
        return ApiResponse.success("Payment initiated", toResponse(payment));
    }

    @Override
    public ApiResponse<PaymentResponse> getPaymentStatus(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return ApiResponse.success("Payment fetched successfully", toResponse(payment));
    }

    @Override
    public ApiResponse<List<PaymentResponse>> getUserPayments(String userId) {
        List<PaymentResponse> payments = paymentRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("User payments fetched successfully", payments);
    }

    @Override
    public ApiResponse<PaymentResponse> updatePaymentStatus(String paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        PaymentStatus paymentStatusEnum = PaymentStatus.valueOf(status.toUpperCase());
        payment.setStatus(paymentStatusEnum);
        payment = paymentRepository.save(payment);

        // Update corresponding Order details
        Order order = orderRepository.findById(payment.getOrderId()).orElse(null);
        if (order != null) {
            order.setPaymentStatus(paymentStatusEnum.name());
            order.setTransactionId(payment.getTransactionId());
            order.setPaymentTime(java.time.Instant.now());
            order.setAmountPaid(payment.getAmount());
            if (paymentStatusEnum == PaymentStatus.SUCCESS) {
                order.setStatus(com.agrilink.enums.OrderStatus.CONFIRMED);
                order.getTrackingSteps().add("Order Confirmed (Payment Success)");
            } else if (paymentStatusEnum == PaymentStatus.FAILED) {
                order.setStatus(com.agrilink.enums.OrderStatus.CANCELLED);
                order.getTrackingSteps().add("Order Cancelled (Payment Failed)");
            }
            orderRepository.save(order);
        }

        return ApiResponse.success("Payment status updated", toResponse(payment));
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt() != null ? DateTimeFormatter.ISO_INSTANT.format(payment.getCreatedAt()) : null)
                .build();
    }
}
