import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const FarmerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/farmer/dashboard', icon: '📊' },
    { label: 'Farm Profile', path: '/farmer/farm', icon: '🏡' },
    { label: 'My Products', path: '/farmer/products', icon: '🌽' },
    { label: 'Inventory', path: '/farmer/inventory', icon: '📦' },
    { label: 'Orders Pipeline', path: '/farmer/orders', icon: '📋' },
    { label: 'Earnings Ledger', path: '/farmer/earnings', icon: '💰' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/farmer/dashboard')}>
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/20">AL</div>
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

      {/* Sidebar navigation */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-stone-100 flex flex-col justify-between md:sticky md:top-0 md:h-screen overflow-y-auto z-30`}>
        <div>
          {/* Brand header (desktop) */}
          <div className="hidden md:flex p-6 border-b border-stone-100 items-center space-x-3 cursor-pointer" onClick={() => navigate('/farmer/dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary/20">AL</div>
            <span className="text-xl font-black text-stone-800 tracking-tight">AgriLink</span>
          </div>

          {/* User profile Summary */}
          <div className="p-6 border-b border-stone-100 space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg font-black text-primary">
                {user?.name?.charAt(0) || 'F'}
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full relative pulse-dot" />
                  Verified Farmer
                </p>
                <h4 className="font-extrabold text-stone-800 text-sm leading-tight">{user?.name}</h4>
                <p className="text-[11px] text-stone-400 font-semibold">{user?.farmName || 'Green Valley Farms'}</p>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1 text-sm font-bold text-stone-600">
            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 animate-slideIn ${isActive(link.path)
                    ? 'bg-primary/10 text-primary'
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

export default FarmerLayout;
