import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../../services/orderService';

const STATUS_STEPS = [
  { key: 'ORDER_PLACED', label: 'Order Placed', desc: 'Order sent to farmer' },
  { key: 'FARMER_ACCEPTED', label: 'Farmer Accepted', desc: 'Farmer confirmed harvest' },
  { key: 'DELIVERY_ACCEPTED', label: 'Delivery Assigned', desc: 'Partner assigned' },
  { key: 'PICKED_UP', label: 'Picked Up', desc: 'Harvest picked up' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out For Delivery', desc: 'On the way to you' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Successfully delivered' }
];

const getStepIndex = (status) => {
  switch (status) {
    case 'ORDER_PLACED':
    case 'PENDING':
      return 0;
    case 'FARMER_ACCEPTED':
      return 1;
    case 'DELIVERY_ACCEPTED':
      return 2;
    case 'PICKED_UP':
      return 3;
    case 'OUT_FOR_DELIVERY':
      return 4;
    case 'DELIVERED':
      return 5;
    default:
      return 0;
  }
};

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      const active = data.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
      setOrders(active);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        setMessage('Order cancelled successfully.');
        fetchOrders();
      } catch (err) {
        alert('Failed to cancel order.');
      }
    }
  };

  const handleAdvanceStatus = async (order) => {
    const currentIndex = getStepIndex(order.status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentIndex + 1].key;
      try {
        const local = JSON.parse(localStorage.getItem('agrilink_mock_orders') || '[]');
        const idx = local.findIndex(o => o.id === order.id);
        if (idx !== -1) {
          local[idx].status = nextStatus;
          localStorage.setItem('agrilink_mock_orders', JSON.stringify(local));
        }
        setMessage(`Order ${order.id} status updated to ${nextStatus}`);
        fetchOrders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-black text-stone-800">Active Orders ({orders.length})</h2>
          <p className="text-xs text-stone-400 font-semibold mt-0.5">Real-time status tracking for your live farm deliveries</p>
        </div>
        <Link to="/customer/order-history" className="text-xs font-bold text-primary hover:underline">
          View Completed History →
        </Link>
      </div>

      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold">{message}</div>}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-150 shadow-sm space-y-4">
          <div className="text-5xl">🚚</div>
          <h3 className="text-base font-bold text-stone-700">No active orders right now</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Place an order from 200+ fresh farm products to track live delivery here.
          </p>
          <Link
            to="/customer/products"
            className="inline-block px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);

            return (
              <div key={order.id} className="bg-white rounded-3xl p-6 border border-stone-150 shadow-sm space-y-6 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      Order ID: {order.id}
                    </span>
                    <p className="text-xs text-stone-400 mt-2 font-semibold">
                      Placed on: {new Date(order.date || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-stone-800">Grand Total: ₹{order.total}</span>
                    <button
                      onClick={() => handleAdvanceStatus(order)}
                      title="Simulate next delivery status"
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"
                    >
                      ⚡ Advance Status
                    </button>
                    {(order.status === 'PENDING' || order.status === 'ORDER_PLACED') && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-xs font-bold transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Logistics Metadata */}
                <div className="grid sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl text-xs text-stone-600 border border-stone-100">
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase">Delivery Address</span>
                    <span className="font-semibold text-stone-800 truncate block mt-0.5">{order.address}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase">Delivery Slot</span>
                    <span className="font-semibold text-stone-800 block mt-0.5">{order.slot || 'Morning (8 AM - 11 AM)'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase">Delivery Partner</span>
                    <span className="font-bold text-emerald-600 block mt-0.5">Ravi Kumar (KA-01-EF-4567)</span>
                  </div>
                </div>

                {/* Items Ordered */}
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-stone-700">Items Included ({order.items ? order.items.length : 0}):</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-stone-50/70 border border-stone-100 rounded-xl">
                        <div>
                          <span className="font-bold text-stone-800">{item.name}</span>
                          <p className="text-[10px] text-stone-400">Farmer: {item.farmerName || 'Rajesh Organic Farm'}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-stone-800">₹{item.price * item.quantity}</span>
                          <p className="text-[10px] text-stone-400">x{item.quantity} kg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Stepper Timeline */}
                <div className="pt-4 border-t border-stone-100">
                  <p className="text-xs font-black text-stone-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    Live Logistics Timeline Status: <span className="text-primary font-black ml-1">{STATUS_STEPS[currentStepIdx]?.label}</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {STATUS_STEPS.map((step, idx) => {
                      const isPassed = idx <= currentStepIdx;
                      return (
                        <div
                          key={step.key}
                          className={`p-3 rounded-2xl border text-center transition ${
                            isPassed
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 font-bold'
                              : 'bg-stone-50 text-stone-400 border-stone-200'
                          }`}
                        >
                          <div className="text-xs font-black mb-1">Step {idx + 1}</div>
                          <div className="text-xs font-bold leading-tight">{step.label}</div>
                          <div className={`text-[9px] mt-1 ${isPassed ? 'text-white/80' : 'text-stone-400'}`}>
                            {step.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrentOrders;
