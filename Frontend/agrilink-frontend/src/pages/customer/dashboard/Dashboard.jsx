import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import customerService from '../../../services/customerService';
import { SkeletonDashboard } from '../../../components/common/SkeletonCard';
import { useWishlist } from '../../../context/WishlistContext';

/* ─── Animated Counter Hook ─── */
const useAnimatedCounter = (targetValue, duration = 1200) => {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (targetValue === undefined || targetValue === null || startedRef.current) return;
    startedRef.current = true;
    const target = typeof targetValue === 'string' ? parseInt(targetValue, 10) : targetValue;
    if (isNaN(target)) { setCount(targetValue); return; }
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [targetValue, duration]);

  return count;
};

const StatCard = ({ label, value, icon, color, delay }) => {
  const animatedValue = useAnimatedCounter(value);
  return (
    <div
      className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm card-hover flex flex-col justify-between animate-fadeIn"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-lg`}>
          {icon}
        </div>
      </div>
      <span className="text-3xl font-black text-stone-800">{animatedValue}</span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await customerService.getDashboardData();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <SkeletonDashboard />;

  const categories = [
    { name: 'Vegetables', icon: '🥬', color: 'bg-emerald-50 border-emerald-200' },
    { name: 'Fruits', icon: '🍎', color: 'bg-red-50 border-red-200' },
    { name: 'Dairy', icon: '🥛', color: 'bg-blue-50 border-blue-200' },
    { name: 'Grains', icon: '🌾', color: 'bg-amber-50 border-amber-200' },
    { name: 'Eggs', icon: '🥚', color: 'bg-orange-50 border-orange-200' },
    { name: 'Flowers', icon: '💐', color: 'bg-pink-50 border-pink-200' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white rounded-3xl p-8 md:p-10 shadow-xl shadow-emerald-600/10 relative overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#f59e0b_0%,transparent_50%)]" />
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-emerald-300 rounded-full relative pulse-dot" />
            Active Session
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Welcome, {user?.name || 'User'} 👋</h1>
          <p className="text-white/70 max-w-lg font-medium text-sm leading-relaxed">
            Fresh organic vegetables, fruits, and grains are available near you. Direct from farm to kitchen.
          </p>
        </div>
      </div>

      {/* 2. Animated Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Orders" value={data?.stats?.totalOrders} icon="📦" color="bg-blue-50" delay={0.05} />
        <StatCard label="Active Orders" value={data?.stats?.activeOrders} icon="🚚" color="bg-emerald-50" delay={0.1} />
        <StatCard label="Wishlist" value={wishlistCount} icon="❤️" color="bg-red-50" delay={0.15} />
        <StatCard label="Addresses" value={data?.stats?.savedAddresses} icon="📍" color="bg-amber-50" delay={0.2} />
      </div>

      {/* 3. Quick Actions */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm animate-fadeIn" style={{ animationDelay: '0.25s' }}>
        <h3 className="text-lg font-bold text-stone-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Browse Products', path: '/customer/products', icon: '🛒' },
            { label: 'Nearby Farmers', path: '/customer/products?nearby=true', icon: '📍' },
            { label: 'My Orders', path: '/customer/orders', icon: '📦' },
            { label: 'Wishlist', path: '/customer/wishlist', icon: '❤️' },
            { label: 'Cart', path: '/customer/cart', icon: '🛍️' },
            { label: 'Update Profile', path: '/customer/profile', icon: '👤' },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className="p-4 bg-stone-50 hover:bg-primary hover:text-white rounded-2xl text-xs font-bold text-stone-700 transition duration-200 flex flex-col items-center gap-2 card-hover btn-press"
            >
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Notifications & 5. Recently Ordered Products */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full relative pulse-dot" />
            Notifications
          </h3>
          <div className="space-y-3">
            {data?.notifications.map((notif, idx) => (
              <div
                key={notif.id}
                className="p-4 bg-stone-50/70 hover:bg-stone-50 border border-stone-100 rounded-2xl text-xs flex justify-between items-center transition duration-200 animate-fadeIn"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="text-stone-600 leading-relaxed font-medium">{notif.text}</span>
                <span className="text-[10px] text-stone-400 whitespace-nowrap ml-3 font-semibold">
                  {new Date(notif.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Ordered */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-lg font-bold text-stone-800">Recently Ordered</h3>
          <div className="space-y-3">
            {data?.recentProducts.map((prod, idx) => (
              <div key={idx} className="flex justify-between items-center p-3.5 border border-stone-50 rounded-xl hover:bg-stone-50/50 transition">
                <div>
                  <p className="text-xs font-bold text-stone-800">{prod.name}</p>
                  <p className="text-[10px] text-stone-400 font-medium">By {prod.farmer}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary">{prod.price}</p>
                  <p className="text-[9px] text-stone-400">{prod.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Popular Categories with Icons */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-lg font-bold text-stone-800 mb-5">Popular Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/customer/products?category=${cat.name}`)}
              className={`p-5 border rounded-2xl text-center cursor-pointer ${cat.color} hover:shadow-md transition duration-200 card-hover btn-press animate-fadeIn`}
              style={{ animationDelay: `${0.4 + idx * 0.05}s` }}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-sm font-bold text-stone-700">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
