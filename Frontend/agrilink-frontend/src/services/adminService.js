import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';

// Mock Complaints
const getMockComplaints = () => {
  let complaints = localStorage.getItem('agrilink_mock_complaints');
  if (!complaints) {
    const initial = [
      { id: 'cmp-501', type: 'CUSTOMER', title: 'Late Delivery', detail: 'Tomato package did not arrive in Morning slot.', orderId: 'ord-101', status: 'PENDING' },
      { id: 'cmp-502', type: 'FARMER', title: 'Payment Delay', detail: 'Earnings not credited after delivery verification.', orderId: 'ord-101', status: 'RESOLVED' }
    ];
    localStorage.setItem('agrilink_mock_complaints', JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(complaints);
};

export const adminService = {
  getDashboardData: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const users = JSON.parse(localStorage.getItem('agrilink_mock_users') || '[]');
      const products = JSON.parse(localStorage.getItem('agrilink_farmer_products') || '[]');
      const orders = JSON.parse(localStorage.getItem('agrilink_mock_orders') || '[]');

      return {
        users: {
          farmers: users.filter(u => u.role === 'FARMER').length,
          verifiedFarmers: users.filter(u => u.role === 'FARMER' && u.status === 'APPROVED').length,
          pendingFarmers: users.filter(u => u.role === 'FARMER' && u.status === 'PENDING').length,
          customers: users.filter(u => u.role === 'CUSTOMER').length,
          delivery: users.filter(u => u.role === 'DELIVERY').length,
          pendingDelivery: users.filter(u => u.role === 'DELIVERY' && u.status === 'PENDING').length,
        },
        marketplace: {
          productsListed: products.length,
          ordersToday: 8,
          activeDeliveries: orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length,
          completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
          cancelledOrders: orders.filter(o => o.status === 'CANCELLED').length,
        },
        revenue: {
          today: 18450,
          weekly: 125000,
          monthly: 485000,
          commission: 72750
        },
        notifications: [
          '15 Farmers waiting for approval',
          '7 Delivery Partners pending verification',
          '3 Customer complaints received'
        ]
      };
    }
    return {
      users: { farmers: 0, verifiedFarmers: 0, pendingFarmers: 0, customers: 0, delivery: 0, pendingDelivery: 0 },
      marketplace: { productsListed: 0, ordersToday: 0, activeDeliveries: 0, completedOrders: 0, cancelledOrders: 0 },
      revenue: { today: 0, weekly: 0, monthly: 0, commission: 0 },
      notifications: []
    };
  },

  getUsers: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return JSON.parse(localStorage.getItem('agrilink_mock_users') || '[]');
    }
    const farmersRes = await axiosInstance.get('/admin/pending-farmers');
    const deliveryRes = await axiosInstance.get('/admin/pending-delivery-partners');
    const farmers = farmersRes.data.data || farmersRes.data || [];
    const delivery = deliveryRes.data.data || deliveryRes.data || [];
    return [...farmers, ...delivery];
  },

  blockUser: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const users = JSON.parse(localStorage.getItem('agrilink_mock_users') || '[]');
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx].status = 'SUSPENDED';
        localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
        return { message: 'User suspended successfully' };
      }
      throw new Error('User not found');
    }
    const response = await axiosInstance.put(`/admin/users/${id}/reject`);
    return response.data.data || response.data;
  },

  unblockUser: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const users = JSON.parse(localStorage.getItem('agrilink_mock_users') || '[]');
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx].status = 'ACTIVE';
        localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
        return { message: 'User activated successfully' };
      }
      throw new Error('User not found');
    }
    const response = await axiosInstance.put(`/admin/users/${id}/approve`);
    return response.data.data || response.data;
  },

  deleteUser: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const users = JSON.parse(localStorage.getItem('agrilink_mock_users') || '[]');
      const filtered = users.filter(u => u.id !== id);
      localStorage.setItem('agrilink_mock_users', JSON.stringify(filtered));
      return { message: 'User account deleted' };
    }
    const response = await axiosInstance.put(`/admin/users/${id}/reject`);
    return response.data.data || response.data;
  },

  getProducts: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return JSON.parse(localStorage.getItem('agrilink_farmer_products') || '[]');
    }
    const response = await axiosInstance.get('/products');
    return response.data.data || response.data;
  },

  hideProduct: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const prods = JSON.parse(localStorage.getItem('agrilink_farmer_products') || '[]');
      const idx = prods.findIndex(p => p.id === id);
      if (idx !== -1) {
        prods[idx].status = prods[idx].status === 'Hidden' ? 'Available' : 'Hidden';
        localStorage.setItem('agrilink_farmer_products', JSON.stringify(prods));
        return { message: 'Product visibility toggled' };
      }
      throw new Error('Product not found');
    }
    return { message: 'Product hidden' };
  },

  deleteProduct: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const prods = JSON.parse(localStorage.getItem('agrilink_farmer_products') || '[]');
      const filtered = prods.filter(p => p.id !== id);
      localStorage.setItem('agrilink_farmer_products', JSON.stringify(filtered));
      return { message: 'Product deleted successfully' };
    }
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data.data || response.data;
  },

  getOrders: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return JSON.parse(localStorage.getItem('agrilink_mock_orders') || '[]');
    }
    const response = await axiosInstance.get('/delivery/available-orders');
    return response.data.data || response.data;
  },

  cancelOrder: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const orders = JSON.parse(localStorage.getItem('agrilink_mock_orders') || '[]');
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
  },

  refundOrder: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Refund initiated successfully. Funds will settle within 3-5 working days.' };
    }
    return { message: 'Refund processed' };
  },

  getComplaints: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return getMockComplaints();
    }
    return getMockComplaints();
  },

  resolveComplaint: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const complaints = getMockComplaints();
      const idx = complaints.findIndex(c => c.id === id);
      if (idx !== -1) {
        complaints[idx].status = 'RESOLVED';
        localStorage.setItem('agrilink_mock_complaints', JSON.stringify(complaints));
        return { message: 'Dispute marked as RESOLVED.' };
      }
      throw new Error('Complaint not found');
    }
    return { message: 'Complaint resolved' };
  },

  getSettings: () => {
    const settings = localStorage.getItem('agrilink_platform_settings');
    if (!settings) {
      const defaults = {
        deliveryCharge: 40,
        commission: 15,
        gst: 5,
        maxRadius: 15,
      };
      localStorage.setItem('agrilink_platform_settings', JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(settings);
  },

  updateSettings: (data) => {
    localStorage.setItem('agrilink_platform_settings', JSON.stringify(data));
    return data;
  }
};

export default adminService;
