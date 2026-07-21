import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';

export const paymentService = {
  initiatePayment: async (paymentData) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        id: `pay-${Date.now()}`,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        method: paymentData.method,
        status: 'PENDING',
        transactionId: paymentData.transactionId || `tx-${Math.random().toString(36).substr(2, 9)}`
      };
    }
    const response = await axiosInstance.post('/payments/initiate', paymentData);
    return response.data.data || response.data;
  },

  updatePaymentStatus: async (paymentId, status) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        id: paymentId,
        status: status.toUpperCase()
      };
    }
    const response = await axiosInstance.put(`/payments/${paymentId}/status?status=${status}`);
    return response.data.data || response.data;
  },

  getPaymentStatus: async (paymentId) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: paymentId,
        status: 'SUCCESS'
      };
    }
    const response = await axiosInstance.get(`/payments/${paymentId}/status`);
    return response.data.data || response.data;
  },

  getUserPayments: async (userId) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
    const response = await axiosInstance.get(`/payments/user/${userId}`);
    return response.data.data || response.data;
  }
};

export default paymentService;
