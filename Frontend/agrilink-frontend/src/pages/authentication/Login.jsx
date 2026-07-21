import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { login, error: authError, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const redirectAfterLogin = (user) => {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else if (user.role === 'FARMER') {
      navigate((user.status === 'APPROVED' || user.status === 'ACTIVE') ? '/farmer/dashboard' : '/pending-verification', { replace: true });
    } else if (user.role === 'DELIVERY') {
      navigate((user.status === 'APPROVED' || user.status === 'ACTIVE') ? '/delivery/dashboard' : '/pending-verification', { replace: true });
    } else {
      navigate('/customer/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setError(null);

    if (!username.trim() || !password.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(username, password);
      redirectAfterLogin(user);
    } catch (err) {
      // Handled by AuthContext error state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-stone-50 to-emerald-50/30 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 md:p-10 max-w-md w-full border border-stone-100 animate-scaleIn">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Welcome to AgriLink</h2>
          <p className="text-stone-400 text-sm mt-1 font-medium">Connecting Local Farmers Directly to Customers</p>
        </div>

        {/* Session Expired Alert */}
        {location.search.includes('expired') && (
          <div className="mb-5 p-3.5 bg-amber-50 text-amber-700 text-xs rounded-2xl text-center font-semibold border border-amber-100 flex items-center justify-center gap-2 animate-fadeIn">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Your session has expired. Please login again.
          </div>
        )}

        {/* Error Alert */}
        {(formError || authError) && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-xs rounded-2xl text-center font-semibold border border-red-100 flex items-center justify-center gap-2 animate-fadeIn">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {formError || authError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-fadeIn stagger-1">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Email or Mobile Number
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm font-medium text-stone-800 placeholder:text-stone-300"
              placeholder="e.g., customer@agrilink.com"
            />
          </div>

          <div className="animate-fadeIn stagger-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-dark font-bold transition">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm font-medium text-stone-800 placeholder:text-stone-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600 transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-primary/25 transition duration-200 flex items-center justify-center btn-press animate-fadeIn stagger-3"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-7 pt-6 border-t border-stone-100 text-sm text-stone-500 animate-fadeIn stagger-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark font-bold transition">
            Register Here
          </Link>
        </div>

        {/* Dev credentials */}
        <div className="mt-5 p-4 bg-stone-50 rounded-2xl text-center text-[10px] text-stone-400 border border-stone-100 animate-fadeIn stagger-5">
          <p className="font-bold mb-1.5 uppercase tracking-wider text-stone-500">Testing Credentials</p>
          <div className="space-y-0.5">
            <p>Customer: customer@agrilink.com | password</p>
            <p>Farmer: farmer@agrilink.com | password</p>
            <p>Delivery: delivery@agrilink.com | password</p>
            <p>Admin: admin1@agrilink.com | password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
