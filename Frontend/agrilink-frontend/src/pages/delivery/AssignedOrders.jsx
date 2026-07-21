import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';

const AssignedOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const data = await deliveryService.getAssignedOrders();
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
      await deliveryService.acceptDelivery(id);
      setMessage('Delivery accepted! Navigation started.');
      fetchOrders();
    } catch (err) {
      alert('Failed to accept delivery.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Select Rejection Reason (Vehicle Breakdown / Health Issue / Too Far / Emergency):');
    if (reason) {
      try {
        await deliveryService.rejectDelivery(id, reason);
        setMessage('Delivery assignment rejected.');
        fetchOrders();
      } catch (err) {
        alert('Failed to reject assignment.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Assigned Deliveries ({orders.length})</h2>
      {message && <div className="p-4 bg-green-50 text-green-700 text-sm font-semibold rounded-xl text-center shadow-sm">{message}</div>}

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border p-6">
          No new delivery assignments. Make sure you are online!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-black text-gray-800">Order ID: {o.id}</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">{o.status}</span>
                </div>
                <p><span className="text-gray-400 font-semibold">Farmer:</span> <span className="font-bold text-gray-700">{o.farmerName}</span> ({o.farmName})</p>
                <p><span className="text-gray-400 font-semibold">Pickup:</span> <span className="font-bold text-gray-700">{o.pickupAddress}</span></p>
                <p><span className="text-gray-400 font-semibold">Delivery To:</span> <span className="font-bold text-gray-700">{o.customerName}</span></p>
                <p><span className="text-gray-400 font-semibold">Delivery Address:</span> <span className="font-bold text-gray-700">{o.deliveryAddress}</span></p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t text-[10px] text-gray-500 font-bold">
                  <div><span className="block text-gray-400">DISTANCE</span>{o.distance}</div>
                  <div><span className="block text-gray-400">EST TIME</span>{o.eta}</div>
                  <div><span className="block text-gray-400">PAYOUT</span>₹{o.earnings}</div>
                </div>
              </div>

              <div className="pt-4 border-t flex space-x-3">
                {o.status === 'ASSIGNED' ? (
                  <>
                    <button
                      onClick={() => handleAccept(o.id)}
                      className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                      Accept Delivery
                    </button>
                    <button
                      onClick={() => handleReject(o.id)}
                      className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/delivery/pickup-details/${o.id}`)}
                    className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    View Pickup Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;
