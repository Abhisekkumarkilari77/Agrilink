import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';

const Wishlist = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('agrilink_wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const saveWishlist = (newWish) => {
    setWishlist(newWish);
    localStorage.setItem('agrilink_wishlist', JSON.stringify(newWish));
  };

  const handleRemove = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    saveWishlist(updated);
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    handleRemove(product.id);
    alert(`${product.name} moved to cart!`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4">My Wishlist ({wishlist.length})</h2>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-sm text-gray-500">
          Your wishlist is empty. Save products to buy them later!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-gray-150 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-[10px] text-gray-400">By {item.farmerName}</p>
                  <p className="text-xs font-bold text-primary mt-1">₹{item.price}/kg</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="py-2 border text-xs font-bold rounded-xl text-red-500 hover:bg-red-50 transition"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition"
                >
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
