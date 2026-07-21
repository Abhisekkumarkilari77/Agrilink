import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const delivery = subtotal > 300 || subtotal === 0 ? 0 : 40;
  const discount = subtotal > 150 ? 20 : 0;
  const total = subtotal + delivery - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white rounded-3xl border border-gray-150 shadow-sm p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm max-w-sm">Looks like you haven't added any fresh produce to your cart yet.</p>
        <Link to="/customer/products" className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left: Cart Items List */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150 shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">Shopping Cart ({cart.length})</h2>
          <button onClick={clearCart} className="text-xs font-semibold text-red-600 hover:underline">
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="p-4 border border-gray-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/20">
              <div className="flex items-center space-x-4">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                <div>
                  <h4 className="font-bold text-gray-800">{item.product.name}</h4>
                  <p className="text-xs text-gray-400">By {item.product.farmerName}</p>
                  <p className="text-xs font-semibold text-gray-600 mt-1">₹{item.product.price} / kg</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                {/* Quantity Modifier */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-50 font-bold text-gray-600"
                  >
                    -
                  </button>
                  <span className="px-4 font-bold text-gray-800 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-50 font-bold text-gray-600"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-gray-800">₹{item.product.price * item.quantity}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-[10px] text-red-500 hover:underline mt-1 font-semibold block">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Bill Breakdown */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 flex flex-col justify-between h-fit space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Bill Details</h3>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Product Cost</span>
              <span className="font-bold text-gray-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-bold text-gray-800">
                {delivery === 0 ? <span className="text-green-600">FREE</span> : `₹${delivery}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Promo Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between text-base font-black text-gray-800">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/customer/checkout')}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition text-sm text-center block"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
