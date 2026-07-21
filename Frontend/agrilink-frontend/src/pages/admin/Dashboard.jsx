import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { SkeletonDashboard } from '../../components/common/SkeletonCard';

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
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-tight">{label}</span>
        <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center text-sm shrink-0`}>{icon}</div>
      </div>
      <span className="text-2xl font-black text-stone-800">{prefix}{animatedValue}</span>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await adminService.getDashboardData();
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 rounded-3xl p-8 md:p-10 shadow-xl shadow-stone-900/10 relative overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#10b981_0%,transparent_50%)]" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-primary rounded-full relative pulse-dot" />
            System Live
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Admin Control Center</h1>
          <p className="text-stone-300 font-medium text-sm">Supervise user registrations, monitor product listings, and analyze sales revenue.</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center text-[10px]">👥</span>
          User Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Customers" value={data?.users.customers} icon="🛒" color="bg-emerald-50 text-emerald-600" delay={0.05} />
          <StatCard label="Farmers" value={data?.users.farmers} icon="🌾" color="bg-amber-50 text-amber-600" delay={0.1} />
          <StatCard label="Pending Farmers" value={data?.users.pendingFarmers} icon="⏳" color="bg-orange-50 text-orange-600" delay={0.15} />
          <StatCard label="Delivery" value={data?.users.delivery} icon="🚚" color="bg-blue-50 text-blue-600" delay={0.2} />
          <StatCard label="Pending Delivery" value={data?.users.pendingDelivery} icon="⏳" color="bg-orange-50 text-orange-600" delay={0.25} />
        </div>
      </div>

      {/* Marketplace Stats & Revenue */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Marketplace */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-5 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-base font-bold text-stone-800 border-b border-stone-100 pb-3 flex items-center gap-2">
            🏪 Marketplace Operations
          </h3>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Products Listed</p>
              <p className="text-xl font-black text-stone-800 mt-1">{data?.marketplace.productsListed}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Orders Today</p>
              <p className="text-xl font-black text-stone-800 mt-1">{data?.marketplace.ordersToday}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Active Deliveries</p>
              <p className="text-xl font-black text-amber-600 mt-1">{data?.marketplace.activeDeliveries}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Completed Orders</p>
              <p className="text-xl font-black text-emerald-600 mt-1">{data?.marketplace.completedOrders}</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-5 animate-fadeIn" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-base font-bold text-stone-800 border-b border-stone-100 pb-3 flex items-center gap-2">
            💰 Financial Performance
          </h3>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Today's Sales</p>
              <p className="text-xl font-black text-stone-800 mt-1">₹{data?.revenue.today}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Weekly Sales</p>
              <p className="text-xl font-black text-stone-800 mt-1">₹{data?.revenue.weekly}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Monthly Sales</p>
              <p className="text-xl font-black text-stone-800 mt-1">₹{data?.revenue.monthly}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Platform Commission</p>
              <p className="text-xl font-black text-primary mt-1">₹{data?.revenue.commission} <span className="text-xs font-bold text-stone-400">(15%)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Alerts */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-5 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-base font-bold text-stone-800 border-b border-stone-100 pb-3 flex items-center gap-2">
          🛡️ Verification Action Centre
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="p-5 border border-amber-100 rounded-2xl bg-amber-50/50 space-y-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black text-amber-800 uppercase tracking-wider">Farmers</p>
                <p className="text-stone-500 text-sm font-medium mt-1">Requires Approval</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">{data?.users.pendingFarmers || 0}</div>
            </div>
            <button
              onClick={() => navigate('/admin/farmers')}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/20 btn-press"
            >
              Verify Farmers
            </button>
          </div>

          <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50/50 space-y-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black text-blue-800 uppercase tracking-wider">Delivery Partners</p>
                <p className="text-stone-500 text-sm font-medium mt-1">Requires Approval</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{data?.users.pendingDelivery || 0}</div>
            </div>
            <button
              onClick={() => navigate('/admin/delivery-partners')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 btn-press"
            >
              Verify Partners
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
