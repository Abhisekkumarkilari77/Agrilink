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
        name: 'Reddy Prasad',
        farmName: 'Madanapalle Tomato Hub',
        farmType: 'Organic Vegetables & Vine Tomatoes',
        description: 'Quality vine tomatoes and fresh green chillies cultivated in the fertile soil of Madanapalle rural.',
        village: 'Basinikonda',
        mandal: 'Madanapalle Mandi',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517325',
        lat: '13.6264',
        lng: '78.5022',
        distance: 1.5,
        rating: 4.8,
        reviews: 74,
        availableProducts: 45,
        organicStatus: true,
        contact: '9848022338',
        farmImage: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
      },
      {
        farmerId: 'f-2',
        name: 'Venkata Ramana',
        farmName: 'Horsley Hills Fruits',
        farmType: 'Mango & Custard Apple Orchard',
        description: 'Sweet local mango varieties and fresh organic papayas from the foothills of Horsley Hills.',
        village: 'Ghattu',
        mandal: 'Madanapalle Rural',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517325',
        lat: '13.6521',
        lng: '78.4891',
        distance: 3.2,
        rating: 4.7,
        reviews: 58,
        availableProducts: 20,
        organicStatus: true,
        contact: '9440522119',
        farmImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'
      },
      {
        farmerId: 'f-3',
        name: 'Saraswathi Devi',
        farmName: 'Saraswathi Greens',
        farmType: 'Leafy Greens & Coriander Fields',
        description: 'Fresh coriander, spinach, and fenugreek leaves harvested daily using natural composting.',
        village: 'Kurabalakota',
        mandal: 'Kurabalakota',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517350',
        lat: '13.6894',
        lng: '78.4812',
        distance: 8.4,
        rating: 4.9,
        reviews: 90,
        availableProducts: 15,
        organicStatus: true,
        contact: '8919011223',
        farmImage: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80'
      },
      {
        farmerId: 'f-4',
        name: 'Kishore Kumar',
        farmName: 'Ananthapuram Paddy Fields',
        farmType: 'Rice & Wheat Millers',
        description: 'Direct whole grain sona masuri rice straight from the agricultural fields of Angallu.',
        village: 'Angallu',
        mandal: 'Madanapalle Rural',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517325',
        lat: '13.6415',
        lng: '78.4322',
        distance: 6.5,
        rating: 4.6,
        reviews: 42,
        availableProducts: 10,
        organicStatus: false,
        contact: '9908877665',
        farmImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
      },
      {
        farmerId: 'f-5',
        name: 'Gangadhar Rao',
        farmName: 'Gangadhara Organic Dairy',
        farmType: 'Pure Cow Milk & Butter ghee',
        description: 'Grass-fed cow milk and unadulterated ghee prepared under strict hygienic conditions near Basinikonda.',
        village: 'Basinikonda Rural',
        mandal: 'Madanapalle Mandi',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517325',
        lat: '13.6212',
        lng: '78.5211',
        distance: 2.1,
        rating: 4.8,
        reviews: 83,
        availableProducts: 12,
        organicStatus: true,
        contact: '9121234321',
        farmImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
      },
      {
        farmerId: 'f-6',
        name: 'Mohan Babu',
        farmName: 'Madanapalle Groundnut farm',
        farmType: 'Premium Groundnuts & Oils',
        description: 'Sun-dried high-yield groundnuts and cold-pressed pure peanut oil from Chittoor agricultural belt.',
        village: 'Nimmanapalle',
        mandal: 'Nimmanapalle',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517325',
        lat: '13.5824',
        lng: '78.5101',
        distance: 9.8,
        rating: 4.5,
        reviews: 31,
        availableProducts: 18,
        organicStatus: false,
        contact: '9550322114',
        farmImage: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
      },
      {
        farmerId: 'f-7',
        name: 'Siva Narayana',
        farmName: 'Arogyavaram Organic Farms',
        farmType: 'Spices & Organic Turmeric',
        description: 'Certified organic turmeric powder and dry red chillies grown with rainwater harvesting.',
        village: 'Arogyavaram',
        mandal: 'Madanapalle Rural',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517330',
        lat: '13.6501',
        lng: '78.5412',
        distance: 4.8,
        rating: 4.9,
        reviews: 62,
        availableProducts: 25,
        organicStatus: true,
        contact: '9885011992',
        farmImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'
      },
      {
        farmerId: 'f-8',
        name: 'Radhamma Gowd',
        farmName: 'Radha Floriculture',
        farmType: 'Jasmine & Marigold Gardens',
        description: 'Fresh strings of Jasmine and bright orange Marigold cut flowers harvested early morning.',
        village: 'Punganur Road',
        mandal: 'Madanapalle Mandi',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517325',
        lat: '13.6198',
        lng: '78.4901',
        distance: 2.5,
        rating: 4.7,
        reviews: 44,
        availableProducts: 8,
        organicStatus: true,
        contact: '8122334455',
        farmImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80'
      },
      {
        farmerId: 'f-9',
        name: 'Chiranjeevi Naidu',
        farmName: 'Angallu Exotic Herbs',
        farmType: 'Greenhouse Basil & Mint leaves',
        description: 'Premium quality mint leaves, lemongrass and basil cultivated under polyhouse temperature controls.',
        village: 'Angallu Outskirts',
        mandal: 'Madanapalle Rural',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517325',
        lat: '13.6489',
        lng: '78.4415',
        distance: 5.9,
        rating: 4.8,
        reviews: 50,
        availableProducts: 19,
        organicStatus: true,
        contact: '9912883344',
        farmImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
      },
      {
        farmerId: 'f-10',
        name: 'Bhaskar Raju',
        farmName: 'Raju Seasonal Crops',
        farmType: 'Sweet corn & Watermelons',
        description: 'Fresh American sweet corn ears and giant watermelons grown near local lake reservoirs.',
        village: 'Kurabalakota Rural',
        mandal: 'Kurabalakota',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        pincode: '517350',
        lat: '13.6922',
        lng: '78.4902',
        distance: 9.1,
        rating: 4.6,
        reviews: 38,
        availableProducts: 30,
        organicStatus: true,
        contact: '9440232233',
        farmImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
      }
    ];
  }
};

export default customerService;
