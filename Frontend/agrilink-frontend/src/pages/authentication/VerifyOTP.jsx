import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const VerifyOTP = () => {
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes (300s)
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const target = sessionStorage.getItem('agrilink_otp_target') || 'your email/mobile';

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    if (attempts >= 3) {
      setError('Maximum attempts (3) exceeded. Please request a new OTP.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOTP(otp);
      setMessage(data.message || 'OTP Verified!');
      setTimeout(() => {
        // Redirect based on user details returned
        const user = data.user;
        if (user) {
          if (user.role === 'FARMER' || user.role === 'DELIVERY') {
            navigate('/pending-verification');
          } else {
            navigate('/customer/dashboard');
          }
        } else {
          navigate('/login');
        }
      }, 1500);
    } catch (err) {
      setAttempts(prev => prev + 1);
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(300);
    setAttempts(0);
    setError('');
    setMessage('A new OTP has been sent successfully.');
  };

  return (
    <div className="min-h-[85vh] bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 text-center">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">OTP Verification</h2>
        <p className="text-gray-500 text-sm mb-6">
          We have sent a verification code to <span className="font-semibold text-gray-700">{target}</span>
        </p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs rounded-lg">{message}</div>}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter 6-digit OTP"
              className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-xl font-bold tracking-widest"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {timer > 0 ? `Expires in: ${formatTime(timer)}` : 'OTP Expired'}
            </span>
            <button
              type="button"
              disabled={timer > 0}
              onClick={handleResend}
              className={`font-semibold ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:underline'}`}
            >
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-150 flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className="mt-6 p-2 bg-yellow-50 text-yellow-800 text-[10px] rounded-lg">
          Mock OTP is <span className="font-bold">123456</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
