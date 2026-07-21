import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';

const AssignedOrders = () => {
  const navigate = useNavigate();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'my'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const avail = await deliveryService.getAssignedOrders();
      const mine = await deliveryService.getMyDeliveries();
      setAvailableOrders(avail || []);
      setMyOrders(mine || []);
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
      setMessage('Delivery accepted! Order added to your active deliveries.');
      fetchOrders();
      setActiveTab('my');
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

  const handleViewDetails = (o) => {
    if (o.status === 'DELIVERY_ACCEPTED' || o.status === 'ACCEPTED' || o.status === 'CONFIRMED' || o.status === 'PACKED') {
      navigate(`/delivery/pickup-details/${o.id}`);
    } else {
      navigate(`/delivery/delivery-status/${o.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  const currentOrders = activeTab === 'available' ? availableOrders : myOrders;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Deliveries Portal</h2>
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'available' ? 'bg-white shadow-sm text-yellow-600' : 'text-gray-500'}`}
          >
            Available Jobs ({availableOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'my' ? 'bg-white shadow-sm text-yellow-600' : 'text-gray-500'}`}
          >
            Active Deliveries ({myOrders.length})
          </button>
        </div>
      </div>

      {message && <div className="p-4 bg-green-50 text-green-700 text-sm font-semibold rounded-xl text-center shadow-sm">{message}</div>}

      {currentOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border p-6">
          {activeTab === 'available'
            ? 'No new delivery assignments available.'
            : 'You have no active deliveries. Go to "Available Jobs" to accept one!'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {currentOrders.map((o) => {
            const itemsName = o.items ? o.items.map(item => item.name).join(', ') : 'N/A';
            const totalWeight = o.items ? o.items.reduce((sum, item) => sum + item.quantity, 0) + ' kg' : 'N/A';

            return (
              <div key={o.id} className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-black text-gray-800">Order ID: {o.id}</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">{o.status}</span>
                  </div>
                  <p><span className="text-gray-400 font-semibold">Farmer:</span> <span className="font-bold text-gray-700">{o.farmerName}</span></p>
                  <p><span className="text-gray-400 font-semibold">Pickup:</span> <span className="font-bold text-gray-700">{o.farmerAddress || o.pickupAddress || 'N/A'}</span></p>
                  <p><span className="text-gray-400 font-semibold">Customer:</span> <span className="font-bold text-gray-700">{o.customerName}</span></p>
                  <p><span className="text-gray-400 font-semibold">Delivery Address:</span> <span className="font-bold text-gray-700">{o.address || o.deliveryAddress || 'N/A'}</span></p>
                  <p><span className="text-gray-400 font-semibold">Crops:</span> <span className="font-bold text-gray-700">{itemsName} ({totalWeight})</span></p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[10px] text-gray-500 font-bold">
                    <div><span className="block text-gray-400">PAYMENT</span>{o.paymentMethod || 'Online'}</div>
                    <div><span className="block text-gray-400">TOTAL AMOUNT</span>₹{o.total}</div>
                    <div><span className="block text-gray-400">ESTIMATED EARNINGS</span>₹40</div>
                    <div><span className="block text-gray-400">DISTANCE</span>4.2 km</div>
                  </div>
                </div>

                <div className="pt-4 border-t flex space-x-3">
                  {activeTab === 'available' ? (
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
                      onClick={() => handleViewDetails(o)}
                      className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                      Process Delivery
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;
