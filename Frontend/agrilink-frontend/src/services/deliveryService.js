import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';

const getMockDeliveryOrders = () => {
  let orders = localStorage.getItem('agrilink_delivery_orders');
  if (!orders) {
    const initialOrders = [
      {
        id: 'ord-101',
        farmerName: 'Rajesh Kumar',
        farmName: 'Rajesh Fresh Greens',
        farmerContact: '9876543211',
        pickupAddress: 'Survey No. 45, Devanahalli Village, Bengaluru Rural',
        customerName: 'Abhisek Kundu',
        customerContact: '9876543210',
        deliveryAddress: 'Flat 402, Green Meadows, MG Road, Bengaluru - 560001',
        productName: 'Organic Tomatoes',
        quantity: '5 kg',
        weight: '5.2 kg',
        distance: '12.4 km',
        eta: '35 mins',
        status: 'ASSIGNED', // ASSIGNED, ACCEPTED, REACHED_FARMER, PICKED_UP, IN_TRANSIT, DELIVERED, REJECTED
        earnings: 120
      }
    ];
    localStorage.setItem('agrilink_delivery_orders', JSON.stringify(initialOrders));
    return initialOrders;
  }
  return JSON.parse(orders);
};

export const deliveryService = {
  getOnlineStatus: () => {
    return localStorage.getItem('agrilink_delivery_online') === 'true';
  },

  toggleOnline: (status) => {
    localStorage.setItem('agrilink_delivery_online', status ? 'true' : 'false');
    return status;
  },

  getAssignedOrders: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const orders = getMockDeliveryOrders();
      return orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'REJECTED');
    }
    const response = await axiosInstance.get('/delivery/orders/available');
    return response.data.data || response.data;
  },

  acceptDelivery: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const orders = getMockDeliveryOrders();
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        orders[idx].status = 'ACCEPTED';
        localStorage.setItem('agrilink_delivery_orders', JSON.stringify(orders));
        return orders[idx];
      }
      throw new Error('Order not found');
    }
    const response = await axiosInstance.post(`/delivery/orders/${id}/accept`);
    return response.data.data || response.data;
  },

  rejectDelivery: async (id, reason) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const orders = getMockDeliveryOrders();
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        orders[idx].status = 'REJECTED';
        orders[idx].rejectReason = reason;
        localStorage.setItem('agrilink_delivery_orders', JSON.stringify(orders));
        return { message: 'Delivery rejected' };
      }
      throw new Error('Order not found');
    }
    const response = await axiosInstance.put(`/orders/${id}/status?status=REJECTED`);
    return response.data.data || response.data;
  },

  updateDeliveryStatus: async (id, status) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const orders = getMockDeliveryOrders();
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        orders[idx].status = status;
        localStorage.setItem('agrilink_delivery_orders', JSON.stringify(orders));
        return orders[idx];
      }
      throw new Error('Order not found');
    }
    const response = await axiosInstance.put(`/orders/${id}/status?status=${status}`);
    return response.data.data || response.data;
  },

  getMyDeliveries: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const orders = getMockDeliveryOrders();
      return orders.filter(o => o.status === 'ACCEPTED' || o.status === 'PICKED_UP');
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    const response = await axiosInstance.get(`/delivery/orders/${user.id}`);
    return response.data.data || response.data;
  },

  generatePickupOtp: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Pickup OTP generated (Mock).' };
    }
    const response = await axiosInstance.post(`/delivery/orders/${id}/pickup/generate`);
    return response.data.data || response.data;
  },

  verifyPickupOtp: async (id, otp) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (otp === '123456' || otp === '1234') {
        return deliveryService.updateDeliveryStatus(id, 'PICKED_UP');
      }
      throw new Error('Invalid Farmer OTP. Enter 1234 to verify.');
    }
    const response = await axiosInstance.post(`/delivery/orders/${id}/pickup?otp=${otp}`);
    return response.data.data || response.data;
  },

  confirmPayment: async (id, paymentMethod) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return deliveryService.updateDeliveryStatus(id, 'DELIVERED');
    }
    const response = await axiosInstance.post(`/delivery/orders/${id}/complete?paymentMethod=${paymentMethod}`);
    return response.data.data || response.data;
  },

  verifyDeliveryOtp: async (id, otp) => {
    // Left for backward compatibility, routes to payment confirmation
    return deliveryService.confirmPayment(id, 'COD');
  },

  getEarnings: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const lifetime = Number(localStorage.getItem('agrilink_delivery_lifetime_earnings') || '1450');
      return {
        today: 240,
        weekly: 1050,
        monthly: 3200,
        lifetime: lifetime,
        transactions: [
          { id: 'dl-tx-301', orderId: 'ord-101', commission: 120, date: '2026-07-20', status: 'PAID' }
        ]
      };
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    const response = await axiosInstance.get(`/payments/user/${user.id}`);
    return response.data.data || response.data;
  },

  requestWithdrawal: async (amount, bankDetails) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { message: 'Withdrawal payout processed successfully.' };
    }
    return { message: 'Withdrawal requested successfully' };
  }
};

export default deliveryService;
