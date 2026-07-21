import React, { useState, useEffect } from 'react';
import deliveryService from '../../services/deliveryService';

const Earnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchRevenue = async () => {
    try {
      const res = await deliveryService.getEarnings();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const amt = Number(withdrawAmt);
    if (amt <= 0) {
      setError('Please input a valid amount.');
      return;
    }

    if (amt > (data?.monthly || 0)) {
      setError('Insufficient funds for withdrawal. Maximum limit is monthly balance.');
      return;
    }

    try {
      const res = await deliveryService.requestWithdrawal(amt, { bankAcc });
      setMessage(res.message);
      setWithdrawAmt('');
      setBankAcc('');
    } catch (err) {
      setError('Withdrawal request failed.');
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
    <div className="space-y-8">
      {/* Earnings Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase">Today's Earnings</span>
          <span className="text-3xl font-extrabold text-gray-800 mt-2">₹{data?.today}</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase">Weekly Earnings</span>
          <span className="text-3xl font-extrabold text-gray-800 mt-2">₹{data?.weekly}</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase">Monthly Earnings</span>
          <span className="text-3xl font-extrabold text-amber-600 mt-2">₹{data?.monthly}</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase">Lifetime Earnings</span>
          <span className="text-3xl font-extrabold text-gray-800 mt-2">₹{data?.lifetime}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Withdraw Panel */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Request Withdrawal</h3>
          {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold">{message}</div>}
          {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center font-bold">{error}</div>}

          <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-500 uppercase mb-2">Withdraw Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={withdrawAmt}
                onChange={e => setWithdrawAmt(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-500 uppercase mb-2">Bank Account / UPI ID</label>
              <input
                type="text"
                placeholder="Account number or upi@id"
                value={bankAcc}
                onChange={e => setBankAcc(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl text-sm font-semibold"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-xs transition">
              Submit Payout Request
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Commission History</h3>
          <div className="space-y-3">
            {data?.transactions.map((tx, idx) => (
              <div key={idx} className="p-4 border rounded-2xl flex justify-between items-center text-xs bg-gray-50/20">
                <div>
                  <p className="font-bold text-gray-800">Tx ID: {tx.id} (Order: {tx.orderId})</p>
                  <p className="text-gray-400 mt-1">Processed on {tx.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-black text-green-600 block">+ ₹{tx.commission}</span>
                  <span className="text-[9px] font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
