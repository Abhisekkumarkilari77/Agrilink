import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

import ProductImage from '../common/ProductImage';

const ProductCard = ({ product, animDelay = 0 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`${product.name} added to cart!`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
      addToast(`Added ${product.name} to Wishlist!`, 'success');
    } else {
      addToast(`Removed ${product.name} from Wishlist`, 'info');
    }
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm card-hover flex flex-col justify-between animate-fadeIn relative group"
      style={{ animationDelay: `${animDelay}s` }}
    >
      {/* Wishlist Heart Button */}
      <button
        onClick={handleToggleWishlist}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/50 flex items-center justify-center text-base transition-transform hover:scale-110 shadow-sm"
      >
        {isWishlisted ? '❤️' : '♡'}
      </button>

      {/* Product Image & Badges */}
      <div
        className="relative cursor-pointer h-48 bg-stone-100 overflow-hidden"
        onClick={() => navigate(`/customer/products/${product.id}`)}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.organic && (
            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              🌿 Organic
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          📍 {product.distance || 3.5} km
        </span>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start gap-1">
            <h4
              onClick={() => navigate(`/customer/products/${product.id}`)}
              className="font-extrabold text-stone-800 hover:text-primary cursor-pointer transition text-base leading-snug line-clamp-1"
            >
              {product.name}
            </h4>
            <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5 whitespace-nowrap">
              ★ {product.rating || 4.5}
            </span>
          </div>
          <p className="text-[11px] text-stone-400 font-medium mt-1">Farm: {product.farmName || product.farmerName || 'AgriLink Organic'}</p>
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-base font-black text-stone-800">₹{product.price}</span>
              <span className="text-[10px] text-stone-400 font-bold">/ {product.unit || 'kg'}</span>
            </div>
            {product.deliveryTime && (
              <p className="text-[9px] text-emerald-600 font-bold">🚚 {product.deliveryTime}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition shadow-sm shadow-primary/15 btn-press"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
