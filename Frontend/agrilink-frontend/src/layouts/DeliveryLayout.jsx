import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import deliveryService from '../services/deliveryService';

const DeliveryLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [online, setOnline] = useState(deliveryService.getOnlineStatus());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleOnline = () => {
    const nextStatus = !online;
    deliveryService.toggleOnline(nextStatus);
    setOnline(nextStatus);
  };

  const navLinks = [
    { label: 'Dashboard', path: '/delivery/dashboard', icon: '📊' },
    { label: 'Assigned Deliveries', path: '/delivery/assigned-orders', icon: '🚚' },
    { label: 'Commission & Earnings', path: '/delivery/earnings', icon: '💰' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/delivery/dashboard')}>
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-amber-500/20">AL</div>
          <span className="text-lg font-black text-stone-800">AgriLink</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-stone-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-stone-100 flex flex-col justify-between md:sticky md:top-0 md:h-screen overflow-y-auto z-30`}>
        <div>
          {/* Header (desktop) */}
          <div className="hidden md:flex p-6 border-b border-stone-100 items-center space-x-3 cursor-pointer" onClick={() => navigate('/delivery/dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-amber-500/20">AL</div>
            <span className="text-xl font-black text-stone-800 tracking-tight">AgriLink</span>
          </div>

          {/* User profile Summary */}
          <div className="p-6 border-b border-stone-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-lg font-black text-amber-600">
                {user?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full relative pulse-dot" />
                  Delivery Partner
                </p>
                <h4 className="font-extrabold text-stone-800 text-sm leading-tight">{user?.name}</h4>
                <p className="text-[10px] text-stone-400 font-semibold">{user?.email}</p>
              </div>
            </div>

            {/* Online Status Toggle */}
            <div className={`flex items-center justify-between p-3 rounded-xl border transition ${online ? 'bg-emerald-50 border-emerald-200' : 'bg-stone-50 border-stone-200'}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                <span className={`text-xs font-bold ${online ? 'text-emerald-700' : 'text-stone-500'}`}>{online ? 'Online' : 'Offline'}</span>
              </div>
              <button
                onClick={handleToggleOnline}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-200 ${online ? 'bg-emerald-500' : 'bg-stone-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${online ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <nav className="p-3 space-y-1 text-sm font-bold text-stone-600">
            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 animate-slideIn ${isActive(link.path)
                    ? 'bg-amber-50 text-amber-700'
                    : 'hover:bg-stone-50 hover:text-stone-800'
                  }`}
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-stone-100">
          <button
            onClick={logout}
            className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition text-xs border border-red-100 btn-press"
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* Workspace Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DeliveryLayout;
