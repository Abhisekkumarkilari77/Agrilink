import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

// Initial Mock Users Store in LocalStorage
const getMockUsers = () => {
  // Force reset the mock users cache
  localStorage.removeItem('agrilink_mock_users');
  
  let users = localStorage.getItem('agrilink_mock_users');
  if (!users) {
    const defaultUsers = [
      { id: '1', email: 'customer@agrilink.com', mobile: '9876543210', password: 'password', role: 'CUSTOMER', name: 'Abhisek Kundu', status: 'ACTIVE' },
      { id: '2', email: 'farmer@agrilink.com', mobile: '9876543211', password: 'password', role: 'FARMER', name: 'Rajesh Kumar', status: 'APPROVED', farmName: 'Rajesh Fresh Greens' },
      { id: '3', email: 'pendingfarmer@agrilink.com', mobile: '9876543212', password: 'password', role: 'FARMER', name: 'Amit Singh', status: 'PENDING', farmName: 'Amit Organic Farms' },
      { id: '4', email: 'delivery@agrilink.com', mobile: '9876543213', password: 'password', role: 'DELIVERY', name: 'Ravi Kumar', status: 'APPROVED', vehicleNumber: 'KA-01-EF-4567' },
      { id: '5', email: 'pendingdelivery@agrilink.com', mobile: '9876543214', password: 'password', role: 'DELIVERY', name: 'Sohan Das', status: 'PENDING', vehicleNumber: 'KA-01-EF-9999' },
      
      // 5 Default Admin accounts
      { id: 'admin-1', email: 'admin1@agrilink.com', mobile: '9000000001', password: 'password123', role: 'ADMIN', name: 'AgriLink Admin Alpha', status: 'ACTIVE' },
      { id: 'admin-2', email: 'admin2@agrilink.com', mobile: '9000000002', password: 'password123', role: 'ADMIN', name: 'AgriLink Admin Beta', status: 'ACTIVE' },
      { id: 'admin-3', email: 'admin3@agrilink.com', mobile: '9000000003', password: 'password123', role: 'ADMIN', name: 'AgriLink Admin Gamma', status: 'ACTIVE' },
      { id: 'admin-4', email: 'admin4@agrilink.com', mobile: '9000000004', password: 'password123', role: 'ADMIN', name: 'AgriLink Admin Delta', status: 'ACTIVE' },
      { id: 'admin-5', email: 'admin5@agrilink.com', mobile: '9000000005', password: 'password123', role: 'ADMIN', name: 'AgriLink Admin Epsilon', status: 'ACTIVE' },
      
      { id: '7', email: 'superadmin@agrilink.com', mobile: '9876543216', password: 'password', role: 'SUPER_ADMIN', name: 'System Root', status: 'ACTIVE' },
    ];
    localStorage.setItem('agrilink_mock_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
};

const saveMockUser = (user) => {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
};

export const authService = {
  login: async (credentials) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      const users = getMockUsers();
      const user = users.find(
        u => (u.email === credentials.username || u.mobile === credentials.username) && u.password === credentials.password
      );
      if (user) {
        return {
          token: `mock-jwt-token-for-${user.id}-${Date.now()}`,
          user: {
            id: user.id,
            email: user.email,
            mobile: user.mobile,
            name: user.name,
            role: user.role,
            status: user.status,
            farmName: user.farmName,
          }
        };
      }
      throw { response: { data: { message: 'Invalid email/mobile or password' } } };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data.data || response.data;
  },

  registerCustomer: async (data) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const users = getMockUsers();
      if (users.some(u => u.email === data.email || u.mobile === data.mobile)) {
        throw { response: { data: { message: 'Email or Mobile already registered' } } };
      }
      const newUser = {
        id: `cust-${Date.now()}`,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        role: 'CUSTOMER',
        name: data.name,
        status: 'ACTIVE'
      };
      sessionStorage.setItem('agrilink_pending_reg', JSON.stringify(newUser));
      return { message: 'OTP Sent successfully' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER_CUSTOMER, data);
    return response.data.data || response.data;
  },

  registerFarmer: async (data) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const users = getMockUsers();
      if (users.some(u => u.email === data.email || u.mobile === data.mobile || u.aadhaar === data.aadhaarNumber)) {
        throw { response: { data: { message: 'Email, Mobile or Aadhaar already registered' } } };
      }
      const newUser = {
        id: `farmer-${Date.now()}`,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        role: 'FARMER',
        name: data.name,
        status: 'PENDING',
        farmName: data.farmName,
        aadhaar: data.aadhaarNumber
      };
      sessionStorage.setItem('agrilink_pending_reg', JSON.stringify(newUser));
      return { message: 'OTP Sent successfully' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER_FARMER, data);
    return response.data.data || response.data;
  },

  registerDelivery: async (data) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const users = getMockUsers();
      if (users.some(u => u.email === data.email || u.mobile === data.mobile)) {
        throw { response: { data: { message: 'Email or Mobile already registered' } } };
      }
      const newUser = {
        id: `delivery-${Date.now()}`,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        role: 'DELIVERY',
        name: data.name,
        status: 'PENDING',
        vehicleNumber: data.vehicleNumber
      };
      sessionStorage.setItem('agrilink_pending_reg', JSON.stringify(newUser));
      return { message: 'OTP Sent successfully' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER_DELIVERY, data);
    return response.data.data || response.data;
  },

  sendOtp: async (emailOrMobile) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'OTP sent' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SEND_OTP, { target: emailOrMobile });
    return response.data.data || response.data;
  },

  verifyOtp: async (otp) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (otp === '123456') { // Hardcoded correct OTP for testing
        const pendingUser = sessionStorage.getItem('agrilink_pending_reg');
        if (pendingUser) {
          const parsed = JSON.parse(pendingUser);
          saveMockUser(parsed);
          sessionStorage.removeItem('agrilink_pending_reg');
          return { message: 'Verification successful', user: parsed };
        }
        return { message: 'Verification successful' };
      }
      throw { response: { data: { message: 'Invalid OTP. Enter 123456 to pass mock verification.' } } };
    }
    const target = sessionStorage.getItem('agrilink_otp_target');
    const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_OTP, { otp, target });
    return response.data.data || response.data;
  },

  forgotPassword: async (email) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const users = getMockUsers();
      const user = users.find(u => u.email === email);
      if (!user) {
        throw { response: { data: { message: 'User with this email does not exist' } } };
      }
      sessionStorage.setItem('agrilink_reset_email', email);
      return { message: 'OTP Sent' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data.data || response.data;
  },

  resetPassword: async (otp, newPassword) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (otp !== '123456') {
        throw { response: { data: { message: 'Invalid OTP. Enter 123456 to pass mock verification.' } } };
      }
      const email = sessionStorage.getItem('agrilink_reset_email');
      const users = getMockUsers();
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
        sessionStorage.removeItem('agrilink_reset_email');
        return { message: 'Password reset successful' };
      }
      throw { response: { data: { message: 'Session expired. Request again.' } } };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, { otp, newPassword });
    return response.data.data || response.data;
  },

  getCurrentUser: async () => {
    if (MOCK_MODE) {
      const savedUser = localStorage.getItem('agrilink_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
    return response.data.data || response.data;
  },

  // Admin Operations
  getPendingUsers: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const users = getMockUsers();
      return users.filter(u => u.status === 'PENDING');
    }
    const farmersRes = await axiosInstance.get('/admin/pending-farmers');
    const deliveryRes = await axiosInstance.get('/admin/pending-delivery-partners');
    const farmers = farmersRes.data.data || farmersRes.data || [];
    const delivery = deliveryRes.data.data || deliveryRes.data || [];
    return [...farmers, ...delivery];
  },

  approveUser: async (userId) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].status = 'APPROVED';
        localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
        return { message: 'User approved successfully' };
      }
      throw new Error('User not found');
    }
    const response = await axiosInstance.put(`/admin/users/${userId}/approve`);
    return response.data.data || response.data;
  },

  rejectUser: async (userId) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].status = 'REJECTED';
        localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
        return { message: 'User rejected successfully' };
      }
      throw new Error('User not found');
    }
    const response = await axiosInstance.put(`/admin/users/${userId}/reject`);
    return response.data.data || response.data;
  }
};

export default authService;
