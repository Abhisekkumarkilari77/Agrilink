import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../../services/productService';
import SkeletonCard from '../../../components/common/SkeletonCard';
import ProductCard from '../../../components/cards/ProductCard';

const ProductList = () => {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState('rating');

  const categories = [
    'All', 'Vegetables', 'Fruits', 'Leafy Vegetables', 'Cereals', 'Pulses',
    'Rice', 'Wheat', 'Millets', 'Spices', 'Dry Fruits',
    'Dairy', 'Eggs', 'Honey', 'Flowers', 'Herbs',
    'Seeds', 'Organic Products', 'Fertilizers', 'Plants', 'Seasonal Products'
  ];

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.farmerName && p.farmerName.toLowerCase().includes(term)) ||
        (p.farmName && p.farmName.toLowerCase().includes(term))
      );
    }

    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    if (organicOnly) {
      result = result.filter(p => p.organic);
    }

    result = result.filter(p => p.price <= maxPrice);

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'distance') {
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return result;
  }, [products, search, category, organicOnly, maxPrice, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search 200+ farm fresh products, categories, farmers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm font-medium transition"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-sm font-semibold text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer max-w-xs"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All 20 Categories' : cat}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-sm font-semibold text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="distance">Nearest Farmer</option>
            </select>
          </div>
        </div>

        {/* Detailed Slider & Checkbox */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-stone-100 pt-4 gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <span className="text-xs font-bold text-stone-500">Max Price: <span className="text-primary font-black">₹{maxPrice}</span></span>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-48 accent-primary cursor-pointer"
            />
          </div>

          <label className="flex items-center space-x-2.5 text-xs font-bold text-stone-600 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <span className="group-hover:text-primary transition">🌿 Show Organic Only</span>
          </label>
        </div>

        {!loading && (
          <div className="text-[11px] font-semibold text-stone-400">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 animate-fadeIn">
          <div className="text-5xl mb-4 animate-float">🔍</div>
          <p className="text-stone-500 font-bold">No matching products found</p>
          <p className="text-stone-400 text-sm mt-1">Try adjusting your filters or category choice!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} animDelay={idx * 0.03} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
