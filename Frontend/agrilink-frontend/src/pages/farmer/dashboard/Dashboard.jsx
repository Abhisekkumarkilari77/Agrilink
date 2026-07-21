import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import farmerService from '../../../services/farmerService';
import { SkeletonDashboard } from '../../../components/common/SkeletonCard';

/* ─── Animated Counter Hook ─── */
const useAnimatedCounter = (targetValue, duration = 1200) => {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (targetValue === undefined || targetValue === null || startedRef.current) return;
    startedRef.current = true;
    const target = typeof targetValue === 'string' ? parseInt(targetValue.replace(/[^0-9]/g, ''), 10) : targetValue;
    if (isNaN(target)) { setCount(targetValue); return; }
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [targetValue, duration]);

  return count;
};

const StatCard = ({ label, value, icon, color, prefix = '', delay }) => {
  const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10);
  const animatedValue = useAnimatedCounter(isNaN(numericValue) ? 0 : numericValue);
  return (
    <div className={`bg-white rounded-2xl p-5 border border-stone-100 shadow-sm card-hover flex flex-col justify-between animate-fadeIn`} style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-lg`}>{icon}</div>
      </div>
      <span className="text-3xl font-black text-stone-800">{prefix}{animatedValue}</span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const prof = await farmerService.getFarmProfile();
        const earn = await farmerService.getEarnings();
        const ords = await farmerService.getOrders();
        const prods = await farmerService.getProducts();
        setProfile(prof);
        setEarnings(earn);
        setOrders(ords);
        setProductsCount(prods.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <SkeletonDashboard />;

  // Revenue chart data
  const chartData = earnings?.monthlyBreakdown || [
    { month: 'Jan', amount: 3200 }, { month: 'Feb', amount: 4100 },
    { month: 'Mar', amount: 3800 }, { month: 'Apr', amount: 5200 },
    { month: 'May', amount: 4700 }, { month: 'Jun', amount: 6100 },
  ];
  const maxAmount = Math.max(...chartData.map(d => d.amount));

  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'ACCEPTED').length;

  return (
    <div className="space-y-8">
      {/* Welcome & Verification Badge */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white rounded-3xl p-8 shadow-xl shadow-emerald-600/10 relative overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#f59e0b_0%,transparent_50%)]" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-emerald-300 rounded-full relative pulse-dot" />
            Verified Farmer
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Welcome, {user?.name || 'Ramesh Patel'}</h1>
          <p className="text-white/70 font-medium text-sm">{profile?.farmName || 'Green Valley Farms'}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Products listed" value={productsCount} icon="🌽" color="bg-emerald-50" delay={0.05} />
        <StatCard label="Today's Orders" value={orders.length} icon="📋" color="bg-blue-50" delay={0.1} />
        <StatCard label="Pending" value={pendingOrders} icon="⏳" color="bg-amber-50" delay={0.15} />
        <StatCard label="Monthly Revenue" value={earnings?.monthly || 0} icon="💰" color="bg-emerald-50" prefix="₹" delay={0.2} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm animate-fadeIn" style={{ animationDelay: '0.25s' }}>
        <h3 className="text-lg font-bold text-stone-800 mb-6">Revenue Trend (6 Months)</h3>
        <div className="flex items-end gap-3 h-40">
          {chartData.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition">₹{d.amount}</span>
              <div
                className="w-full bg-gradient-to-t from-primary to-primary-light rounded-xl transition-all duration-500 hover:from-primary-dark hover:to-primary cursor-pointer shadow-sm"
                style={{ height: `${(d.amount / maxAmount) * 100}%`, animationDelay: `${idx * 0.08}s` }}
              />
              <span className="text-[10px] font-bold text-stone-500">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-lg font-bold text-stone-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Add Product', path: '/farmer/products/add', icon: '➕' },
            { label: 'Inventory', path: '/farmer/inventory', icon: '📦' },
            { label: 'View Orders', path: '/farmer/orders', icon: '📋' },
            { label: 'Earnings', path: '/farmer/earnings', icon: '💰' },
            { label: 'Farm Profile', path: '/farmer/farm', icon: '🏡' },
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

      {/* Recent Orders & Crop Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-lg font-bold text-stone-800">Recent Customer Orders ({orders.length})</h3>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No recent orders received.</p>
            ) : (
              orders.map((order, idx) => (
                <div key={order.id} className="p-4 border border-stone-100 rounded-2xl flex justify-between items-center bg-stone-50/30 text-xs hover:bg-stone-50 transition animate-fadeIn" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div>
                    <span className="font-bold text-stone-800">Order ID: {order.id}</span>
                    <p className="text-stone-500 mt-1">Delivery Slot: {order.slot}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-black text-stone-800 block">₹{order.total}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Crop Alerts — FIXED: removed markdown syntax */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-bold text-stone-800">Crop Alerts</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl font-medium">
              ⚠️ <span className="font-bold">Organic Tomatoes</span> inventory is running low (4 kg left).
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl font-medium">
              ✅ Payment of <span className="font-bold">₹70</span> credited for Order #ord-101.
            </div>
            <div className="p-3.5 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl font-medium">
              💬 Customer Abhisek added a <span className="font-bold">5★ review</span> for Alphonso Mangoes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
