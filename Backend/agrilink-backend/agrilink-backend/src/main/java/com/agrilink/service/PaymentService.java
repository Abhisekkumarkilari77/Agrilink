package com.agrilink.service;

import com.agrilink.dto.payment.PaymentRequest;
import com.agrilink.dto.payment.PaymentResponse;
import com.agrilink.response.ApiResponse;

import java.util.List;

public interface PaymentService {
    ApiResponse<PaymentResponse> initiatePayment(PaymentRequest request);
    ApiResponse<PaymentResponse> getPaymentStatus(String paymentId);
    ApiResponse<List<PaymentResponse>> getUserPayments(String userId);
    ApiResponse<PaymentResponse> updatePaymentStatus(String paymentId, String status);
}
