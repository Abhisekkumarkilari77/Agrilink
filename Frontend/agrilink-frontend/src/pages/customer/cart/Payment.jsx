import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../../services/orderService';
import { paymentService } from '../../../services/paymentService';
import { useCart } from '../../../context/CartContext';

const Payment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [cardNo, setCardNo] = useState('');
  const [cvv, setCvv] = useState('');
  const [upi, setUpi] = useState('');

  useEffect(() => {
    const data = sessionStorage.getItem('agrilink_checkout_details');
    if (!data) {
      navigate('/customer/cart');
    } else {
      setDetails(JSON.parse(data));
    }
  }, [navigate]);

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');

    if (details?.paymentMethod === 'CARD' && (cardNo.length < 16 || cvv.length < 3)) {
      setError('Please input valid Card details.');
      return;
    }

    if (details?.paymentMethod === 'UPI' && !upi.includes('@')) {
      setError('Please input a valid UPI ID (e.g. user@okaxis).');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order
      const order = await orderService.createOrder({
        items: details.items,
        address: details.address,
        slot: details.slot,
        paymentMethod: details.paymentMethod,
        total: details.total
      });

      // 2. Initiate Payment Transaction
      const transactionId = 'TXN' + Math.floor(100000 + Math.random() * 900000);
      const payment = await paymentService.initiatePayment({
        orderId: order.id,
        amount: details.total,
        method: details.paymentMethod,
        transactionId: transactionId
      });

      // 3. Mark online payment as SUCCESS to transition order to CONFIRMED
      if (details.paymentMethod !== 'COD') {
        await paymentService.updatePaymentStatus(payment.id, 'SUCCESS');
      }

      clearCart();
      sessionStorage.removeItem('agrilink_checkout_details');
      sessionStorage.setItem('agrilink_last_order', JSON.stringify(order));
      navigate('/customer/order-success');
    } catch (err) {
      console.error(err);
      setError('Payment transaction failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (!details) return null;

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-background px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full border border-gray-100 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Secure Payment</h2>
          <p className="text-gray-500 text-xs mt-1">Completing payment of <span className="font-extrabold text-primary">₹{details.total}</span></p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-semibold">{error}</div>}

        <form onSubmit={handlePay} className="space-y-5">
          {details.paymentMethod === 'UPI' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">UPI ID</label>
              <input
                type="text"
                placeholder="e.g. username@upi"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
              />
            </div>
          )}

          {details.paymentMethod === 'CARD' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Card Number</label>
                <input
                  type="text"
                  maxLength="16"
                  placeholder="Card Number (16 digits)"
                  value={cardNo}
                  onChange={(e) => setCardNo(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold tracking-widest"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiry</label>
                  <input type="text" placeholder="MM/YY" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold text-center" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">CVV</label>
                  <input
                    type="password"
                    maxLength="3"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {details.paymentMethod === 'NETBANKING' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Select Bank</label>
              <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-gray-600 font-semibold">
                <option value="SBI">State Bank of India</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="AXIS">Axis Bank</option>
              </select>
            </div>
          )}

          {details.paymentMethod === 'COD' && (
            <div className="p-4 bg-gray-50 border rounded-2xl text-center space-y-2">
              <p className="text-sm text-gray-600 font-medium">Cash on Delivery (COD)</p>
              <p className="text-[10px] text-gray-400">Please keep exact change ready when the order is delivered.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition flex items-center justify-center text-sm"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              details.paymentMethod === 'COD' ? 'Confirm Order' : 'Pay & Confirm Order'
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-gray-400">
          🔒 Secure 256-bit SSL encrypted connection.
        </div>
      </div>
    </div>
  );
};

export default Payment;
