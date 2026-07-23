import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import ProductImage from '../../../components/common/ProductImage';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, wishlistCount, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    addToast(`${product.name} moved to cart!`, 'success');
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1);
    navigate('/customer/cart');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Your Wishlist ({wishlistCount})</h2>
          <p className="text-xs text-stone-400 font-semibold mt-0.5">
            {wishlistCount === 0 ? 'No items saved' : `${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'} saved for later`}
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-150 shadow-sm space-y-4">
          <div className="text-5xl">❤️</div>
          <h3 className="text-base font-bold text-stone-700">Your wishlist is currently empty</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Explore 200+ farm-fresh products and click the heart icon on any item to save it here for later.
          </p>
          <button
            onClick={() => navigate('/customer/products')}
            className="inline-block px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-stone-150 p-5 shadow-sm space-y-4 flex flex-col justify-between card-hover animate-fadeIn">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ProductImage
                    src={item.image || item.imageUrl}
                    name={item.name}
                    category={item.category}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-stone-100 cursor-pointer"
                    onClick={() => navigate(`/customer/products/${item.id}`)}
                  />
                  <div className="space-y-1">
                    <h4
                      onClick={() => navigate(`/customer/products/${item.id}`)}
                      className="font-bold text-stone-800 text-sm hover:text-primary cursor-pointer transition line-clamp-1"
                    >
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-medium">Farm: {item.farmName || item.farmerName || 'AgriLink Farm'}</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-base font-black text-stone-800">₹{item.price}</span>
                      <span className="text-[10px] text-stone-400 font-bold">/ {item.unit || 'kg'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium bg-stone-50 p-2.5 rounded-xl">
                  <span>Rating: <strong className="text-amber-500">★ {item.rating || 4.5}</strong></span>
                  <span className="text-emerald-600 font-bold">In Stock</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-bold rounded-xl transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="py-2.5 bg-primary text-white hover:bg-primary-dark text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    Buy Now
                  </button>
                </div>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  Remove from Wishlist
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
