import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';

const getMockOrders = () => {
  const orders = localStorage.getItem('agrilink_mock_orders');
  if (!orders) {
    const initialOrders = [
      {
        id: 'ord-101',
        date: '2026-07-18T10:15:00Z',
        items: [
          { name: 'Organic Tomatoes', farmerName: 'Rajesh Kumar', quantity: 2, price: 35 }
        ],
        address: 'Flat 402, Green Meadows, MG Road, Bengaluru',
        slot: 'Morning (8 AM - 11 AM)',
        paymentMethod: 'UPI',
        total: 70,
        status: 'DELIVERED',
        trackingSteps: ['Order Placed', 'Farmer Accepted', 'Packed', 'Delivery Partner Picked Up', 'Out For Delivery', 'Delivered']
      }
    ];
    localStorage.setItem('agrilink_mock_orders', JSON.stringify(initialOrders));
    return initialOrders;
  }
  return JSON.parse(orders);
};

export const orderService = {
  createOrder: async (orderData) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const orders = getMockOrders();
      const newOrder = {
        id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        items: orderData.items,
        address: orderData.address,
        slot: orderData.slot,
        paymentMethod: orderData.paymentMethod,
        total: orderData.total,
        status: 'PENDING',
        trackingSteps: ['Order Placed']
      };
      orders.push(newOrder);
      localStorage.setItem('agrilink_mock_orders', JSON.stringify(orders));
      return newOrder;
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    const response = await axiosInstance.post(`/orders/customer/${user.id}`, orderData);
    return response.data.data || response.data;
  },

  getOrders: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getMockOrders();
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    const response = await axiosInstance.get(`/orders/customer/${user.id}`);
    return response.data.data || response.data;
  },

  getOrderById: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const orders = getMockOrders();
      const order = orders.find(o => o.id === id);
      if (order) return order;
      throw new Error('Order not found');
    }
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data.data || response.data;
  },

  cancelOrder: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const orders = getMockOrders();
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        orders[idx].status = 'CANCELLED';
        localStorage.setItem('agrilink_mock_orders', JSON.stringify(orders));
        return { message: 'Order cancelled successfully' };
      }
      throw new Error('Order not found');
    }
    const response = await axiosInstance.put(`/orders/${id}/status?status=CANCELLED`);
    return response.data.data || response.data;
  }
};

export default orderService;
