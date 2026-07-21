import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';

const PickupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [message, setMessage] = useState('');

  const loadOrder = async () => {
    try {
      const list = await deliveryService.getMyDeliveries();
      const found = list.find(o => o.id === id);
      if (found) {
        setOrder(found);
      } else {
        setError('Delivery details not found.');
      }
    } catch (err) {
      setError('Failed to fetch details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleGenerateOtp = async () => {
    setError('');
    setMessage('');
    try {
      await deliveryService.generatePickupOtp(id);
      setOtpSent(true);
      setMessage('Pickup OTP sent to Farmer registered email.');
    } catch (err) {
      setError(err.message || 'Failed to generate pickup OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await deliveryService.verifyPickupOtp(id, enteredOtp);
      alert('Farmer OTP verified successfully! Package loaded.');
      navigate(`/delivery/delivery-status/${id}`);
    } catch (err) {
      setError(err.message || 'Verification failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error || !order) {
    return <div className="text-center py-12 text-red-600 font-bold">{error || 'Order not found'}</div>;
  }

  // Helper to join item names
  const itemsText = order.items ? order.items.map(item => item.name).join(', ') : 'N/A';
  const quantityText = order.items ? order.items.map(item => `${item.quantity} kg`).join(' + ') : 'N/A';
  const totalWeight = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) + ' kg' : 'N/A';

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-8 max-w-xl mx-auto shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Farmer Package Pickup</h2>
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">{order.status}</span>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center font-bold">{error}</div>}
      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold">{message}</div>}

      {/* Info grids */}
      <div className="space-y-4 text-xs">
        {/* Farmer info */}
        <div className="p-4 bg-gray-50 rounded-2xl border space-y-2">
          <p className="text-sm font-bold text-gray-800">Farmer Contact Details</p>
          <p><span className="text-gray-400 font-semibold">Farmer Name:</span> <span className="font-bold">{order.farmerName}</span></p>
          <p><span className="text-gray-400 font-semibold">Mobile:</span> <span className="font-bold text-primary">{order.farmerPhone || 'N/A'}</span></p>
          <p><span className="text-gray-400 font-semibold">Farm Address:</span> <span className="font-bold">{order.farmerAddress || 'N/A'}</span></p>
        </div>

        {/* Product details */}
        <div className="p-4 bg-gray-50 rounded-2xl border space-y-2">
          <p className="text-sm font-bold text-gray-800">Package Details</p>
          <p><span className="text-gray-400 font-semibold">Crop(s):</span> <span className="font-bold">{itemsText}</span></p>
          <p><span className="text-gray-400 font-semibold">Quantities:</span> <span className="font-bold">{quantityText}</span></p>
          <p><span className="text-gray-400 font-semibold">Total Weight:</span> <span className="font-bold text-yellow-600">{totalWeight}</span></p>
        </div>
      </div>

      <div className="pt-4 border-t space-y-4">
        <button
          onClick={() => navigate(`/delivery/route-navigation/${id}`)}
          className="w-full py-3 bg-gray-100 hover:bg-gray-250 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition border flex items-center justify-center"
        >
          Navigate to Farmer (Google Maps)
        </button>

        {/* OTP flow */}
        {!otpSent ? (
          <div className="p-5 border border-dashed rounded-2xl bg-yellow-50/20 space-y-4 text-center">
            <p className="text-xs font-bold text-gray-700">Arrived at Farm location?</p>
            <button
              onClick={handleGenerateOtp}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-xs transition shadow-md"
            >
              Generate Pickup OTP
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp} className="p-5 border border-dashed rounded-2xl bg-yellow-50/25 space-y-4">
            <p className="text-xs font-bold text-gray-700 text-center">Enter Farmer Pickup OTP (Sent to Farmer's registered email)</p>
            <input
              type="text"
              placeholder="6-digit OTP"
              maxLength="6"
              value={enteredOtp}
              onChange={e => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-xs transition shadow-md"
            >
              Verify OTP & Complete Pickup
            </button>
            <button
              type="button"
              onClick={handleGenerateOtp}
              className="w-full text-center text-[10px] text-gray-400 hover:underline"
            >
              Resend OTP to Farmer
            </button>
          </form>
        )}

        <div className="text-center text-[10px] text-gray-400 bg-yellow-55 bg-yellow-50 rounded-lg p-2">
          Mock Farmer OTP is <span className="font-bold">123456</span>
        </div>
      </div>
    </div>
  );
};

export default PickupDetails;
