import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();

  // Selected Options
  const [selectedAddress, setSelectedAddress] = useState('addr-1');
  const [selectedSlot, setSelectedSlot] = useState('Morning');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const subtotal = getCartTotal();
  const delivery = subtotal > 300 ? 0 : 40;
  const discount = subtotal > 150 ? 20 : 0;
  const total = subtotal + delivery - discount;

  const addresses = [
    { id: 'addr-1', label: 'Home', text: 'Flat 402, Green Meadows, MG Road, Bengaluru - 560001' },
    { id: 'addr-2', label: 'Office', text: '9th Floor, Tech Hub, Outer Ring Road, Bengaluru - 560103' }
  ];

  const handlePlaceOrder = () => {
    // Cache checkout context details
    const chosenAddressText = addresses.find(a => a.id === selectedAddress)?.text || '';
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

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* 1. Address Block */}
        <div className="bg-white rounded-3xl p-6 border border-gray-155 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-4">1. Select Delivery Address</h3>
          <div className="space-y-3">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`p-4 border rounded-2xl flex items-start space-x-3 cursor-pointer transition select-none ${selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  className="mt-1 accent-primary"
                />
                <div>
                  <span className="font-bold text-gray-800 text-sm">{addr.label}</span>
                  <p className="text-xs text-gray-500 mt-1">{addr.text}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Slot Picker */}
        <div className="bg-white rounded-3xl p-6 border border-gray-155 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-4">2. Choose Delivery Slot</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { id: 'Morning', title: 'Morning', desc: '8 AM - 11 AM' },
              { id: 'Afternoon', title: 'Afternoon', desc: '12 PM - 3 PM' },
              { id: 'Evening', title: 'Evening', desc: '5 PM - 8 PM' }
            ].map(slot => (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-4 border rounded-2xl cursor-pointer text-center space-y-1 transition ${selectedSlot === slot.id ? 'border-primary bg-primary/5 font-bold' : 'border-gray-200'}`}
              >
                <p className="text-sm text-gray-800">{slot.title}</p>
                <p className="text-[10px] text-gray-400 font-medium">{slot.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Payment Option */}
        <div className="bg-white rounded-3xl p-6 border border-gray-155 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-4">3. Select Payment Option</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
              { id: 'CARD', label: 'Debit or Credit Card' },
              { id: 'NETBANKING', label: 'Net Banking' },
              { id: 'COD', label: 'Cash on Delivery (COD)' }
            ].map(pay => (
              <label
                key={pay.id}
                className={`p-4 border rounded-2xl flex items-center space-x-3 cursor-pointer transition select-none ${paymentMethod === pay.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === pay.id}
                  onChange={() => setPaymentMethod(pay.id)}
                  className="accent-primary"
                />
                <span className="text-xs font-semibold text-gray-700">{pay.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Checkout Summary */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 flex flex-col justify-between h-fit space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Order Summary</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-gray-600">
                <span>{item.product.name} (x{item.quantity}kg)</span>
                <span className="font-bold text-gray-700">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-3 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-700">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-gray-700">₹{delivery}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between text-base font-black text-gray-800">
              <span>Grand Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition text-sm text-center block"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;
