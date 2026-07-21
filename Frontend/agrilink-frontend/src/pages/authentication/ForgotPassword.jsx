import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await requestPasswordReset(email);
      setMessage(data.message || 'OTP sent successfully!');
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your registered email address to receive a password reset OTP.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs rounded-lg text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg transition duration-150 flex items-center justify-center"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Send OTP'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <Link to="/login" className="text-primary hover:underline font-semibold">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
