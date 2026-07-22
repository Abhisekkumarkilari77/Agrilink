import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import useAuth from '../hooks/useAuth';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const userObj = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
      const userId = userObj.id || user?.id || '';

      const res = await axiosInstance.get(`/customer/wishlist?userId=${userId}`);
      if (res.data && res.data.data) {
        setWishlist(res.data.data);
      } else {
        const local = JSON.parse(localStorage.getItem('agrilink_wishlist') || '[]');
        setWishlist(local);
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist from backend, using localStorage fallback');
      const local = JSON.parse(localStorage.getItem('agrilink_wishlist') || '[]');
      setWishlist(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter(item => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('agrilink_wishlist', JSON.stringify(updated));

    try {
      const userObj = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
      const userId = userObj.id || user?.id || '';
      await axiosInstance.post(`/customer/wishlist/toggle/${product.id}?userId=${userId}`);
    } catch (err) {
      console.warn('Wishlist backend sync deferred to local state');
    }
  };

  const removeFromWishlist = async (productId) => {
    const updated = wishlist.filter(item => item.id !== productId);
    setWishlist(updated);
    localStorage.setItem('agrilink_wishlist', JSON.stringify(updated));

    try {
      const userObj = JSON.parse(localStorage.getItem('agrilink_user') || '{}');
      const userId = userObj.id || user?.id || '';
      await axiosInstance.delete(`/customer/wishlist/${productId}?userId=${userId}`);
    } catch (err) {
      console.warn('Wishlist remove backend sync deferred to local state');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: loadWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
