import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderService from '../../../services/orderService';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await orderService.getOrders();
        // Filter for completed/cancelled orders
        const completed = data.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');
        setOrders(completed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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
        <h2 className="text-xl font-bold text-gray-800">Order History ({orders.length})</h2>
        <Link to="/customer/orders" className="text-xs font-semibold text-primary hover:underline">
          ← View Active Orders
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-sm text-gray-500">
          No past orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-gray-700">Order ID: {order.id}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Ordered on: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                  <span className="text-xs font-black text-gray-800">₹{order.total}</span>
                </div>
              </div>

              {/* Items */}
              <div className="text-xs space-y-1">
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-gray-600">
                    {item.name} (x{item.quantity} kg) - <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                  </p>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-3 border-t">
                <button
                  onClick={() => alert('Invoice download triggered.')}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 transition"
                >
                  Download Invoice
                </button>
                {order.status === 'DELIVERED' && (
                  <button
                    onClick={() => {
                      alert('Redirecting to reviews submission panel.');
                    }}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-xl transition"
                  >
                    Leave Feedback
                  </button>
                )}
                <button
                  onClick={() => {
                    navigate('/customer/products');
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  Buy Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
