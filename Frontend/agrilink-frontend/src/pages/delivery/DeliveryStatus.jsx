import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';

const DeliveryStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadOrder = async () => {
    try {
      const list = await deliveryService.getMyDeliveries();
      const found = list.find(o => o.id === id);
      if (found) {
        setOrder(found);
        if (found.paymentMethod) {
          setPaymentMethod(found.paymentMethod);
        }
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

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await deliveryService.confirmPayment(id, paymentMethod);
      setMessage('Payment Confirmed! Delivery Completed successfully.');
      setTimeout(() => {
        navigate('/delivery/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Payment confirmation failed.');
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

  const itemsText = order.items ? order.items.map(item => item.name).join(', ') : 'N/A';
  const quantityText = order.items ? order.items.map(item => `${item.quantity} kg`).join(' + ') : 'N/A';

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
            { id: 'DELIVERY_ACCEPTED', label: 'Accepted by partner' },
            { id: 'PICKED_UP', label: 'Crops Picked up from farmer' },
            { id: 'IN_TRANSIT', label: 'In Transit' },
            { id: 'OUT_FOR_DELIVERY', label: 'Out For Delivery' },
            { id: 'DELIVERED', label: 'Delivered' }
          ].map((stage, idx) => {
            const list = ['DELIVERY_ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
            const currentIdx = list.indexOf(order.status);
            const stageIdx = list.indexOf(stage.id);
            const isDone = stageIdx <= currentIdx;

            return (
              <div key={stage.id} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isDone ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 border'}`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className={isDone ? 'text-gray-800 font-bold' : 'text-gray-400'}>{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Farmer Info */}
      <div className="p-4 border rounded-2xl bg-gray-50 text-xs space-y-1">
        <p className="font-bold text-gray-800 text-sm">Farmer Info</p>
        <p><span className="text-gray-400 font-semibold">Farmer Name:</span> <span className="font-semibold text-gray-700">{order.farmerName}</span></p>
        <p><span className="text-gray-400 font-semibold">Mobile:</span> <span className="font-semibold text-gray-700">{order.farmerPhone || 'N/A'}</span></p>
        <p><span className="text-gray-400 font-semibold">Pickup Address:</span> <span className="font-semibold text-gray-700">{order.farmerAddress || 'N/A'}</span></p>
      </div>

      {/* Customer Info */}
      <div className="p-4 border rounded-2xl bg-gray-50 text-xs space-y-1">
        <p className="font-bold text-gray-800 text-sm">Customer Info</p>
        <p><span className="text-gray-400">Name:</span> <span className="font-semibold text-gray-700">{order.customerName}</span></p>
        <p><span className="text-gray-400">Mobile:</span> <span className="font-semibold text-primary">{order.customerPhone || 'N/A'}</span></p>
        <p><span className="text-gray-400">Email:</span> <span className="font-semibold text-gray-700">{order.customerEmail || 'N/A'}</span></p>
        <p><span className="text-gray-400">Delivery Address:</span> <span className="font-semibold text-gray-700">{order.address}</span></p>
      </div>

      {/* Package & Payment Info */}
      <div className="p-4 border rounded-2xl bg-gray-50 text-xs space-y-1">
        <p className="font-bold text-gray-800 text-sm">Package & Payment Details</p>
        <p><span className="text-gray-400">Crops:</span> <span className="font-semibold text-gray-700">{itemsText}</span></p>
        <p><span className="text-gray-400">Quantity:</span> <span className="font-semibold text-gray-700">{quantityText}</span></p>
        <p><span className="text-gray-400">Total Amount:</span> <span className="font-semibold text-yellow-600">₹{order.total}</span></p>
        <p><span className="text-gray-400">Prescribed Payment Mode:</span> <span className="font-semibold text-gray-700">{order.paymentMethod || 'Online'}</span></p>
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
            onClick={() => handleStatusChange('OUT_FOR_DELIVERY')}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-xs transition"
          >
            Mark Out For Delivery
          </button>
        )}

        {order.status === 'OUT_FOR_DELIVERY' && (
          <form onSubmit={handleConfirmPayment} className="p-5 border border-dashed rounded-2xl bg-green-50/10 space-y-4">
            <p className="text-xs font-bold text-gray-700 text-center">Verify Payment Collection</p>
            <div className="space-y-2">
              <label className="block text-[10px] text-gray-450 uppercase font-bold">Select Active Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="UPI">UPI Payment</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="WALLET">Wallet</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition shadow-md">
              Confirm Payment Successful & Complete Delivery
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
      </div>
    </div>
  );
};

export default DeliveryStatus;
