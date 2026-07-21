import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const data = await adminService.getOrders();
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

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await adminService.cancelOrder(id);
        setMessage('Order cancelled successfully.');
        fetchOrders();
      } catch (err) {
        alert('Failed to cancel order.');
      }
    }
  };

  const handleRefund = async (id) => {
    try {
      const res = await adminService.refundOrder(id);
      setMessage(res.message);
    } catch (err) {
      alert('Failed to process refund.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Order Monitoring Panel ({orders.length})</h2>
      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold text-center">{message}</div>}

      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left text-gray-500">
          <thead className="text-[10px] uppercase text-gray-400 bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-semibold">Order ID</th>
              <th className="px-6 py-3 font-semibold">Customer Address</th>
              <th className="px-6 py-3 font-semibold">Scheduled Slot</th>
              <th className="px-6 py-3 font-semibold">Total Paid</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/20 transition">
                <td className="px-6 py-4 font-bold text-gray-800">{o.id}</td>
                <td className="px-6 py-4 truncate max-w-xs">{o.address}</td>
                <td className="px-6 py-4">{o.slot}</td>
                <td className="px-6 py-4 font-bold text-gray-800">₹{o.total}</td>
                <td className="px-6 py-4 font-bold">
                  <span className={`px-2.5 py-0.5 rounded-full ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : o.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && (
                    <button onClick={() => handleCancel(o.id)} className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold border border-red-200">
                      Cancel
                    </button>
                  )}
                  {o.status === 'CANCELLED' && (
                    <button onClick={() => handleRefund(o.id)} className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold">
                      Process Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
