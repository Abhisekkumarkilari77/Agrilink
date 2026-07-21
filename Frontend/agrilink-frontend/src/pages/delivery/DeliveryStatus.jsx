import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';

const DeliveryStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadOrder = async () => {
    try {
      const list = await deliveryService.getAssignedOrders();
      const found = list.find(o => o.id === id);
      if (found) {
        setOrder(found);
      } else {
        setError('Order not found.');
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

  const handleStatusChange = async (nextStatus) => {
    try {
      await deliveryService.updateDeliveryStatus(id, nextStatus);
      loadOrder();
    } catch (err) {
      alert('Failed to update stage.');
    }
  };

  const handleVerifyDelivery = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await deliveryService.verifyDeliveryOtp(id, otp);
      setMessage('OTP Verified! Delivery Completed successfully. Commission added.');
      setTimeout(() => {
        navigate('/delivery/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Verification failed.');
    }
  };

  const handleReportEmergency = () => {
    const issue = window.prompt('Describe the emergency (Vehicle Breakdown / Product Damaged / Customer Unreachable):');
    if (issue) {
      alert('Emergency reported successfully. Admin team will contact you shortly.');
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

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-8 max-w-xl mx-auto shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Active Delivery Status</h2>
        <button onClick={handleReportEmergency} className="text-xs font-bold text-red-600 hover:underline">
          🚨 Report Emergency
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center font-bold">{error}</div>}
      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold">{message}</div>}

      {/* Timeline Stepper */}
      <div className="p-5 border rounded-2xl bg-gray-50/50 space-y-4 text-xs font-bold text-gray-600">
        <p className="uppercase text-gray-400 tracking-widest text-[10px] mb-2">Milestone Checklist</p>
        <div className="space-y-3">
          {[
            { id: 'ACCEPTED', label: 'Accepted by partner' },
            { id: 'PICKED_UP', label: 'Crops Picked up from farmer' },
            { id: 'IN_TRANSIT', label: 'In Transit' },
            { id: 'REACHED_CUSTOMER', label: 'Reached Customer Location' },
            { id: 'DELIVERED', label: 'Delivered' }
          ].map((stage, idx) => {
            const list = ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'REACHED_CUSTOMER', 'DELIVERED'];
            const currentIdx = list.indexOf(order.status);
            const stageIdx = list.indexOf(stage.id);
            const isDone = stageIdx <= currentIdx;

            return (
              <div key={stage.id} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isDone ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 border'}`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className={isDone ? 'text-gray-855 text-gray-800 font-bold' : 'text-gray-400'}>{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Info */}
      <div className="p-4 border rounded-2xl bg-gray-50 text-xs space-y-1">
        <p className="font-bold text-gray-800 text-sm">Customer Info</p>
        <p><span className="text-gray-400">Name:</span> <span className="font-semibold text-gray-700">{order.customerName}</span></p>
        <p><span className="text-gray-400">Mobile:</span> <span className="font-semibold text-primary">{order.customerContact}</span></p>
        <p><span className="text-gray-400">Address:</span> <span className="font-semibold text-gray-700">{order.deliveryAddress}</span></p>
      </div>

      {/* Control flows */}
      <div className="pt-4 border-t space-y-4">
        {order.status === 'PICKED_UP' && (
          <button
            onClick={() => handleStatusChange('IN_TRANSIT')}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-xs transition"
          >
            Start Transit (Mark In Transit)
          </button>
        )}

        {order.status === 'IN_TRANSIT' && (
          <button
            onClick={() => handleStatusChange('REACHED_CUSTOMER')}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-xs transition"
          >
            Mark Reached Customer Location
          </button>
        )}

        {order.status === 'REACHED_CUSTOMER' && (
          <form onSubmit={handleVerifyDelivery} className="p-5 border border-dashed rounded-2xl bg-green-50/10 space-y-4">
            <p className="text-xs font-bold text-gray-700 text-center">Verify Customer Delivery OTP</p>
            <input
              type="text"
              placeholder="6-digit OTP"
              maxLength="6"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition">
              Verify & Complete Delivery
            </button>
          </form>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate(`/delivery/route-navigation/${id}`)} className="py-2.5 bg-gray-50 border rounded-xl font-bold text-xs hover:bg-gray-100 transition">
            View Route Map
          </button>
          <button onClick={() => navigate('/delivery/assigned-orders')} className="py-2.5 bg-gray-50 border rounded-xl font-bold text-xs hover:bg-gray-100 transition">
            Assigned Orders
          </button>
        </div>

        {order.status === 'REACHED_CUSTOMER' && (
          <div className="text-center text-[10px] text-gray-400 bg-green-50 rounded-lg p-2">
            Mock Customer OTP is <span className="font-bold">123456</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryStatus;
