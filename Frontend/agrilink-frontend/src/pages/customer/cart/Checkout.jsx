import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import customerService from '../../../services/customerService';

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('Morning');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Inline Add Address State
  const [showInlineAddr, setShowInlineAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: 'Home',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAddresses();
      setAddresses(data);
      if (data.length > 0) {
        const defaultAddr = data.find(a => a.isDefault) || data[0];
        setSelectedAddress(defaultAddr.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleInlineAddAddr = async (e) => {
    e.preventDefault();
    try {
      const updated = await customerService.addAddress(newAddr);
      setAddresses(updated);
      const latest = updated[updated.length - 1];
      if (latest) {
        setSelectedAddress(latest.id);
      }
      setShowInlineAddr(false);
      setNewAddr({ name: 'Home', houseNo: '', street: '', city: '', state: '', pincode: '' });
    } catch (err) {
      alert('Failed to add address');
    }
  };

  const subtotal = getCartTotal();
  const delivery = subtotal > 300 ? 0 : 40;
  const discount = subtotal > 150 ? 20 : 0;
  const total = subtotal + delivery - discount;

  const handlePlaceOrder = () => {
    if (!selectedAddress && addresses.length === 0) {
      alert('Please add a delivery address to proceed.');
      return;
    }

    const chosen = addresses.find(a => a.id === selectedAddress);
    const chosenAddressText = chosen
      ? `${chosen.houseNo}, ${chosen.street}, ${chosen.city}, ${chosen.state} - ${chosen.pincode}`
      : 'Default Delivery Address';

    sessionStorage.setItem('agrilink_checkout_details', JSON.stringify({
      address: chosenAddressText,
      slot: selectedSlot,
      paymentMethod,
      total,
      items: cart.map(item => ({
        name: item.product.name,
        farmerName: item.product.farmerName,
        quantity: item.quantity,
        price: item.product.price
      }))
    }));
    navigate('/customer/payment');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* 1. Address Block */}
        <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-bold text-stone-800">1. Select Delivery Address</h3>
            <button
              onClick={() => setShowInlineAddr(!showInlineAddr)}
              className="text-xs font-bold text-primary hover:underline"
            >
              {showInlineAddr ? 'Cancel' : '+ Add Address'}
            </button>
          </div>

          {/* Inline Add Address Form */}
          {showInlineAddr && (
            <form onSubmit={handleInlineAddAddr} className="p-4 border border-dashed border-primary/40 rounded-2xl bg-emerald-50/20 space-y-3">
              <h4 className="text-xs font-bold text-primary uppercase">Add Delivery Address</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="House/Flat No."
                  value={newAddr.houseNo}
                  onChange={(e) => setNewAddr({ ...newAddr, houseNo: e.target.value })}
                  required
                  className="px-3 py-2 border rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Street / Locality"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  required
                  className="px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  required
                  className="px-3 py-2 border rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  required
                  className="px-3 py-2 border rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  required
                  className="px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark">
                Save & Use Address
              </button>
            </form>
          )}

          {/* Address Radio List */}
          {addresses.length === 0 ? (
            <div className="text-center py-8 border border-stone-200 rounded-2xl bg-stone-50 space-y-2">
              <p className="text-xs font-bold text-stone-700">No delivery addresses found.</p>
              <p className="text-[11px] text-stone-500">Please click "+ Add Address" above to specify your delivery location.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`p-4 border rounded-2xl flex items-start space-x-3 cursor-pointer transition select-none ${
                    selectedAddress === addr.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-stone-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-800 text-sm">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 2. Slot Picker */}
        <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-stone-800 border-b pb-4">2. Choose Delivery Slot</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { id: 'Morning', title: 'Morning', desc: '8 AM - 11 AM' },
              { id: 'Afternoon', title: 'Afternoon', desc: '12 PM - 3 PM' },
              { id: 'Evening', title: 'Evening', desc: '5 PM - 8 PM' }
            ].map(slot => (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-4 border rounded-2xl cursor-pointer text-center space-y-1 transition ${
                  selectedSlot === slot.id ? 'border-primary bg-primary/5 font-bold' : 'border-stone-200'
                }`}
              >
                <p className="text-sm text-stone-800">{slot.title}</p>
                <p className="text-[10px] text-stone-400 font-medium">{slot.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Payment Option */}
        <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-stone-800 border-b pb-4">3. Select Payment Option</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
              { id: 'CARD', label: 'Debit or Credit Card' },
              { id: 'NETBANKING', label: 'Net Banking' },
              { id: 'COD', label: 'Cash on Delivery (COD)' }
            ].map(pay => (
              <label
                key={pay.id}
                className={`p-4 border rounded-2xl flex items-center space-x-3 cursor-pointer transition select-none ${
                  paymentMethod === pay.id ? 'border-primary bg-primary/5' : 'border-stone-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === pay.id}
                  onChange={() => setPaymentMethod(pay.id)}
                  className="accent-primary"
                />
                <span className="text-xs font-semibold text-stone-700">{pay.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="bg-white rounded-3xl border border-stone-150 shadow-sm p-6 flex flex-col justify-between h-fit space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-800 border-b pb-4">Order Summary</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-stone-600">
                <span>{item.product.name} (x{item.quantity})</span>
                <span className="font-bold text-stone-700">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-3 text-xs text-stone-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-700">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-stone-700">₹{delivery}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between text-base font-black text-stone-800">
              <span>Grand Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={addresses.length === 0}
          className={`w-full font-bold py-3.5 rounded-xl transition text-sm text-center block ${
            addresses.length === 0
              ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20'
          }`}
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;
