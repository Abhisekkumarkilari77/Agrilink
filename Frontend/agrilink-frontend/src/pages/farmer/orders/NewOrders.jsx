import React, { useEffect, useState } from 'react';
import farmerService from '../../../services/farmerService';

const NewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const data = await farmerService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAccept = async (id) => {
    try {
      await farmerService.updateOrderStatus(id, 'FARMER_ACCEPTED');
      setMessage('Order accepted successfully.');
      fetchOrders();
    } catch (err) {
      alert('Failed to accept order.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason (e.g. Out of Stock, Damaged Product):');
    if (reason) {
      try {
        await farmerService.updateOrderStatus(id, 'CANCELLED');
        setMessage('Order rejected.');
        fetchOrders();
      } catch (err) {
        alert('Failed to reject order.');
      }
    }
  };

  const handlePack = async (id) => {
    try {
      await farmerService.updateOrderStatus(id, 'PACKED');
      setMessage('Order packed and ready for delivery partner pickup.');
      fetchOrders();
    } catch (err) {
      alert('Failed to set packing status.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  const incoming = orders.filter(o => o.status === 'PENDING' || o.status === 'ORDER_PLACED' || o.status === 'CONFIRMED');
  const active = orders.filter(o => o.status === 'FARMER_ACCEPTED' || o.status === 'DELIVERY_ACCEPTED' || o.status === 'ACCEPTED' || o.status === 'PACKED' || o.status === 'PICKED_UP');
  const completed = orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');

  return (
    <div className="space-y-8">
      {message && <div className="p-4 bg-green-50 text-green-700 text-sm font-semibold rounded-xl text-center shadow-sm">{message}</div>}

      {/* 1. Incoming Requests */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-2"></span>
          Incoming Requests ({incoming.length})
        </h3>
        {incoming.length === 0 ? (
          <p className="text-xs text-gray-400">No new incoming orders.</p>
        ) : (
          <div className="space-y-4">
            {incoming.map(o => (
              <div key={o.id} className="p-5 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/20 text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-gray-800 text-sm">Order ID: {o.id}</p>
                  <p className="text-gray-500">Address: {o.address} | Slot: {o.slot}</p>
                  <div className="space-y-1">
                    {o.items.map((item, idx) => (
                      <p key={idx} className="font-semibold text-gray-600">• {item.name} (x{item.quantity} kg) - ₹{item.price * item.quantity}</p>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button onClick={() => handleAccept(o.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition">Accept</button>
                  <button onClick={() => handleReject(o.id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold border border-red-200 transition">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Active Orders Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
          Active Orders In Packing / Pickup ({active.length})
        </h3>
        {active.length === 0 ? (
          <p className="text-xs text-gray-400">No active packing orders.</p>
        ) : (
          <div className="space-y-4">
            {active.map(o => (
              <div key={o.id} className="p-5 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/20 text-xs gap-4">
                <div className="space-y-2">
                  <p className="font-bold text-gray-800 text-sm">Order ID: {o.id}</p>
                  <p className="text-gray-500">Current Status: <span className="font-bold text-primary">
                    {o.status === 'FARMER_ACCEPTED' ? 'Preparing Order' :
                     o.status === 'DELIVERY_ACCEPTED' ? 'Delivery Partner Assigned' :
                     o.status === 'PICKED_UP' ? 'Picked Up (In Transit)' : o.status}
                  </span></p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {(o.status === 'FARMER_ACCEPTED' || o.status === 'CONFIRMED') && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      Awaiting Delivery Driver Assignment
                    </span>
                  )}
                  {o.status === 'DELIVERY_ACCEPTED' && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 animate-pulse">
                      Driver en route to your farm
                    </span>
                  )}
                  {o.status === 'PICKED_UP' && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                      Picked up by Driver
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. History */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full mr-2"></span>
          Completed / Cancelled Archive ({completed.length})
        </h3>
        {completed.length === 0 ? (
          <p className="text-xs text-gray-400">No completed orders found.</p>
        ) : (
          <div className="space-y-3">
            {completed.map(o => (
              <div key={o.id} className="p-3 border rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-800">Order ID: {o.id}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Total Paid: ₹{o.total}</p>
                </div>
                <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOrders;
