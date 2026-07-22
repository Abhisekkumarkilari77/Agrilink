import axiosInstance from '../api/axiosConfig';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Tomatoes from your order are out for delivery.', date: '2026-07-20T10:30:00Z', read: false },
  { id: 2, text: 'Your previous order from Rajesh Fresh Greens has been delivered.', date: '2026-07-19T14:15:00Z', read: true },
  { id: 3, text: 'New Organic Farm (Rajesh Organic Farm) added near your location.', date: '2026-07-18T09:00:00Z', read: true }
];

const getUserFromStorage = () => {
  return JSON.parse(localStorage.getItem('agrilink_user') || '{}');
};

export const customerService = {
  // Address API Methods
  getAddresses: async () => {
    try {
      const user = getUserFromStorage();
      const res = await axiosInstance.get(`/customer/addresses?userId=${user.id || ''}`);
      if (res.data && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend address fetch failed, using local storage');
    }
    return JSON.parse(localStorage.getItem('agrilink_user_addresses') || '[]');
  },

  addAddress: async (addressData) => {
    try {
      const user = getUserFromStorage();
      const res = await axiosInstance.post(`/customer/addresses?userId=${user.id || ''}`, addressData);
      if (res.data && res.data.data) {
        const addresses = await customerService.getAddresses();
        return addresses;
      }
    } catch (err) {
      console.warn('Backend address create failed, using local storage');
    }
    const current = JSON.parse(localStorage.getItem('agrilink_user_addresses') || '[]');
    const newAddr = { ...addressData, id: 'addr-' + Date.now(), isDefault: current.length === 0 };
    const updated = [...current, newAddr];
    localStorage.setItem('agrilink_user_addresses', JSON.stringify(updated));
    return updated;
  },

  updateAddress: async (id, addressData) => {
    try {
      const res = await axiosInstance.put(`/customer/addresses/${id}`, addressData);
      if (res.data && res.data.data) {
        return await customerService.getAddresses();
      }
    } catch (err) {
      console.warn('Backend address update failed, using local storage');
    }
    const current = JSON.parse(localStorage.getItem('agrilink_user_addresses') || '[]');
    const updated = current.map(a => a.id === id ? { ...a, ...addressData } : a);
    localStorage.setItem('agrilink_user_addresses', JSON.stringify(updated));
    return updated;
  },

  deleteAddress: async (id) => {
    try {
      await axiosInstance.delete(`/customer/addresses/${id}`);
      return await customerService.getAddresses();
    } catch (err) {
      console.warn('Backend address delete failed, using local storage');
    }
    const current = JSON.parse(localStorage.getItem('agrilink_user_addresses') || '[]');
    const updated = current.filter(a => a.id !== id);
    localStorage.setItem('agrilink_user_addresses', JSON.stringify(updated));
    return updated;
  },

  setDefaultAddress: async (id) => {
    try {
      const user = getUserFromStorage();
      await axiosInstance.put(`/customer/addresses/${id}/default?userId=${user.id || ''}`);
      return await customerService.getAddresses();
    } catch (err) {
      console.warn('Backend set default address failed, using local storage');
    }
    const current = JSON.parse(localStorage.getItem('agrilink_user_addresses') || '[]');
    const updated = current.map(a => ({ ...a, isDefault: a.id === id }));
    localStorage.setItem('agrilink_user_addresses', JSON.stringify(updated));
    return updated;
  },

  // Dashboard Data
  getDashboardData: async () => {
    const addresses = await customerService.getAddresses();
    const wishlist = JSON.parse(localStorage.getItem('agrilink_wishlist') || '[]');
    const orders = JSON.parse(localStorage.getItem('agrilink_mock_orders') || '[]');

    return {
      stats: {
        totalOrders: orders.length,
        activeOrders: orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length,
        wishlistItems: wishlist.length,
        savedAddresses: addresses.length
      },
      notifications: MOCK_NOTIFICATIONS,
      recentProducts: [
        { name: 'Organic Tomatoes', farmer: 'Rajesh Kumar', price: '₹35/kg', date: '2026-07-20' },
        { name: 'Pure Cow Milk', farmer: 'Suresh Gowda', price: '₹60/litre', date: '2026-07-19' }
      ]
    };
  },

  // Profile Data
  getProfile: async () => {
    const user = getUserFromStorage();
    const addresses = await customerService.getAddresses();
    return {
      ...user,
      addresses
    };
  },

  updateProfile: async (profileData) => {
    const user = getUserFromStorage();
    const updated = { ...user, ...profileData };
    localStorage.setItem('agrilink_user', JSON.stringify(updated));
    return updated;
  },

  // Nearby Farmers
  getNearbyFarmers: async (pincode = '560001') => {
    try {
      const res = await axiosInstance.get(`/customer/farmers/nearby?pincode=${pincode}`);
      if (res.data && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend nearby farmers fetch failed, using fallback list');
    }
    return [
      {
        farmerId: 'f-1',
        name: 'Rajesh Kumar',
        farmName: 'Rajesh Organic Farm',
        farmType: 'Organic Vegetables & Fruits',
        description: '100% certified organic farm specializing in vine tomatoes, leafy greens and seasonal fruits.',
        village: 'Nelamangala',
        mandal: 'Bengaluru Rural',
        district: 'Bengaluru Rural',
        state: 'Karnataka',
        pincode: '562123',
        lat: '13.0984',
        lng: '77.3982',
        distance: 4.2,
        rating: 4.8,
        reviews: 42,
        availableProducts: 35,
        organicStatus: true,
        contact: '9876543211',
        farmImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
      },
      {
        farmerId: 'f-2',
        name: 'Ramesh Patel',
        farmName: 'Green Earth Organics',
        farmType: 'Grain & Pulses Farm',
        description: 'Multi-crop sustainable farm producing premium pulses, Basmati rice and whole wheat.',
        village: 'Srirangapatna',
        mandal: 'Mandya',
        district: 'Mandya',
        state: 'Karnataka',
        pincode: '571438',
        lat: '12.4223',
        lng: '76.6953',
        distance: 8.5,
        rating: 4.7,
        reviews: 29,
        availableProducts: 28,
        organicStatus: true,
        contact: '9876543212',
        farmImage: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
      },
      {
        farmerId: 'f-3',
        name: 'Sunita Devi',
        farmName: 'Sunrise Agro Farm',
        farmType: 'Polyhouse Flowers & Herbs',
        description: 'High-tech greenhouse growing long-stemmed flowers, exotic herbs and fresh berries.',
        village: 'Tubuagere',
        mandal: 'Doddaballapur',
        district: 'Doddaballapur',
        state: 'Karnataka',
        pincode: '561203',
        lat: '13.2928',
        lng: '77.5412',
        distance: 12.1,
        rating: 4.9,
        reviews: 58,
        availableProducts: 40,
        organicStatus: true,
        contact: '9876543214',
        farmImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80'
      }
    ];
  }
};

export default customerService;
