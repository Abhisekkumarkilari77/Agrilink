import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../../services/productService';
import { useCart } from '../../../context/CartContext';
import ProductImage from '../../../components/common/ProductImage';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-24 text-red-600 font-bold">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Product Details Section */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm grid md:grid-cols-2 gap-8">
        {/* Left: Image */}
        <div className="h-96 rounded-2xl overflow-hidden bg-gray-100 relative">
          <ProductImage src={product.image || product.imageUrl} name={product.name} category={product.category} alt={product.name} className="w-full h-full object-cover" />
          {product.organic && (
            <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
              Organic
            </span>
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-primary font-extrabold uppercase bg-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-3xl font-black text-gray-800 mt-3">{product.name}</h1>
              <p className="text-sm font-semibold text-gray-400 mt-1">Farm: <span className="text-gray-600">{product.farmName}</span> | By {product.farmerName}</p>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <span className="text-yellow-500 font-bold">★ {product.rating} Rating</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">{product.distance} km away</span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

            <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs">
              <p><span className="text-gray-400 font-semibold">Available Stock:</span> <span className="font-bold text-gray-700">{product.quantity} kg</span></p>
              <p><span className="text-gray-400 font-semibold">Harvest Date:</span> <span className="font-bold text-gray-700">{product.harvestDate}</span></p>
              <p><span className="text-gray-400 font-semibold">Freshness:</span> <span className="font-bold text-green-700">{product.freshness}</span></p>
              <p><span className="text-gray-400 font-semibold">Price:</span> <span className="font-bold text-gray-700">₹{product.price}/kg</span></p>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Price</span>
                <span className="text-2xl font-black text-gray-800">₹{product.price * quantity}</span>
              </div>

              {/* Quantity Changer */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 hover:bg-gray-50 font-bold text-gray-600 text-lg transition"
                >
                  -
                </button>
                <span className="px-5 font-bold text-gray-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))}
                  className="px-4 py-2 hover:bg-gray-50 font-bold text-gray-600 text-lg transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  alert(`${quantity} kg of ${product.name} added to cart!`);
                }}
                className="w-full py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition flex items-center justify-center text-sm shadow-sm"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/customer/cart');
                }}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition flex items-center justify-center text-sm shadow-lg shadow-primary/20"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Customer Reviews ({product.reviews.length})</h3>
        <div className="space-y-4">
          {product.reviews.length === 0 ? (
            <p className="text-sm text-gray-400">No reviews yet for this product. Be the first to buy and review!</p>
          ) : (
            product.reviews.map((rev, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-700">{rev.user}</span>
                  <span className="text-yellow-500">{"★".repeat(Math.round(rev.rating))}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
