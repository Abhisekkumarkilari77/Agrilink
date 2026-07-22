import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/customer/dashboard' },
    { label: 'Browse Products', path: '/customer/products' },
    { label: 'Nearby Farmers', path: '/customer/products?nearby=true' },
    { label: 'My Orders', path: '/customer/orders' },
    { label: 'Wishlist', path: '/customer/wishlist' },
    { label: 'Profile', path: '/customer/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-100 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/customer/dashboard')}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/20">
            AL
          </div>
          <span className="text-xl font-black text-stone-800 tracking-tight">AgriLink</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 bg-stone-50 rounded-2xl p-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition duration-200 ${isActive(link.path)
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Wishlist Icon */}
          <Link to="/customer/wishlist" className="relative p-2 text-stone-500 hover:text-primary transition" title="View Wishlist">
            <span className="text-xl">❤️</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold animate-scaleIn">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/customer/cart" className="relative p-2 text-stone-500 hover:text-primary transition" title="View Cart">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {getCartCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold animate-scaleIn">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Profile & Logout */}
          <div className="hidden sm:flex items-center space-x-3 border-l pl-4 border-stone-200">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-black text-primary">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-right">
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Customer</p>
              <p className="text-sm font-bold text-stone-800">{user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="text-xs font-bold px-3 py-1.5 border border-stone-200 rounded-xl bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition btn-press"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-stone-500 hover:text-stone-800 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-100 px-6 py-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition ${isActive(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-stone-600 hover:bg-stone-50'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { logout(); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
