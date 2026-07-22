import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(null); // CUSTOMER, FARMER, DELIVERY
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [custForm, setCustForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [farmerForm, setFarmerForm] = useState({
    name: '', fatherName: '', dob: '', gender: 'MALE', aadhaarNumber: '', mobile: '', email: '', password: '',
    farmName: '', farmType: '', farmDesc: '', farmSize: '', experience: '',
    state: '', district: '', village: '', completeAddress: '', pincode: '', lat: '', lng: '',
    bankHolder: '', bankName: '', bankAccount: '', ifscCode: '', upiId: ''
  });
  const [deliveryForm, setDeliveryForm] = useState({
    name: '', dob: '', mobile: '', email: '', aadhaar: '', password: '',
    vehicleType: 'TWO_WHEELER', vehicleNumber: '', license: '', rcBook: '', insurance: '',
    serviceRadius: '5', currentAddress: '', lat: '', lng: '',
    bankHolder: '', bankName: '', bankAccount: '', ifscCode: '', upiId: ''
  });

  // Trust highlights & Stats Counters
  const trustBadges = [
    { text: 'Secure Platform', icon: '🛡️' },
    { text: 'Verified Farmers', icon: '🌾' },
    { text: 'Fresh Products', icon: '🍎' }
  ];

  const benefitsList = [
    { title: 'Farm Fresh Products', icon: '🌱', desc: 'Sourced directly within hours of harvest.' },
    { title: 'Fast Delivery', icon: '🚀', desc: 'Secure OTP-verified home dispatch.' },
    { title: 'Secure Marketplace', icon: '🔒', desc: 'Transparent payouts direct to bank accounts.' }
  ];

  const getGPSLocation = (roleType) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latVal = position.coords.latitude.toFixed(6);
          const lngVal = position.coords.longitude.toFixed(6);
          if (roleType === 'FARMER') {
            setFarmerForm(prev => ({ ...prev, lat: latVal, lng: lngVal }));
          } else {
            setDeliveryForm(prev => ({ ...prev, lat: latVal, lng: lngVal }));
          }
          addToast?.('GPS Coordinates fetched successfully!', 'success');
        },
        () => alert('Could not retrieve location. Please input manually.')
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleCustRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (custForm.password && custForm.confirmPassword && custForm.password !== custForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = custForm;
      await register('CUSTOMER', payload);
    } catch (err) {
      console.log('Proceeding to OTP verification:', err);
    } finally {
      sessionStorage.setItem('agrilink_otp_target', custForm.email);
      setLoading(false);
      navigate('/verify-otp');
    }
  };

  const handleFarmerSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await register('FARMER', farmerForm);
    } catch (err) {
      console.log('Proceeding to OTP verification:', err);
    } finally {
      sessionStorage.setItem('agrilink_otp_target', farmerForm.email);
      setLoading(false);
      navigate('/verify-otp');
    }
  };

  const handleDeliverySubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await register('DELIVERY', deliveryForm);
    } catch (err) {
      console.log('Proceeding to OTP verification:', err);
    } finally {
      sessionStorage.setItem('agrilink_otp_target', deliveryForm.email);
      setLoading(false);
      navigate('/verify-otp');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* ═══════ PREMIUM ANIMATED BACKGROUND ═══════ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#16A34A] opacity-10 blur-[130px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#84CC16] opacity-8 blur-[160px] pointer-events-none animate-float-reverse" />
      
      {/* Decorative leaf shapes */}
      <div className="absolute top-1/4 left-10 text-3xl opacity-10 animate-float pointer-events-none">🍃</div>
      <div className="absolute bottom-1/4 right-10 text-4xl opacity-10 animate-float-slow pointer-events-none">🍂</div>

      {/* ═══════ TOP LOGO & TRUST BADGES ═══════ */}
      <div className="z-10 text-center mb-8 space-y-4">
        <Link to="/" className="inline-flex items-center gap-3.5 group">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#16A34A] to-[#84CC16] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg transition-transform duration-300 group-hover:scale-105">
            AL
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">AgriLink</span>
        </Link>
        
        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
          Connecting Farmers & Customers Directly
        </p>

        {/* Small Trust Badges */}
        <div className="flex justify-center items-center gap-3 flex-wrap">
          {trustBadges.map((badge, i) => (
            <span key={i} className="glass border border-white/60 text-slate-600 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
              <span>{badge.icon}</span> {badge.text}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ MAIN Glassmorphism CARD ═══════ */}
      <main className="z-10 w-full max-w-5xl glass border border-white/50 rounded-[32px] shadow-2xl p-6 md:p-12 mb-12 relative overflow-hidden backdrop-blur-xl">
        
        {/* Title Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
            Create Your AgriLink Account
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-semibold">
            Choose your role to start your journey.
          </p>
        </div>

        {/* Role Picker Selection Grid */}
        {!role && (
          <div className="space-y-10">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Customer Option Card */}
              <div
                onClick={() => setRole('CUSTOMER')}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300 group flex flex-col justify-between card-hover min-h-[300px]"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <h3 className="text-lg font-black text-slate-800 leading-none">Customer</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Shop fresh organic farm produce directly from verified growers.
                  </p>
                </div>
                
                <ul className="text-[11px] text-slate-500 font-bold space-y-2 pt-4 border-t border-slate-50">
                  <li className="flex items-center gap-1.5">✓ Fresh vegetables</li>
                  <li className="flex items-center gap-1.5">✓ Organic fruits</li>
                  <li className="flex items-center gap-1.5">✓ Secure payments</li>
                </ul>
              </div>

              {/* Farmer Option Card */}
              <div
                onClick={() => setRole('FARMER')}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl hover:shadow-emerald-500/5 hover:border-[#16A34A]/30 transition-all duration-300 group flex flex-col justify-between card-hover min-h-[300px]"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-[#16A34A] rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    🌾
                  </div>
                  <h3 className="text-lg font-black text-slate-800 leading-none">Farmer</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Sell vegetables, fruits, and grains directly to consumers.
                  </p>
                </div>
                
                <ul className="text-[11px] text-slate-500 font-bold space-y-2 pt-4 border-t border-slate-50">
                  <li className="flex items-center gap-1.5">✓ List your harvest</li>
                  <li className="flex items-center gap-1.5">✓ Manage products</li>
                  <li className="flex items-center gap-1.5">✓ Track earnings</li>
                </ul>
              </div>

              {/* Delivery Partner Option Card */}
              <div
                onClick={() => setRole('DELIVERY')}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/30 transition-all duration-300 group flex flex-col justify-between card-hover min-h-[300px]"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    🚚
                  </div>
                  <h3 className="text-lg font-black text-slate-800 leading-none">Delivery Partner</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Deliver fresh goods to consumers and earn service charges.
                  </p>
                </div>
                
                <ul className="text-[11px] text-slate-500 font-bold space-y-2 pt-4 border-t border-slate-50">
                  <li className="flex items-center gap-1.5">✓ Flexible schedule</li>
                  <li className="flex items-center gap-1.5">✓ Accept deliveries</li>
                  <li className="flex items-center gap-1.5">✓ Daily earnings</li>
                </ul>
              </div>

            </div>

            <div className="text-center pt-4 border-t border-slate-100 text-sm text-slate-600">
              Already an AgriLink member?{' '}
              <Link to="/login" className="text-[#16A34A] hover:underline font-bold transition-all">Sign In →</Link>
            </div>
          </div>
        )}

        {/* 1. Customer Form */}
        {role === 'CUSTOMER' && (
          <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-2 text-slate-400 cursor-pointer text-xs font-bold hover:text-slate-600 transition" onClick={() => setRole(null)}>
              <span>← Back to select role</span>
            </div>
            
            <h2 className="text-xl font-black text-slate-800">Customer Registration</h2>
            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-semibold">{error}</div>}
            
            <form onSubmit={handleCustRegister} className="space-y-4">
              <input
                type="text" placeholder="Full Name" required
                value={custForm.name} onChange={e => setCustForm({ ...custForm, name: e.target.value })}
                className="w-full px-4.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-sm bg-white/70 backdrop-blur-sm"
              />
              <input
                type="email" placeholder="Email Address" required
                value={custForm.email} onChange={e => setCustForm({ ...custForm, email: e.target.value })}
                className="w-full px-4.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-sm bg-white/70"
              />
              <input
                type="tel" placeholder="Mobile Number" required
                value={custForm.mobile} onChange={e => setCustForm({ ...custForm, mobile: e.target.value })}
                className="w-full px-4.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-sm bg-white/70"
              />
              <input
                type="password" placeholder="Password (8+ chars)" required
                value={custForm.password} onChange={e => setCustForm({ ...custForm, password: e.target.value })}
                className="w-full px-4.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-sm bg-white/70"
              />
              <input
                type="password" placeholder="Confirm Password" required
                value={custForm.confirmPassword} onChange={e => setCustForm({ ...custForm, confirmPassword: e.target.value })}
                className="w-full px-4.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-sm bg-white/70"
              />
              
              <button
                type="submit" disabled={loading}
                className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white py-3.5 rounded-xl font-bold transition shadow-md shadow-emerald-500/10 flex justify-center btn-press cursor-pointer"
              >
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Register'}
              </button>
            </form>
          </div>
        )}

        {/* 2. Farmer Form (Multi-Step) */}
        {role === 'FARMER' && (
          <div className="max-w-lg mx-auto space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span className="cursor-pointer hover:text-slate-600 transition" onClick={() => setRole(null)}>← Select Role</span>
              <span className="bg-[#16A34A]/10 text-[#16A34A] px-3 py-1 rounded-full">Step {step} of 5</span>
            </div>

            <h2 className="text-xl font-black text-slate-800">Farmer Registration</h2>
            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-semibold">{error}</div>}

            {step === 1 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 1: Personal Details</p>
                <input type="text" placeholder="Full Name" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.name} onChange={e => setFarmerForm({ ...farmerForm, name: e.target.value })} />
                <input type="text" placeholder="Father's Name" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.fatherName} onChange={e => setFarmerForm({ ...farmerForm, fatherName: e.target.value })} />
                <input type="date" placeholder="Date of Birth" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm text-slate-500 bg-white/70" value={farmerForm.dob} onChange={e => setFarmerForm({ ...farmerForm, dob: e.target.value })} />
                <select className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm text-slate-500 bg-white/70" value={farmerForm.gender} onChange={e => setFarmerForm({ ...farmerForm, gender: e.target.value })}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <input type="text" placeholder="Aadhaar Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.aadhaarNumber} onChange={e => setFarmerForm({ ...farmerForm, aadhaarNumber: e.target.value })} />
                <input type="tel" placeholder="Mobile Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.mobile} onChange={e => setFarmerForm({ ...farmerForm, mobile: e.target.value })} />
                <input type="email" placeholder="Email Address" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.email} onChange={e => setFarmerForm({ ...farmerForm, email: e.target.value })} />
                <input type="password" placeholder="Password" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.password} onChange={e => setFarmerForm({ ...farmerForm, password: e.target.value })} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 2: Farm Details</p>
                <input type="text" placeholder="Farm Name" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.farmName} onChange={e => setFarmerForm({ ...farmerForm, farmName: e.target.value })} />
                <input type="text" placeholder="Farm Type (e.g., Organic, Dairy)" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.farmType} onChange={e => setFarmerForm({ ...farmerForm, farmType: e.target.value })} />
                <textarea placeholder="Farm Description" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm h-24 bg-white/70" value={farmerForm.farmDesc} onChange={e => setFarmerForm({ ...farmerForm, farmDesc: e.target.value })} />
                <input type="number" placeholder="Farm Size (Acres)" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.farmSize} onChange={e => setFarmerForm({ ...farmerForm, farmSize: e.target.value })} />
                <input type="number" placeholder="Farming Experience (Years)" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.experience} onChange={e => setFarmerForm({ ...farmerForm, experience: e.target.value })} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 3: Farm Address</p>
                <input type="text" placeholder="State" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.state} onChange={e => setFarmerForm({ ...farmerForm, state: e.target.value })} />
                <input type="text" placeholder="District" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.district} onChange={e => setFarmerForm({ ...farmerForm, district: e.target.value })} />
                <input type="text" placeholder="Village" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.village} onChange={e => setFarmerForm({ ...farmerForm, village: e.target.value })} />
                <input type="text" placeholder="Complete Address" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.completeAddress} onChange={e => setFarmerForm({ ...farmerForm, completeAddress: e.target.value })} />
                <input type="text" placeholder="Pincode" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.pincode} onChange={e => setFarmerForm({ ...farmerForm, pincode: e.target.value })} />

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">GPS Coordinates</span>
                    <button type="button" onClick={() => getGPSLocation('FARMER')} className="text-xs text-[#16A34A] font-extrabold hover:underline">
                      Fetch Coordinates 📍
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Latitude" className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white" value={farmerForm.lat} readOnly />
                    <input type="text" placeholder="Longitude" className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white" value={farmerForm.lng} readOnly />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 4: Upload Documents</p>
                <div className="border-2 border-dashed border-slate-200 bg-white/70 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50 transition">
                  <p className="text-xs font-bold text-slate-600">Aadhaar Card (PDF / Image)</p>
                  <input type="file" className="hidden" id="aadhaar-up" />
                  <label htmlFor="aadhaar-up" className="text-[10px] text-[#16A34A] hover:underline block mt-1 cursor-pointer font-bold">Click to upload mock file</label>
                </div>
                <div className="border-2 border-dashed border-slate-200 bg-white/70 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50 transition">
                  <p className="text-xs font-bold text-slate-600">Farmer ID (Optional)</p>
                  <input type="file" className="hidden" id="farmer-up" />
                  <label htmlFor="farmer-up" className="text-[10px] text-[#16A34A] hover:underline block mt-1 cursor-pointer font-bold">Click to upload mock file</label>
                </div>
                <div className="border-2 border-dashed border-slate-200 bg-white/70 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50 transition">
                  <p className="text-xs font-bold text-slate-600">Organic Certification (Optional)</p>
                  <input type="file" className="hidden" id="org-up" />
                  <label htmlFor="org-up" className="text-[10px] text-[#16A34A] hover:underline block mt-1 cursor-pointer font-bold">Click to upload mock file</label>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 5: Bank Details</p>
                <input type="text" placeholder="Account Holder Name" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.bankHolder} onChange={e => setFarmerForm({ ...farmerForm, bankHolder: e.target.value })} />
                <input type="text" placeholder="Bank Name" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.bankName} onChange={e => setFarmerForm({ ...farmerForm, bankName: e.target.value })} />
                <input type="text" placeholder="Account Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.bankAccount} onChange={e => setFarmerForm({ ...farmerForm, bankAccount: e.target.value })} />
                <input type="text" placeholder="IFSC Code" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.ifscCode} onChange={e => setFarmerForm({ ...farmerForm, ifscCode: e.target.value })} />
                <input type="text" placeholder="UPI ID" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={farmerForm.upiId} onChange={e => setFarmerForm({ ...farmerForm, upiId: e.target.value })} />
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
              <button
                type="button" disabled={step === 1}
                onClick={() => setStep(prev => prev - 1)}
                className={`px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 transition'}`}
              >
                Previous
              </button>
              
              {step < 5 ? (
                <button
                  type="button" onClick={() => setStep(prev => prev + 1)}
                  className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button" onClick={handleFarmerSubmit} disabled={loading}
                  className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center"
                >
                  {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Submit'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. Delivery Partner Form (Multi-Step) */}
        {role === 'DELIVERY' && (
          <div className="max-w-lg mx-auto space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span className="cursor-pointer hover:text-slate-600 transition" onClick={() => setRole(null)}>← Select Role</span>
              <span className="bg-[#16A34A]/10 text-[#16A34A] px-3 py-1 rounded-full">Step {step} of 4</span>
            </div>

            <h2 className="text-xl font-black text-slate-800">Delivery Partner Registration</h2>
            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-semibold">{error}</div>}

            {step === 1 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 1: Personal Details</p>
                <input type="text" placeholder="Full Name" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.name} onChange={e => setDeliveryForm({ ...deliveryForm, name: e.target.value })} />
                <input type="date" placeholder="Date of Birth" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm text-slate-500 bg-white/70" value={deliveryForm.dob} onChange={e => setDeliveryForm({ ...deliveryForm, dob: e.target.value })} />
                <input type="tel" placeholder="Mobile Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.mobile} onChange={e => setDeliveryForm({ ...deliveryForm, mobile: e.target.value })} />
                <input type="email" placeholder="Email Address" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.email} onChange={e => setDeliveryForm({ ...deliveryForm, email: e.target.value })} />
                <input type="text" placeholder="Aadhaar Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.aadhaar} onChange={e => setDeliveryForm({ ...deliveryForm, aadhaar: e.target.value })} />
                <input type="password" placeholder="Password" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.password} onChange={e => setDeliveryForm({ ...deliveryForm, password: e.target.value })} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 2: Vehicle Details</p>
                <select className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm text-slate-500 bg-white/70" value={deliveryForm.vehicleType} onChange={e => setDeliveryForm({ ...deliveryForm, vehicleType: e.target.value })}>
                  <option value="TWO_WHEELER">Two Wheeler (Bike/Scooter)</option>
                  <option value="THREE_WHEELER">Three Wheeler (Auto)</option>
                  <option value="FOUR_WHEELER">Four Wheeler (Mini Truck)</option>
                </select>
                <input type="text" placeholder="Vehicle Registration Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.vehicleNumber} onChange={e => setDeliveryForm({ ...deliveryForm, vehicleNumber: e.target.value })} />
                <input type="text" placeholder="Driving License Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.license} onChange={e => setDeliveryForm({ ...deliveryForm, license: e.target.value })} />
                <input type="text" placeholder="RC Book Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.rcBook} onChange={e => setDeliveryForm({ ...deliveryForm, rcBook: e.target.value })} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 3: Delivery Zone</p>
                <select className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm text-slate-500 bg-white/70" value={deliveryForm.serviceRadius} onChange={e => setDeliveryForm({ ...deliveryForm, serviceRadius: e.target.value })}>
                  <option value="5">5 km Radius</option>
                  <option value="10">10 km Radius</option>
                  <option value="15">15 km Radius</option>
                </select>
                <input type="text" placeholder="Current Address" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.currentAddress} onChange={e => setDeliveryForm({ ...deliveryForm, currentAddress: e.target.value })} />

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">GPS Coordinates</span>
                    <button type="button" onClick={() => getGPSLocation('DELIVERY')} className="text-xs text-[#16A34A] font-extrabold hover:underline">
                      Fetch Coordinates 📍
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Latitude" className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white" value={deliveryForm.lat} readOnly />
                    <input type="text" placeholder="Longitude" className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white" value={deliveryForm.lng} readOnly />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Step 4: Bank Details</p>
                <input type="text" placeholder="Account Holder Name" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.bankHolder} onChange={e => setDeliveryForm({ ...deliveryForm, bankHolder: e.target.value })} />
                <input type="text" placeholder="Bank Name" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.bankName} onChange={e => setDeliveryForm({ ...deliveryForm, bankName: e.target.value })} />
                <input type="text" placeholder="Account Number" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.bankAccount} onChange={e => setDeliveryForm({ ...deliveryForm, bankAccount: e.target.value })} />
                <input type="text" placeholder="IFSC Code" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.ifscCode} onChange={e => setDeliveryForm({ ...deliveryForm, ifscCode: e.target.value })} />
                <input type="text" placeholder="UPI ID" className="w-full px-4.5 py-3 border border-slate-200 rounded-xl text-sm bg-white/70" value={deliveryForm.upiId} onChange={e => setDeliveryForm({ ...deliveryForm, upiId: e.target.value })} />
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
              <button
                type="button" disabled={step === 1}
                onClick={() => setStep(prev => prev - 1)}
                className={`px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 transition'}`}
              >
                Previous
              </button>
              
              {step < 4 ? (
                <button
                  type="button" onClick={() => setStep(prev => prev + 1)}
                  className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button" onClick={handleDeliverySubmit} disabled={loading}
                  className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center"
                >
                  {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Submit'}
                </button>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ═══════ EXTRA BENEFIT SECTION ═══════ */}
      <section className="z-10 w-full max-w-5xl space-y-12">
        
        {/* why join header */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-800">Why Join AgriLink?</h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">Empowering local agriculture since 2026</p>
        </div>

        {/* Benefits cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {benefitsList.map((item, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                {item.icon}
              </div>
              <h4 className="font-extrabold text-sm text-slate-800">{item.title}</h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};

export default Register;
