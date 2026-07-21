import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing token and user on initialization
    const savedToken = localStorage.getItem('agrilink_token');
    const savedUser = localStorage.getItem('agrilink_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.login({ username, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('agrilink_token', data.token);
      localStorage.setItem('agrilink_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
  };

  const register = async (role, formData) => {
    setError(null);
    setLoading(true);
    try {
      let result;
      if (role === 'CUSTOMER') {
        result = await authService.registerCustomer(formData);
      } else if (role === 'FARMER') {
        result = await authService.registerFarmer(formData);
      } else if (role === 'DELIVERY') {
        result = await authService.registerDelivery(formData);
      } else {
        throw new Error('Invalid user role for registration');
      }
      return result;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.verifyOtp(otp);
      if (data.user) {
        // Automatically login the user if register completed and user was returned
        const mockToken = `mock-jwt-token-for-${data.user.id}-${Date.now()}`;
        setToken(mockToken);
        setUser(data.user);
        localStorage.setItem('agrilink_token', mockToken);
        localStorage.setItem('agrilink_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'OTP Verification failed.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    setError(null);
    setLoading(true);
    try {
      return await authService.forgotPassword(email);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to request password reset.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const completePasswordReset = async (otp, newPassword) => {
    setError(null);
    setLoading(true);
    try {
      return await authService.resetPassword(otp, newPassword);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to reset password.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('agrilink_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (err) {
      console.error("Failed to check status:", err);
    }
    return null;
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    error,
    login,
    logout,
    register,
    verifyOTP,
    requestPasswordReset,
    completePasswordReset,
    checkStatus,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
