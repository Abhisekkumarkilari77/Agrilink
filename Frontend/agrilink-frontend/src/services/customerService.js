import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Tomatoes from your order are out for delivery.', date: '2026-07-20T10:30:00Z', read: false },
  { id: 2, text: 'Your previous order from Rajesh Fresh Greens has been delivered.', date: '2026-07-19T14:15:00Z', read: true },
  { id: 3, text: 'New Organic Farm (Amit Organic Farms) added near your location.', date: '2026-07-18T09:00:00Z', read: true }
];

const MOCK_ADDRESSES = [
  { id: 'addr-1', name: 'Home', houseNo: 'Flat 402, Green Meadows', street: 'MG Road', landmark: 'Near Police Station', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
  { id: 'addr-2', name: 'Office', houseNo: '9th Floor, Tech Hub', street: 'Outer Ring Road', landmark: 'Opposite Shell Fuel Station', city: 'Bengaluru', state: 'Karnataka', pincode: '560103' }
];

export const customerService = {
  getDashboardData: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const orders = JSON.parse(localStorage.getItem('agrilink_mock_orders') || '[]');
      const wishlist = JSON.parse(localStorage.getItem('agrilink_wishlist') || '[]');
      
      return {
        stats: {
          totalOrders: orders.length + 18, // Seeded offset + real orders
          activeOrders: orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length,
          wishlistItems: wishlist.length,
          savedAddresses: MOCK_ADDRESSES.length
        },
        notifications: MOCK_NOTIFICATIONS,
        recentProducts: [
          { name: 'Organic Tomatoes', farmer: 'Rajesh Kumar', price: '₹35/kg', date: '2026-07-18' },
          { name: 'Pure Cow Milk', farmer: 'Rajesh Kumar', price: '₹60/ltr', date: '2026-07-15' }
        ]
      };
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    return {
      stats: { totalOrders: 0, activeOrders: 0, wishlistItems: 0, savedAddresses: MOCK_ADDRESSES.length },
      notifications: [],
      recentProducts: []
    };
  },

  getProfile: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const user = JSON.parse(localStorage.getItem('agrilink_user'));
      return {
        ...user,
        addresses: MOCK_ADDRESSES
      };
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    return { ...user, addresses: MOCK_ADDRESSES };
  },

  updateProfile: async (profileData) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = JSON.parse(localStorage.getItem('agrilink_user'));
      const updated = { ...user, ...profileData };
      localStorage.setItem('agrilink_user', JSON.stringify(updated));
      return updated;
    }
    const user = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
    const updated = { ...user, ...profileData };
    localStorage.setItem('agrilink_user', JSON.stringify(updated));
    return updated;
  }
};

export default customerService;
