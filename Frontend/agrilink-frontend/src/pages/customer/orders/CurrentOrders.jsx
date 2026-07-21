import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderService from '../../../services/orderService';

const CurrentOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      // Filter out DELIVERED and CANCELLED for active current orders
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Active Orders ({orders.length})</h2>
        <Link to="/customer/order-history" className="text-xs font-semibold text-primary hover:underline">
          View Order History →
        </Link>
      </div>

      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold">{message}</div>}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-sm text-gray-500">
          No active orders at the moment. Try shopping for fresh vegetables!
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const steps = ['Placed', 'Accepted', 'Packed', 'In Transit', 'Out for Delivery', 'Delivered'];
            // Determine active index
            const currentStepIdx = order.status === 'PENDING' ? 0 : 1; // Simplify tracking for mockup

            return (
              <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-400">Order ID: {order.id}</span>
                    <p className="text-xs text-gray-400 mt-0.5">Date: {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-gray-800">Grand Total: ₹{order.total}</span>
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-gray-700">Items Ordered:</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between max-w-md">
                      <span className="text-gray-600">{item.name} (x{item.quantity} kg)</span>
                      <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Stepper Timeline */}
                <div className="pt-4 border-t">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Order Tracking</p>
                  <div className="relative flex justify-between items-center w-full">
                    {steps.map((step, idx) => (
                      <div key={step} className="flex flex-col items-center flex-1 z-10 relative">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition ${
                            idx <= currentStepIdx
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold mt-2 text-center whitespace-normal md:whitespace-nowrap">
                          {step}
                        </span>
                      </div>
                    ))}
                    {/* Connecting line */}
                    <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-100 -z-10"></div>
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
