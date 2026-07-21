import React, { useState, useEffect } from 'react';
import farmerService from '../../../services/farmerService';
import { useToast } from '../../../context/ToastContext';
import { SkeletonDashboard } from '../../../components/common/SkeletonCard';

const Revenue = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const { addToast } = useToast();

  const fetchRevenue = async () => {
    try {
      const res = await farmerService.getEarnings();
      setData(res);
    } catch (err) {
      console.error(err);
      addToast('Failed to load revenue data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const amt = Number(withdrawAmt);
    if (amt <= 0) {
      addToast('Please input a valid amount.', 'warning');
      return;
    }

    if (amt > (data?.monthly || 0)) {
      addToast('Insufficient funds for withdrawal. Maximum limit is monthly balance.', 'error');
      return;
    }

    try {
      const res = await farmerService.requestWithdrawal(amt, { bankAcc });
      addToast(res.message, 'success');
      setWithdrawAmt('');
      setBankAcc('');
    } catch (err) {
      addToast('Withdrawal request failed.', 'error');
    }
  };

  if (loading) return <SkeletonDashboard />;

  // Chart data
  const chartData = data?.monthlyBreakdown || [
    { month: 'Jan', amount: 3200 }, { month: 'Feb', amount: 4100 },
    { month: 'Mar', amount: 3800 }, { month: 'Apr', amount: 5200 },
    { month: 'May', amount: 4700 }, { month: 'Jun', amount: 6100 },
  ];
  const maxAmount = Math.max(...chartData.map(d => d.amount));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Earnings Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Income", value: data?.today, color: 'text-stone-800' },
          { label: 'Weekly Income', value: data?.weekly, color: 'text-stone-800' },
          { label: 'Monthly Income', value: data?.monthly, color: 'text-emerald-600' },
          { label: 'Lifetime Earnings', value: data?.lifetime, color: 'text-stone-800' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex flex-col justify-between card-hover animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{stat.label}</span>
            <span className={`text-3xl font-black mt-2 ${stat.color}`}>₹{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-lg font-bold text-stone-800 mb-6">Revenue Trend (6 Months)</h3>
        <div className="flex items-end gap-3 h-48">
          {chartData.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-xs font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition">₹{d.amount}</span>
              <div
                className="w-full bg-gradient-to-t from-primary to-primary-light rounded-xl transition-all duration-500 hover:from-primary-dark hover:to-primary cursor-pointer shadow-sm"
                style={{ height: `${(d.amount / maxAmount) * 100}%`, animationDelay: `${idx * 0.08}s` }}
              />
              <span className="text-xs font-bold text-stone-500">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Withdraw Panel */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-4">Request Withdrawal</h3>

          <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2">Withdraw Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={withdrawAmt}
                onChange={e => setWithdrawAmt(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2">Bank Account / UPI ID</label>
              <input
                type="text"
                placeholder="Account number or upi@id"
                value={bankAcc}
                onChange={e => setBankAcc(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm font-medium"
              />
            </div>
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-primary/20 btn-press">
              Submit Request
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-4">Transaction History</h3>
          <div className="space-y-3">
            {data?.transactions.map((tx, idx) => (
              <div key={idx} className="p-4 border border-stone-100 rounded-2xl flex justify-between items-center text-xs bg-stone-50/50 hover:bg-stone-50 transition">
                <div>
                  <p className="font-bold text-stone-800">Tx ID: {tx.id} <span className="text-stone-400 font-medium">(Order: {tx.orderId})</span></p>
                  <p className="text-stone-500 mt-1 font-medium">Paid by {tx.customer} on {tx.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-black text-emerald-600 block text-sm">+ ₹{tx.amount}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
