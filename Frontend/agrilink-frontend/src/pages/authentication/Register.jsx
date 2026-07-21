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
    if (custForm.password !== custForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register('CUSTOMER', custForm);
      sessionStorage.setItem('agrilink_otp_target', custForm.email);
      navigate('/verify-otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFarmerSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await register('FARMER', farmerForm);
      sessionStorage.setItem('agrilink_otp_target', farmerForm.email);
      navigate('/verify-otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverySubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await register('DELIVERY', deliveryForm);
      sessionStorage.setItem('agrilink_otp_target', deliveryForm.email);
      navigate('/verify-otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-background flex flex-col items-center justify-center p-4">
      {/* Role Picker Screen */}
      {!role && (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-gray-100 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h2>
          <p className="text-gray-500 mb-8">Select your role to register with AgriLink</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              onClick={() => setRole('CUSTOMER')}
              className="p-6 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition duration-200 group flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Customer</h3>
              <p className="text-xs text-gray-500 mt-2 text-center">Shop fresh organic farm produce directly from verified farmers.</p>
            </div>

            <div
              onClick={() => setRole('FARMER')}
              className="p-6 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition duration-200 group flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Farmer</h3>
              <p className="text-xs text-gray-500 mt-2 text-center">Sell vegetables, fruits, and grains directly to consumers.</p>
            </div>

            <div
              onClick={() => setRole('DELIVERY')}
              className="p-6 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition duration-200 group flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delivery Partner</h3>
              <p className="text-xs text-gray-500 mt-2 text-center">Deliver fresh goods to consumers and earn service charges.</p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">Login here</Link>
          </div>
        </div>
      )}

      {/* 1. Customer Form */}
      {role === 'CUSTOMER' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
          <div className="flex items-center space-x-2 text-gray-500 cursor-pointer mb-6 text-sm" onClick={() => setRole(null)}>
            <span>← Choose different role</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Registration</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}
          <form onSubmit={handleCustRegister} className="space-y-4">
            <input
              type="text" placeholder="Full Name" required
              value={custForm.name} onChange={e => setCustForm({ ...custForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              type="email" placeholder="Email Address" required
              value={custForm.email} onChange={e => setCustForm({ ...custForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              type="tel" placeholder="Mobile Number" required
              value={custForm.mobile} onChange={e => setCustForm({ ...custForm, mobile: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              type="password" placeholder="Password (8+ chars)" required
              value={custForm.password} onChange={e => setCustForm({ ...custForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              type="password" placeholder="Confirm Password" required
              value={custForm.confirmPassword} onChange={e => setCustForm({ ...custForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold transition hover:bg-primary-dark flex justify-center"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Register'}
            </button>
          </form>
        </div>
      )}

      {/* 2. Farmer Form (Multi-Step) */}
      {role === 'FARMER' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 cursor-pointer text-sm" onClick={() => setRole(null)}>← Back</span>
            <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">Step {step} of 5</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6">Farmer Registration</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}

          {/* Steps Implementation */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 1: Personal Details</p>
              <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.name} onChange={e => setFarmerForm({ ...farmerForm, name: e.target.value })} />
              <input type="text" placeholder="Father's Name" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.fatherName} onChange={e => setFarmerForm({ ...farmerForm, fatherName: e.target.value })} />
              <input type="date" placeholder="Date of Birth" className="w-full px-4 py-3 border rounded-xl text-sm text-gray-500" value={farmerForm.dob} onChange={e => setFarmerForm({ ...farmerForm, dob: e.target.value })} />
              <select className="w-full px-4 py-3 border rounded-xl text-sm text-gray-500" value={farmerForm.gender} onChange={e => setFarmerForm({ ...farmerForm, gender: e.target.value })}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <input type="text" placeholder="Aadhaar Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.aadhaarNumber} onChange={e => setFarmerForm({ ...farmerForm, aadhaarNumber: e.target.value })} />
              <input type="tel" placeholder="Mobile Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.mobile} onChange={e => setFarmerForm({ ...farmerForm, mobile: e.target.value })} />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.email} onChange={e => setFarmerForm({ ...farmerForm, email: e.target.value })} />
              <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.password} onChange={e => setFarmerForm({ ...farmerForm, password: e.target.value })} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 2: Farm Details</p>
              <input type="text" placeholder="Farm Name" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.farmName} onChange={e => setFarmerForm({ ...farmerForm, farmName: e.target.value })} />
              <input type="text" placeholder="Farm Type (e.g., Organic, Dairy)" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.farmType} onChange={e => setFarmerForm({ ...farmerForm, farmType: e.target.value })} />
              <textarea placeholder="Farm Description" className="w-full px-4 py-3 border rounded-xl text-sm h-24" value={farmerForm.farmDesc} onChange={e => setFarmerForm({ ...farmerForm, farmDesc: e.target.value })} />
              <input type="number" placeholder="Farm Size (Acres)" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.farmSize} onChange={e => setFarmerForm({ ...farmerForm, farmSize: e.target.value })} />
              <input type="number" placeholder="Farming Experience (Years)" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.experience} onChange={e => setFarmerForm({ ...farmerForm, experience: e.target.value })} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 3: Farm Address</p>
              <input type="text" placeholder="State" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.state} onChange={e => setFarmerForm({ ...farmerForm, state: e.target.value })} />
              <input type="text" placeholder="District" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.district} onChange={e => setFarmerForm({ ...farmerForm, district: e.target.value })} />
              <input type="text" placeholder="Village" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.village} onChange={e => setFarmerForm({ ...farmerForm, village: e.target.value })} />
              <input type="text" placeholder="Complete Address" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.completeAddress} onChange={e => setFarmerForm({ ...farmerForm, completeAddress: e.target.value })} />
              <input type="text" placeholder="Pincode" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.pincode} onChange={e => setFarmerForm({ ...farmerForm, pincode: e.target.value })} />

              <div className="p-3 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-semibold">GPS Coordinates</span>
                  <button type="button" onClick={() => getGPSLocation('FARMER')} className="text-xs text-primary font-bold hover:underline">
                    Get Current GPS
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Latitude" className="px-3 py-2 border rounded-lg text-xs" value={farmerForm.lat} readOnly />
                  <input type="text" placeholder="Longitude" className="px-3 py-2 border rounded-lg text-xs" value={farmerForm.lng} readOnly />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 4: Upload Documents</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50">
                <p className="text-xs font-semibold text-gray-600">Aadhaar Card (PDF / Image)</p>
                <input type="file" className="hidden" id="aadhaar-up" />
                <label htmlFor="aadhaar-up" className="text-[10px] text-primary hover:underline block mt-1 cursor-pointer">Click to upload mock file</label>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50">
                <p className="text-xs font-semibold text-gray-600">Farmer ID (Optional)</p>
                <input type="file" className="hidden" id="farmer-up" />
                <label htmlFor="farmer-up" className="text-[10px] text-primary hover:underline block mt-1 cursor-pointer">Click to upload mock file</label>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50">
                <p className="text-xs font-semibold text-gray-600">Organic Certification (Optional)</p>
                <input type="file" className="hidden" id="org-up" />
                <label htmlFor="org-up" className="text-[10px] text-primary hover:underline block mt-1 cursor-pointer">Click to upload mock file</label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 5: Bank Details</p>
              <input type="text" placeholder="Account Holder Name" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.bankHolder} onChange={e => setFarmerForm({ ...farmerForm, bankHolder: e.target.value })} />
              <input type="text" placeholder="Bank Name" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.bankName} onChange={e => setFarmerForm({ ...farmerForm, bankName: e.target.value })} />
              <input type="text" placeholder="Account Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.bankAccount} onChange={e => setFarmerForm({ ...farmerForm, bankAccount: e.target.value })} />
              <input type="text" placeholder="IFSC Code" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.ifscCode} onChange={e => setFarmerForm({ ...farmerForm, ifscCode: e.target.value })} />
              <input type="text" placeholder="UPI ID" className="w-full px-4 py-3 border rounded-xl text-sm" value={farmerForm.upiId} onChange={e => setFarmerForm({ ...farmerForm, upiId: e.target.value })} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button" disabled={step === 1}
              onClick={() => setStep(prev => prev - 1)}
              className={`px-4 py-2 border rounded-xl text-sm font-semibold ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>
            {step < 5 ? (
              <button
                type="button" onClick={() => setStep(prev => prev + 1)}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark"
              >
                Next
              </button>
            ) : (
              <button
                type="button" onClick={handleFarmerSubmit} disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark flex items-center justify-center"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Submit'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Delivery Partner Form (Multi-Step) */}
      {role === 'DELIVERY' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 cursor-pointer text-sm" onClick={() => setRole(null)}>← Back</span>
            <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">Step {step} of 4</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Partner Registration</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 1: Personal Details</p>
              <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.name} onChange={e => setDeliveryForm({ ...deliveryForm, name: e.target.value })} />
              <input type="date" placeholder="Date of Birth" className="w-full px-4 py-3 border rounded-xl text-sm text-gray-500" value={deliveryForm.dob} onChange={e => setDeliveryForm({ ...deliveryForm, dob: e.target.value })} />
              <input type="tel" placeholder="Mobile Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.mobile} onChange={e => setDeliveryForm({ ...deliveryForm, mobile: e.target.value })} />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.email} onChange={e => setDeliveryForm({ ...deliveryForm, email: e.target.value })} />
              <input type="text" placeholder="Aadhaar Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.aadhaar} onChange={e => setDeliveryForm({ ...deliveryForm, aadhaar: e.target.value })} />
              <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.password} onChange={e => setDeliveryForm({ ...deliveryForm, password: e.target.value })} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 2: Vehicle Details</p>
              <select className="w-full px-4 py-3 border rounded-xl text-sm text-gray-500" value={deliveryForm.vehicleType} onChange={e => setDeliveryForm({ ...deliveryForm, vehicleType: e.target.value })}>
                <option value="TWO_WHEELER">Two Wheeler (Bike/Scooter)</option>
                <option value="THREE_WHEELER">Three Wheeler (Auto)</option>
                <option value="FOUR_WHEELER">Four Wheeler (Mini Truck)</option>
              </select>
              <input type="text" placeholder="Vehicle Registration Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.vehicleNumber} onChange={e => setDeliveryForm({ ...deliveryForm, vehicleNumber: e.target.value })} />
              <input type="text" placeholder="Driving License Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.license} onChange={e => setDeliveryForm({ ...deliveryForm, license: e.target.value })} />
              <input type="text" placeholder="RC Book Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.rcBook} onChange={e => setDeliveryForm({ ...deliveryForm, rcBook: e.target.value })} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 3: Delivery Zone</p>
              <select className="w-full px-4 py-3 border rounded-xl text-sm text-gray-500" value={deliveryForm.serviceRadius} onChange={e => setDeliveryForm({ ...deliveryForm, serviceRadius: e.target.value })}>
                <option value="5">5 km Radius</option>
                <option value="10">10 km Radius</option>
                <option value="15">15 km Radius</option>
              </select>
              <input type="text" placeholder="Current Address" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.currentAddress} onChange={e => setDeliveryForm({ ...deliveryForm, currentAddress: e.target.value })} />

              <div className="p-3 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-semibold">GPS Coordinates</span>
                  <button type="button" onClick={() => getGPSLocation('DELIVERY')} className="text-xs text-primary font-bold hover:underline">
                    Get Current GPS
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Latitude" className="px-3 py-2 border rounded-lg text-xs" value={deliveryForm.lat} readOnly />
                  <input type="text" placeholder="Longitude" className="px-3 py-2 border rounded-lg text-xs" value={deliveryForm.lng} readOnly />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Step 4: Bank Details</p>
              <input type="text" placeholder="Account Holder Name" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.bankHolder} onChange={e => setDeliveryForm({ ...deliveryForm, bankHolder: e.target.value })} />
              <input type="text" placeholder="Bank Name" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.bankName} onChange={e => setDeliveryForm({ ...deliveryForm, bankName: e.target.value })} />
              <input type="text" placeholder="Account Number" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.bankAccount} onChange={e => setDeliveryForm({ ...deliveryForm, bankAccount: e.target.value })} />
              <input type="text" placeholder="IFSC Code" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.ifscCode} onChange={e => setDeliveryForm({ ...deliveryForm, ifscCode: e.target.value })} />
              <input type="text" placeholder="UPI ID" className="w-full px-4 py-3 border rounded-xl text-sm" value={deliveryForm.upiId} onChange={e => setDeliveryForm({ ...deliveryForm, upiId: e.target.value })} />
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              type="button" disabled={step === 1}
              onClick={() => setStep(prev => prev - 1)}
              className={`px-4 py-2 border rounded-xl text-sm font-semibold ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>
            {step < 4 ? (
              <button
                type="button" onClick={() => setStep(prev => prev + 1)}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark"
              >
                Next
              </button>
            ) : (
              <button
                type="button" onClick={handleDeliverySubmit} disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark flex items-center justify-center"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Submit'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
