import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import deliveryService from '../../services/deliveryService';
import { SkeletonDashboard } from '../../components/common/SkeletonCard';

/* ─── Animated Counter Hook ─── */
const useAnimatedCounter = (targetValue, duration = 1200) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (targetValue === undefined || targetValue === null) return;
    const target = typeof targetValue === 'string' ? parseInt(targetValue.replace(/[^0-9]/g, ''), 10) : targetValue;
    if (isNaN(target)) { setCount(targetValue); return; }
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [targetValue, duration]);

  return count;
};

const StatCard = ({ label, value, icon, color, prefix = '', delay }) => {
  const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10);
  const animatedValue = useAnimatedCounter(isNaN(numericValue) ? 0 : numericValue);
  return (
    <div className={`bg-white rounded-2xl p-5 border border-stone-100 shadow-sm card-hover flex flex-col justify-between animate-fadeIn`} style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center text-base`}>{icon}</div>
      </div>
      <span className="text-2xl font-black text-stone-800">{prefix}{animatedValue}</span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new_requests');
  const [earnings, setEarnings] = useState(null);
  
  // Categorized order states
  const [newRequests, setNewRequests] = useState([]);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [outForDelivery, setOutForDelivery] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);

  // OTP inputs and messaging state map by orderId
  const [enteredOtps, setEnteredOtps] = useState({});
  const [otpSentStates, setOtpSentStates] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});

  const showMessage = (orderId, text) => {
    setMessages(prev => ({ ...prev, [orderId]: text }));
    setErrors(prev => ({ ...prev, [orderId]: null }));
  };

  const showError = (orderId, text) => {
    setErrors(prev => ({ ...prev, [orderId]: text }));
    setMessages(prev => ({ ...prev, [orderId]: null }));
  };

  const loadData = async () => {
    try {
      // Fetch available unassigned orders
      const available = await deliveryService.getAssignedOrders();
      // Fetch delivery partner's own assignments
      const mine = await deliveryService.getMyDeliveries();
      const earn = await deliveryService.getEarnings();
      setEarnings(earn);

      // Filter & Categorize
      setNewRequests((available || []).filter(o => o.status === 'FARMER_ACCEPTED' && !o.deliveryPartnerId));
      
      setAcceptedDeliveries((mine || []).filter(o => o.status === 'DELIVERY_ACCEPTED' || o.status === 'ACCEPTED'));
      setPickups((mine || []).filter(o => o.status === 'PICKED_UP'));
      setOutForDelivery((mine || []).filter(o => o.status === 'IN_TRANSIT' || o.status === 'OUT_FOR_DELIVERY'));
      setCompletedDeliveries((mine || []).filter(o => o.status === 'DELIVERED'));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      await deliveryService.acceptDelivery(orderId);
      showMessage(orderId, 'Delivery accepted! Moving to Accepted Tab.');
      setTimeout(() => {
        loadData();
        setActiveTab('accepted');
      }, 1000);
    } catch (err) {
      showError(orderId, 'Failed to accept delivery.');
    }
  };

  const handleReject = async (orderId) => {
    const reason = window.prompt('Select Rejection Reason (Vehicle Breakdown / Health Issue / Too Far / Emergency):');
    if (!reason) return;
    try {
      await deliveryService.rejectDelivery(orderId, reason);
      showMessage(orderId, 'Reassigned successfully.');
      setTimeout(() => {
        loadData();
      }, 1000);
    } catch (err) {
      showError(orderId, 'Failed to reject assignment.');
    }
  };

  const handleGenerateOtp = async (orderId) => {
    try {
      await deliveryService.generatePickupOtp(orderId);
      setOtpSentStates(prev => ({ ...prev, [orderId]: true }));
      showMessage(orderId, 'Pickup OTP sent to Farmer.');
    } catch (err) {
      showError(orderId, err.message || 'Failed to generate OTP.');
    }
  };

  const handleVerifyOtp = async (e, orderId) => {
    e.preventDefault();
    const otp = enteredOtps[orderId] || '';
    try {
      await deliveryService.verifyPickupOtp(orderId, otp);
      showMessage(orderId, 'OTP verified! Package loaded successfully.');
      setTimeout(() => {
        loadData();
        setActiveTab('pickups');
      }, 1000);
    } catch (err) {
      showError(orderId, err.message || 'Verification failed.');
    }
  };

  const handleStartTransit = async (orderId) => {
    try {
      await deliveryService.updateDeliveryStatus(orderId, 'IN_TRANSIT');
      showMessage(orderId, 'In Transit status activated.');
      setTimeout(() => {
        loadData();
        setActiveTab('out_for_delivery');
      }, 1000);
    } catch (err) {
      showError(orderId, 'Failed to start transit.');
    }
  };

  const handleMarkOutForDelivery = async (orderId) => {
    try {
      await deliveryService.updateDeliveryStatus(orderId, 'OUT_FOR_DELIVERY');
      showMessage(orderId, 'Status updated to Out For Delivery.');
      setTimeout(() => {
        loadData();
      }, 1000);
    } catch (err) {
      showError(orderId, 'Failed to update stage.');
    }
  };

  const handleCompleteDelivery = async (e, orderId) => {
    e.preventDefault();
    const method = paymentMethods[orderId] || 'COD';
    try {
      await deliveryService.confirmPayment(orderId, method);
      showMessage(orderId, 'Delivery marked as completed successfully!');
      setTimeout(() => {
        loadData();
        setActiveTab('completed');
      }, 1200);
    } catch (err) {
      showError(orderId, 'Failed to complete delivery.');
    }
  };

  const openNavigation = (address) => {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  if (loading) return <SkeletonDashboard />;

  const tabs = [
    { id: 'new_requests', label: 'New Requests', count: newRequests.length, icon: '📥' },
    { id: 'accepted', label: 'Accepted', count: acceptedDeliveries.length, icon: '🤝' },
    { id: 'pickups', label: 'Pickups', count: pickups.length, icon: '📦' },
    { id: 'out_for_delivery', label: 'Out for Delivery', count: outForDelivery.length, icon: '🚚' },
    { id: 'completed', label: 'Completed', count: completedDeliveries.length, icon: '✅' },
  ];

  const getActiveList = () => {
    switch (activeTab) {
      case 'new_requests': return newRequests;
      case 'accepted': return acceptedDeliveries;
      case 'pickups': return pickups;
      case 'out_for_delivery': return outForDelivery;
      case 'completed': return completedDeliveries;
      default: return [];
    }
  };

  const activeOrders = getActiveList();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#ffffff_0%,transparent_50%)]" />
        <div className="relative z-10 space-y-2 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full relative pulse-dot" />
              Active Partner
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Welcome back, {user?.name}!</h1>
            <p className="text-white/80 font-medium text-xs">Manage and complete your customer deliveries today.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 text-right mt-3 md:mt-0">
            <p className="text-[10px] font-bold text-amber-200 uppercase tracking-widest">Today's Earnings</p>
            <p className="text-2xl font-black">₹{earnings?.today || 0}</p>
          </div>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Available Requests" value={newRequests.length} icon="📥" color="bg-orange-50 text-orange-650" delay={0.05} />
        <StatCard label="Active Jobs" value={acceptedDeliveries.length + pickups.length + outForDelivery.length} icon="⏳" color="bg-amber-50 text-amber-600" delay={0.1} />
        <StatCard label="Delivered Total" value={completedDeliveries.length} icon="✅" color="bg-emerald-50 text-emerald-600" delay={0.15} />
        <StatCard label="Lifetime Balance" value={earnings?.lifetime || 0} prefix="₹" icon="💰" color="bg-blue-50 text-blue-650" delay={0.2} />
      </div>

      {/* Tabs Control */}
      <div className="bg-white border border-stone-150 rounded-2xl p-1.5 shadow-sm flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 text-xs font-bold ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-stone-500 hover:bg-stone-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Order List / Tab Details */}
      <div className="space-y-6">
        {activeOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-150 p-8 text-stone-400 font-medium">
            <div className="text-3xl mb-2">📦</div>
            <p>No orders in the "{tabs.find(t => t.id === activeTab)?.label}" status.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {activeOrders.map((o) => {
              const orderId = o.id;
              const itemsText = o.items ? o.items.map(item => item.name).join(', ') : 'N/A';
              const totalWeight = o.items ? o.items.reduce((sum, item) => sum + item.quantity, 0) + ' kg' : 'N/A';

              return (
                <div key={orderId} className="bg-white border border-stone-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm font-black text-stone-850">Order ID: #{orderId}</span>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-55 bg-amber-50 text-amber-700 uppercase">{o.status}</span>
                    </div>

                    {/* Notification Alerts */}
                    {messages[orderId] && <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl text-center">{messages[orderId]}</div>}
                    {errors[orderId] && <div className="p-3 bg-red-50 text-red-650 text-xs font-bold rounded-xl text-center">{errors[orderId]}</div>}

                    {/* Customer & Farmer Details */}
                    <div className="grid gap-2.5 text-xs">
                      <div className="bg-stone-50/50 p-3 rounded-2xl border border-stone-100">
                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Farmer Pickup</span>
                        <p className="font-extrabold text-stone-800">{o.farmerName}</p>
                        <p className="text-stone-500 mt-0.5">{o.farmerAddress || 'Address details unlisted'}</p>
                        {o.farmerPhone && <p className="text-[10px] text-amber-600 font-bold mt-1">📞 {o.farmerPhone}</p>}
                      </div>

                      <div className="bg-stone-50/50 p-3 rounded-2xl border border-stone-100">
                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Customer Delivery</span>
                        <p className="font-extrabold text-stone-800">{o.customerName}</p>
                        <p className="text-stone-500 mt-0.5">{o.address || o.deliveryAddress}</p>
                        {o.customerPhone && <p className="text-[10px] text-amber-600 font-bold mt-1">📞 {o.customerPhone}</p>}
                      </div>

                      <div className="bg-stone-50/50 p-3 rounded-2xl border border-stone-100 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Package Details</span>
                          <span className="font-extrabold text-stone-800">{itemsText}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] text-stone-400 font-bold">Total Weight</span>
                          <span className="font-black text-amber-600">{totalWeight}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="grid grid-cols-3 gap-2 text-center py-2.5 border-t border-b border-stone-100 text-[10px] font-bold text-stone-500">
                      <div>
                        <span className="block text-stone-400">Total Amt</span>
                        <span className="text-sm font-black text-stone-850">₹{o.total}</span>
                      </div>
                      <div>
                        <span className="block text-stone-400">Earnings</span>
                        <span className="text-sm font-black text-emerald-600">₹40</span>
                      </div>
                      <div>
                        <span className="block text-stone-400">Method</span>
                        <span className="text-sm font-black text-blue-600">{o.paymentMethod || 'COD'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Flow Action Controls */}
                  <div className="pt-2">
                    {activeTab === 'new_requests' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(orderId)}
                          className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-650 text-white text-xs font-bold rounded-xl transition shadow-sm"
                        >
                          Accept Delivery
                        </button>
                        <button
                          onClick={() => handleReject(orderId)}
                          className="py-2.5 px-4 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-bold rounded-xl border transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {activeTab === 'accepted' && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openNavigation(o.farmerAddress)}
                            className="flex-1 py-2 bg-stone-50 border hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                          >
                            📍 Navigate to Farmer
                          </button>
                          {!otpSentStates[orderId] && (
                            <button
                              onClick={() => handleGenerateOtp(orderId)}
                              className="flex-1 py-2 bg-amber-500 hover:bg-amber-650 text-white text-xs font-bold rounded-xl transition"
                            >
                              Generate Pickup OTP
                            </button>
                          )}
                        </div>

                        {otpSentStates[orderId] && (
                          <form onSubmit={(e) => handleVerifyOtp(e, orderId)} className="p-3 border border-dashed rounded-2xl bg-amber-50/10 space-y-2">
                            <label className="block text-[10px] text-stone-500 font-bold text-center">Enter Farmer Verification OTP</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="OTP (Mock: 123456)"
                                maxLength="6"
                                value={enteredOtps[orderId] || ''}
                                onChange={(e) => setEnteredOtps({ ...enteredOtps, [orderId]: e.target.value.replace(/[^0-9]/g, '') })}
                                className="flex-1 text-center py-1.5 px-3 rounded-lg border text-sm font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-amber-500"
                                required
                              />
                              <button
                                type="submit"
                                className="px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition"
                              >
                                Verify
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleGenerateOtp(orderId)}
                              className="w-full text-center text-[9px] text-stone-400 hover:underline"
                            >
                              Resend OTP to Farmer
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {activeTab === 'pickups' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => openNavigation(o.address || o.deliveryAddress)}
                          className="w-full py-2 bg-stone-50 border hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl transition mb-1"
                        >
                          📍 Navigate to Customer
                        </button>
                        <button
                          onClick={() => handleStartTransit(orderId)}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-650 text-white text-xs font-bold rounded-xl transition shadow-sm"
                        >
                          Start Transit (Mark In Transit)
                        </button>
                      </div>
                    )}

                    {activeTab === 'out_for_delivery' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => openNavigation(o.address || o.deliveryAddress)}
                          className="w-full py-2 bg-stone-50 border hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl transition"
                        >
                          📍 View Customer Route
                        </button>

                        {o.status === 'IN_TRANSIT' ? (
                          <button
                            onClick={() => handleMarkOutForDelivery(orderId)}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-655 text-white text-xs font-bold rounded-xl transition"
                          >
                            Mark Out for Delivery
                          </button>
                        ) : (
                          <form onSubmit={(e) => handleCompleteDelivery(e, orderId)} className="p-3 border border-dashed rounded-2xl bg-emerald-50/15 space-y-2">
                            <label className="block text-[10px] text-stone-500 font-bold">Collect Payment Method</label>
                            <div className="flex gap-2">
                              <select
                                value={paymentMethods[orderId] || 'COD'}
                                onChange={(e) => setPaymentMethods({ ...paymentMethods, [orderId]: e.target.value })}
                                className="flex-1 text-xs font-bold px-2 py-1.5 border rounded-lg bg-white"
                              >
                                <option value="COD">Cash on Delivery (COD)</option>
                                <option value="UPI">UPI / Scan QR</option>
                                <option value="CARD">Card Payment</option>
                              </select>
                              <button
                                type="submit"
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-750 text-white text-xs font-bold rounded-lg transition"
                              >
                                Complete Delivery
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}

                    {activeTab === 'completed' && (
                      <div className="p-2.5 bg-emerald-50/30 border border-emerald-100 text-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                        <span>🎉</span> Delivered and Settlement Handed Over
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
