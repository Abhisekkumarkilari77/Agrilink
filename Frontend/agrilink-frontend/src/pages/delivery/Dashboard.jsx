import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import deliveryService from '../../services/deliveryService';
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
  const [earnings, setEarnings] = useState(null);
  const [assignedCount, setAssignedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const earn = await deliveryService.getEarnings();
        const assigned = await deliveryService.getAssignedOrders();
        setEarnings(earn);
        setAssignedCount(assigned.length);
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
      {/* Welcome & Verification Badge */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-white rounded-3xl p-8 shadow-xl shadow-amber-500/10 relative overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#ffffff_0%,transparent_50%)]" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20">
            <span className="w-2 h-2 bg-white rounded-full relative pulse-dot" />
            Verified Delivery Partner
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-white/80 font-medium text-sm">Ready to deliver fresh farm goods today!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Assigned Orders" value={assignedCount} icon="📋" color="bg-blue-50" delay={0.05} />
        <StatCard label="Completed" value={5} icon="✅" color="bg-emerald-50" delay={0.1} />
        <StatCard label="Pending Pickup" value={3} icon="⏳" color="bg-amber-50" delay={0.15} />
        <StatCard label="Today's Earnings" value={earnings?.today || 0} icon="💰" color="bg-amber-50" prefix="₹" delay={0.2} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm animate-fadeIn" style={{ animationDelay: '0.25s' }}>
        <h3 className="text-lg font-bold text-stone-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Assigned Orders', path: '/delivery/assigned-orders', icon: '🚚' },
            { label: 'Earnings Details', path: '/delivery/earnings', icon: '💰' },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className="p-4 bg-stone-50 hover:bg-amber-500 hover:text-white rounded-2xl text-xs font-bold text-stone-700 transition duration-200 flex flex-col items-center gap-2 card-hover btn-press"
            >
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications — FIXED: removed markdown syntax */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-lg font-bold text-stone-800">Recent Notifications</h3>
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-blue-50 text-blue-800 border border-blue-100 rounded-2xl font-medium flex gap-3 items-start animate-fadeIn" style={{ animationDelay: '0.35s' }}>
            <span className="text-base mt-0.5">📦</span>
            <div>
              <span className="font-bold">New Delivery Assigned</span>: Order #ord-101 is ready for collection at Rajesh Fresh Greens.
            </div>
          </div>
          <div className="p-4 bg-amber-50 text-amber-800 border border-amber-100 rounded-2xl font-medium flex gap-3 items-start animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <span className="text-base mt-0.5">⏰</span>
            <div>
              <span className="font-bold">Pickup Time Updated</span>: Rajesh Fresh Greens packages must be collected by 11:30 AM.
            </div>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl font-medium flex gap-3 items-start animate-fadeIn" style={{ animationDelay: '0.45s' }}>
            <span className="text-base mt-0.5">✅</span>
            <div>
              <span className="font-bold">Delivery Completed</span>: Order #ord-99 successfully verified and delivered to customer. Commission credited.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
