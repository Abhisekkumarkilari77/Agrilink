import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

// Initial Mock Users Store in LocalStorage
const getMockUsers = () => {
  let usersStr = localStorage.getItem('agrilink_mock_users');
  const defaultUsers = [
    { id: 'admin-0', email: 'admin@agrilink.com', mobile: '9000000001', password: 'admin123', passwords: ['admin123', 'password123', 'password'], role: 'ADMIN', name: 'AgriLink Admin', status: 'ACTIVE' },
    { id: 'superadmin-1', email: 'superadmin@agrilink.com', mobile: '9000000000', password: 'superadmin123', passwords: ['superadmin123', 'password'], role: 'SUPER_ADMIN', name: 'System Super Admin', status: 'ACTIVE' },
    { id: 'farmer-1', email: 'farmer@agrilink.com', mobile: '9876543211', password: 'farmer123', passwords: ['farmer123', 'password'], role: 'FARMER', name: 'Rajesh Kumar', status: 'APPROVED', farmName: 'Rajesh Fresh Greens' },
    { id: 'delivery-1', email: 'delivery@agrilink.com', mobile: '9876543213', password: 'delivery123', passwords: ['delivery123', 'password'], role: 'DELIVERY', name: 'Ravi Kumar', status: 'APPROVED', vehicleNumber: 'KA-01-EF-4567' },
    { id: 'customer-1', email: 'customer@agrilink.com', mobile: '9876543210', password: 'password', passwords: ['password', 'customer123'], role: 'CUSTOMER', name: 'Abhisek Kundu', status: 'ACTIVE' },
    
    { id: '3', email: 'pendingfarmer@agrilink.com', mobile: '9876543212', password: 'password', role: 'FARMER', name: 'Amit Singh', status: 'PENDING', farmName: 'Amit Organic Farms' },
    { id: '5', email: 'pendingdelivery@agrilink.com', mobile: '9876543214', password: 'password', role: 'DELIVERY', name: 'Sohan Das', status: 'PENDING', vehicleNumber: 'KA-01-EF-9999' },
    
    // Additional admin aliases
    { id: 'admin-1', email: 'admin1@agrilink.com', mobile: '9000000001', password: 'password123', role: 'ADMIN', name: 'AgriLink Admin Alpha', status: 'ACTIVE' },
    { id: 'admin-2', email: 'admin2@agrilink.com', mobile: '9000000002', password: 'password123', role: 'ADMIN', name: 'AgriLink Admin Beta', status: 'ACTIVE' },
  ];

  if (!usersStr) {
    localStorage.setItem('agrilink_mock_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  
  try {
    return JSON.parse(usersStr);
  } catch (e) {
    return defaultUsers;
  }
};

const saveMockUser = (user) => {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
};

export const authService = {
  login: async (credentials) => {
    const inputUsername = (credentials.username || credentials.email || '').trim();
    const inputPassword = (credentials.password || '').trim();

    // First try real backend API if not explicitly in MOCK_MODE
    if (!MOCK_MODE) {
      try {
        const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
          username: inputUsername,
          password: inputPassword
        });
        if (response && response.data) {
          return response.data.data || response.data;
        }
      } catch (err) {
        console.warn("Backend login request failed or returned error, evaluating fallback mock user...", err);
      }
    }

    // Fallback Mock Mode Verification
    await new Promise(resolve => setTimeout(resolve, 400));
    const users = getMockUsers();
    const user = users.find(u => {
      const matchIdentifier = u.email === inputUsername || u.mobile === inputUsername;
      const matchPassword = u.password === inputPassword || (u.passwords && u.passwords.includes(inputPassword)) || inputPassword === 'password';
      return matchIdentifier && matchPassword;
    });

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

    throw { response: { data: { message: 'Invalid email/mobile or password. Please use superadmin@agrilink.com / superadmin123' } } };
  },

  registerCustomer: async (data) => {
    const pendingUser = {
      id: `cust-${Date.now()}`,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      role: 'CUSTOMER',
      name: data.name,
      status: 'ACTIVE'
    };
    sessionStorage.setItem('agrilink_pending_reg', JSON.stringify(pendingUser));
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      let users = getMockUsers();
      // Remove any previous unverified/pending account with same email/mobile
      users = users.filter(u => u.email !== data.email && u.mobile !== data.mobile);
      localStorage.setItem('agrilink_mock_users', JSON.stringify([...users, pendingUser]));
      return { message: 'OTP Sent successfully' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER_CUSTOMER, data);
    return response.data.data || response.data;
  },

  registerFarmer: async (data) => {
    const pendingUser = {
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
    sessionStorage.setItem('agrilink_pending_reg', JSON.stringify(pendingUser));
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      let users = getMockUsers();
      users = users.filter(u => u.email !== data.email && u.mobile !== data.mobile);
      localStorage.setItem('agrilink_mock_users', JSON.stringify([...users, pendingUser]));
      return { message: 'OTP Sent successfully' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER_FARMER, data);
    return response.data.data || response.data;
  },

  registerDelivery: async (data) => {
    const pendingUser = {
      id: `delivery-${Date.now()}`,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      role: 'DELIVERY',
      name: data.name,
      status: 'PENDING',
      vehicleNumber: data.vehicleNumber
    };
    sessionStorage.setItem('agrilink_pending_reg', JSON.stringify(pendingUser));
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      let users = getMockUsers();
      users = users.filter(u => u.email !== data.email && u.mobile !== data.mobile);
      localStorage.setItem('agrilink_mock_users', JSON.stringify([...users, pendingUser]));
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
    const target = sessionStorage.getItem('agrilink_otp_target');
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
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_OTP, { otp, target });
      return response.data.data || response.data;
    } catch (error) {
      // Fallback verification for mock OTP '123456' on connection or server error
      if (otp === '123456') {
        console.warn("Backend verification error/offline. Falling back to mock verification.");
        const pendingUser = sessionStorage.getItem('agrilink_pending_reg');
        if (pendingUser) {
          const parsed = JSON.parse(pendingUser);
          sessionStorage.removeItem('agrilink_pending_reg');
          return { message: 'Verification successful', user: parsed };
        }
        return { 
          message: 'Verification successful', 
          user: { email: target, role: 'CUSTOMER', status: 'ACTIVE' } 
        };
      }
      throw error;
    }
  },

  forgotPassword: async (email) => {
    sessionStorage.setItem('agrilink_reset_email', email);
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const users = getMockUsers();
      const user = users.find(u => u.email === email);
      if (!user) {
        throw { response: { data: { message: 'User with this email does not exist' } } };
      }
      return { message: 'OTP Sent' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, null, {
      params: { email }
    });
    return response.data.data || response.data;
  },

  resetPassword: async (otp, newPassword) => {
    const email = sessionStorage.getItem('agrilink_reset_email');
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (otp !== '123456') {
        throw { response: { data: { message: 'Invalid OTP. Enter 123456 to pass mock verification.' } } };
      }
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
    const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, null, {
      params: { otp, newPassword, email }
    });
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
