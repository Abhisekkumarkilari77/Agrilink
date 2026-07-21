import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('agrilink_last_order');
    if (data) {
      setOrder(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 max-w-md w-full text-center border border-stone-100 space-y-6 animate-scaleIn">
        
        {/* Animated Checkmark */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-fadeIn shadow-inner shadow-emerald-500/20">
          <svg
            className="w-10 h-10 animate-checkmark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="animate-fadeIn stagger-1">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Order Placed Successfully!</h2>
          <p className="text-stone-500 text-sm mt-1 font-medium">Thank you for supporting local farmers.</p>
        </div>

        {order && (
          <div className="p-4 bg-stone-50 rounded-2xl space-y-2.5 text-xs text-left border border-stone-100 animate-fadeIn stagger-2">
            <p className="flex justify-between items-center"><span className="text-stone-400 font-bold uppercase tracking-wider">Order ID</span> <span className="font-black text-stone-700">{order.id}</span></p>
            <p className="flex justify-between items-center"><span className="text-stone-400 font-bold uppercase tracking-wider">Grand Total</span> <span className="font-black text-stone-800 text-sm">₹{order.total}</span></p>
            <p className="flex justify-between items-center"><span className="text-stone-400 font-bold uppercase tracking-wider">Delivery Slot</span> <span className="font-bold text-stone-600">{order.slot}</span></p>
            <p className="flex justify-between items-center"><span className="text-stone-400 font-bold uppercase tracking-wider">Est. Delivery</span> <span className="font-black text-emerald-600">Tomorrow ({order.slot})</span></p>
          </div>
        )}

        <div className="space-y-3 pt-2 animate-fadeIn stagger-3">
          <button
            onClick={() => navigate('/customer/orders')}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition btn-press"
          >
            Track My Order
          </button>
          
          <button
            onClick={() => addToast('Invoice download started.', 'info')}
            className="w-full py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-2xl font-bold text-sm transition btn-press"
          >
            Download Invoice (PDF)
          </button>

          <button
            onClick={() => navigate('/customer/products')}
            className="w-full py-2.5 text-xs font-bold text-primary hover:text-primary-dark transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
