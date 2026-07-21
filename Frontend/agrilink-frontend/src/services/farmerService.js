import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';

// Mock Profile Loader
const getMockProfile = () => {
  const profile = localStorage.getItem('agrilink_farm_profile');
  if (!profile) {
    const defaultProfile = {
      farmName: 'Green Valley Organic Farm',
      farmerName: 'Ramesh Patel',
      farmType: 'Organic Vegetables',
      farmDesc: 'We cultivate healthy, delicious organic vegetables for over 15 years using traditional natural techniques.',
      state: 'Karnataka',
      district: 'Bengaluru Rural',
      village: 'Devanahalli',
      completeAddress: 'Survey No. 45, Devanahalli Village, Bengaluru Rural',
      pincode: '562110',
      lat: '13.2492',
      lng: '77.7126',
      contact: '9876543211',
      workingHours: '06:00 AM - 06:00 PM',
      certificates: ['Organic Certificate (Verified)', 'Government Land Ownership Proof']
    };
    localStorage.setItem('agrilink_farm_profile', JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  return JSON.parse(profile);
};

export const farmerService = {
  getFarmProfile: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return getMockProfile();
    }
    return getMockProfile();
  },

  updateFarmProfile: async (data) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const profile = getMockProfile();
      const updated = { ...profile, ...data };
      localStorage.setItem('agrilink_farm_profile', JSON.stringify(updated));
      return updated;
    }
    return data;
  },

  getProducts: async (farmerId) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const defaultProducts = [
        { id: 'prod-1', name: 'Organic Tomatoes', category: 'Vegetables', price: 35, quantity: 150, status: 'Available', ordersReceived: 14, image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&q=80', description: 'Fresh tomatoes' },
        { id: 'prod-3', name: 'Pure Cow Milk', category: 'Dairy', price: 60, quantity: 80, status: 'Available', ordersReceived: 25, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80', description: 'Fresh cow milk' }
      ];
      let prods = localStorage.getItem('agrilink_farmer_products');
      if (!prods) {
        localStorage.setItem('agrilink_farmer_products', JSON.stringify(defaultProducts));
        return defaultProducts;
      }
      return JSON.parse(prods);
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    const fid = farmerId || user.id;
    const response = await axiosInstance.get(`/products/farmer/${fid}`);
    return response.data.data || response.data;
  },

  addProduct: async (productData) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const prods = await farmerService.getProducts();
      const newProd = {
        id: `prod-${Date.now()}`,
        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        quantity: Number(productData.quantity),
        status: productData.quantity > 0 ? 'Available' : 'Out of Stock',
        ordersReceived: 0,
        image: productData.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c3a9?w=400&q=80',
        description: productData.description
      };
      prods.push(newProd);
      localStorage.setItem('agrilink_farmer_products', JSON.stringify(prods));
      return newProd;
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    const response = await axiosInstance.post(`/products/farmer/${user.id}`, productData);
    return response.data.data || response.data;
  },

  updateProduct: async (id, updatedData) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const prods = await farmerService.getProducts();
      const idx = prods.findIndex(p => p.id === id);
      if (idx !== -1) {
        prods[idx] = { ...prods[idx], ...updatedData, price: Number(updatedData.price), quantity: Number(updatedData.quantity) };
        prods[idx].status = prods[idx].quantity > 0 ? 'Available' : 'Out of Stock';
        localStorage.setItem('agrilink_farmer_products', JSON.stringify(prods));
        return prods[idx];
      }
      throw new Error('Product not found');
    }
    const response = await axiosInstance.put(`/products/${id}`, updatedData);
    return response.data.data || response.data;
  },

  deleteProduct: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const prods = await farmerService.getProducts();
      const filtered = prods.filter(p => p.id !== id);
      localStorage.setItem('agrilink_farmer_products', JSON.stringify(filtered));
      return { message: 'Product deleted successfully' };
    }
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data.data || response.data;
  },

  getOrders: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const orders = localStorage.getItem('agrilink_mock_orders');
      if (!orders) return [];
      return JSON.parse(orders);
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    const response = await axiosInstance.get(`/orders/farmer/${user.id}`);
    return response.data.data || response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const orders = JSON.parse(localStorage.getItem('agrilink_mock_orders') || '[]');
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        orders[idx].status = status;
        if (!orders[idx].trackingSteps.includes(status)) {
          orders[idx].trackingSteps.push(status);
        }
        localStorage.setItem('agrilink_mock_orders', JSON.stringify(orders));
        return orders[idx];
      }
      throw new Error('Order not found');
    }
    if (status === 'FARMER_ACCEPTED') {
      const response = await axiosInstance.put(`/farmer/orders/${orderId}/accept`);
      return response.data.data || response.data;
    }
    const response = await axiosInstance.put(`/orders/${orderId}/status?status=${status}`);
    return response.data.data || response.data;
  },

  getEarnings: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        today: 4500,
        weekly: 18500,
        monthly: 34250,
        lifetime: 145000,
        transactions: [
          { id: 'tx-201', orderId: 'ord-101', customer: 'Abhisek Kundu', amount: 70, date: '2026-07-18', status: 'SETTLED' }
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
      return { message: 'Withdrawal request submitted to admin for verification.' };
    }
    return { message: 'Withdrawal request submitted' };
  }
};

export default farmerService;
