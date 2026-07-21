import React from 'react';
import useAuth from '../../hooks/useAuth';

const PendingVerification = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-yellow-100">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Pending</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Hello <span className="font-semibold">{user?.name}</span>, your registration as a <span className="font-semibold text-primary">{user?.role?.replace('_', ' ')}</span> is currently pending administrative verification.
        </p>
        <div className="bg-yellow-50 text-yellow-800 rounded-lg p-4 mb-6 text-sm text-left">
          <p className="font-semibold mb-1">Status: Pending Admin Review</p>
          <p>Our admins are verifying your documents. We will notify you once your account is activated. Usually takes 24-48 hours.</p>
        </div>
        <button
          onClick={logout}
          className="w-full bg-gray-150 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition duration-150 ease-in-out border border-gray-300"
        >
          Logout & Return to Login
        </button>
      </div>
    </div>
  );
};

export default PendingVerification;
