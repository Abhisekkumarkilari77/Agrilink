import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import productService from '../../services/productService';
import customerService from '../../services/customerService';
import ProductImage from '../../components/common/ProductImage';

// Voice recognition config
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

const Home = () => {
  const { user, logout } = useAuth();
  const { addToCart, getCartCount } = useCart();
  const { isInWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Data states
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redesign state parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(25);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [listening, setListening] = useState(false);
  
  // Deals countdown state
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });
  // Testimonials state
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  // Quick View Modal Product state
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Parallax Mouse tracking coords
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 35;
    const y = (clientY - window.innerHeight / 2) / 35;
    setMouseCoords({ x, y });
  };

  // CountUp hook
  const useCountUp = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = parseInt(target, 10);
      if (start === end) return;
      let totalMiliseconds = duration;
      let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, Math.max(incrementTime, 1));
      return () => clearInterval(timer);
    }, [target, duration]);
    return count;
  };

  const c1 = useCountUp(200);
  const c2 = useCountUp(380);
  const c3 = useCountUp(500);
  const c4 = useCountUp(25);

  const categories = [
    { name: 'Vegetables', icon: '🥬', count: '120+ Products', color: 'from-[#16A34A]/20 to-[#22C55E]/10' },
    { name: 'Fruits', icon: '🍎', count: '85+ Products', color: 'from-red-500/20 to-orange-500/10' },
    { name: 'Dairy', icon: '🥛', count: '40+ Products', color: 'from-blue-500/20 to-sky-500/10' },
    { name: 'Grains', icon: '🌾', count: '65+ Products', color: 'from-amber-500/20 to-yellow-500/10' },
    { name: 'Eggs', icon: '🥚', count: '15+ Products', color: 'from-orange-500/20 to-amber-500/10' },
    { name: 'Flowers', icon: '💐', count: '30+ Products', color: 'from-pink-500/20 to-purple-500/10' }
  ];

  const testimonials = [
    {
      name: 'Ramanathan Swamy',
      role: 'Organic Farmer (Nelamangala)',
      text: 'AgriLink helped me double my organic harvest profits in just 3 months. The transparent logistics and daily OTP deliveries are fantastic!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
    },
    {
      name: 'Priyanka Sen',
      role: 'Regular Customer (Indiranagar)',
      text: 'Blinkit-like speed combined with fresh farm organic harvest quality. Knowing exact farmer details and their distance is so satisfying.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
    },
    {
      name: 'Hiren Patel',
      role: 'Grains Farmer (Mandya)',
      text: 'Eliminating the middleman agent commission allows me to sell Basmati Rice and Wheat at fair rates directly to household customers.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80'
    }
  ];

  // Fetch products and farmers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodData = await productService.getProducts();
        setProducts(prodData || []);
        const farmerData = await customerService.getNearbyFarmers();
        setFarmers(farmerData || []);
      } catch (err) {
        console.error('Error fetching dashboard listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Deals countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto slide reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIdx(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Voice activation
  const startSpeechToText = () => {
    if (!recognition) {
      addToast('Speech recognition is not supported in this browser.', 'info');
      return;
    }
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setSearchQuery(speechToText);
      addToast(`Searching for: "${speechToText}"`, 'success');
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const matchSearch = searchQuery.trim() === '' || 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.farmerName && prod.farmerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'All' || prod.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(prod.category.toLowerCase()) || (selectedCategory === 'Vegetables' && prod.category === 'Vegetables');
      const matchOrganic = !organicOnly || prod.organic;
      const matchPrice = prod.price <= maxPrice;
      const matchRating = (prod.rating || 4.0) >= minRating;
      const matchDistance = (prod.distance || 3.0) <= maxDistance;

      return matchSearch && matchCategory && matchOrganic && matchPrice && matchRating && matchDistance;
    });
  }, [products, searchQuery, selectedCategory, organicOnly, maxPrice, minRating, maxDistance]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(p => p.name)
      .slice(0, 5);
  }, [products, searchQuery]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`${product.name} added to cart!`, 'success');
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (!isInWishlist(product.id)) {
      addToast(`Added ${product.name} to Wishlist!`, 'success');
    } else {
      addToast(`Removed ${product.name} from Wishlist`, 'info');
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#F5F7FA] font-sans overflow-x-hidden relative"
    >
      
      {/* ═══════ ADVANCED SVG GRID PATTERN BACKGROUND & GLOWS ═══════ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />
      
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#16A34A] opacity-20 blur-[130px] pointer-events-none animate-float-slow" />
      <div className="absolute top-[400px] right-[-150px] w-[600px] h-[600px] rounded-full bg-[#84CC16] opacity-15 blur-[160px] pointer-events-none animate-float-reverse" />

      {/* ═══════ GLASSMORPHISM NAVBAR ═══════ */}
      <header className="sticky top-0 z-50 w-full px-4 py-3 md:px-8">
        <div className="mx-auto max-w-7xl glass rounded-[24px] shadow-lg border border-white/40 backdrop-blur-xl px-4 md:px-8 py-3.5 flex items-center justify-between transition-all duration-300">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 bg-gradient-to-tr from-[#16A34A] to-[#84CC16] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              AL
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-800 tracking-tight leading-none">AgriLink</span>
              <span className="text-[10px] text-[#16A34A] font-bold uppercase tracking-widest mt-1">Direct Marketplace</span>
            </div>
          </Link>

          {/* Search bar inside Navbar */}
          <div className="hidden md:flex items-center relative w-1/3">
            <input
              type="text"
              placeholder="Search farm fresh produce..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchSuggestions(true);
              }}
              onFocus={() => setShowSearchSuggestions(true)}
              className="w-full bg-[#fafbfc]/80 border border-slate-200 focus:border-[#16A34A] focus:bg-white rounded-full py-2.5 pl-5 pr-12 text-sm font-medium text-slate-700 outline-none transition-all duration-300 shadow-sm"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button 
                onClick={startSpeechToText}
                className={`p-1 rounded-full text-slate-400 hover:text-[#16A34A] transition-colors ${listening ? 'text-red-500 animate-pulse' : ''}`}
                title="Voice Search"
              >
                🎤
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">🔍</span>
            </div>
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 z-50 animate-scaleIn">
                {searchSuggestions.map((sug, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSearchQuery(sug);
                      setShowSearchSuggestions(false);
                    }}
                    className="px-4 py-2 hover:bg-[#F5F7FA] rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
                  >
                    {sug}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation links & Actions */}
          <div className="flex items-center gap-4">
            
            {/* Wishlist Heart */}
            <Link to="/customer/wishlist" className="relative p-2 text-slate-600 hover:text-red-500 transition-transform hover:scale-115" title="Wishlist">
              <span className="text-xl">❤️</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full text-[9px] w-5.5 h-5.5 flex items-center justify-center font-extrabold animate-scaleIn shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/customer/cart" className="relative p-2 text-slate-600 hover:text-[#16A34A] transition-transform hover:scale-115" title="Cart">
              <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#16A34A] text-white rounded-full text-[9px] w-5.5 h-5.5 flex items-center justify-center font-extrabold animate-scaleIn shadow-md">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Profile avatar glow */}
            {user ? (
              <div className="flex items-center gap-3.5 border-l border-slate-200 pl-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#16A34A] to-[#84CC16] p-[2px] shadow-lg animate-pulseGlow">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-black text-[#16A34A]">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-none">{user.name}</span>
                  <span className="text-[9px] font-bold text-[#16A34A] tracking-wider uppercase mt-1">Active</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 border border-slate-200 hover:border-red-200 bg-white/70 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-xl text-xs font-bold transition-all duration-300 btn-press"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-[#16A34A] hover:bg-[#16A34A]/10 font-bold rounded-xl text-xs transition duration-200 btn-press"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4.5 py-2.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200 btn-press"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══════ HERO SECTION (Parallax Mouse Tilt) ═══════ */}
      <section className="relative w-full px-4 md:px-8 py-12 md:py-24 perspective-container">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12">
          
          {/* Welcome Info */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2.5 bg-white border border-[#16A34A]/20 rounded-full px-4 py-2 text-xs font-bold text-[#16A34A] shadow-sm backdrop-blur-md">
              <span className="w-2.5 h-2.5 bg-[#84CC16] rounded-full relative pulse-dot" />
              India's Dynamic Direct Farmer Connection
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 leading-[1.1] tracking-tight">
              Premium Freshness, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#84CC16]">
                Straight From Farms.
              </span>
            </h1>

            <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-xl font-semibold leading-relaxed">
              AgriLink connects households with local certified growers. Avoid markups, support farm micro-economies, and get ultra-fast OTP-secure shipping.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => {
                  const element = document.getElementById('products-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-[#15803d] hover:to-[#16a34a] text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 btn-press"
              >
                Browse Harvest Products
              </button>
              <button
                onClick={() => navigate('/customer/products?nearby=true')}
                className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold rounded-2xl text-sm shadow-md transition-all duration-300 btn-press"
              >
                Explore Nearby Farmers 📍
              </button>
            </div>

            {/* Live Statistics Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                <span className="text-2xl md:text-3xl font-black text-slate-800 block">{c1}+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Verified Farmers</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                <span className="text-2xl md:text-3xl font-black text-slate-800 block">{c2 * 30}+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Happy Customers</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                <span className="text-2xl md:text-3xl font-black text-slate-800 block">{c3}+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Fresh Products</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                <span className="text-2xl md:text-3xl font-black text-slate-800 block">{c4}+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Categories</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration (Mouse Parallax interactive tilt) */}
          <div className="flex-1 w-full flex justify-center items-center">
            <div 
              style={{
                transform: `rotateY(${mouseCoords.x}deg) rotateX(${-mouseCoords.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
              className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-[36px] bg-gradient-to-br from-white/90 to-white/40 border border-white/50 backdrop-blur-md relative flex items-center justify-center shadow-2xl p-6 perspective-element"
            >
              
              <div className="absolute -top-6 -left-6 bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5 animate-float" style={{ transform: 'translateZ(40px)' }}>
                <span className="text-xl">🛵</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 leading-none">Fast Delivery</p>
                  <p className="text-xs font-black text-slate-800 mt-1">OTP Verified</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5 animate-float-slow" style={{ transform: 'translateZ(50px)' }}>
                <span className="text-xl">🌿</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 leading-none">Certified</p>
                  <p className="text-xs font-black text-emerald-600 mt-1">100% Organic</p>
                </div>
              </div>

              <div className="text-center space-y-6" style={{ transform: 'translateZ(30px)' }}>
                <div className="w-64 h-64 rounded-3xl overflow-hidden border-4 border-white shadow-2xl mx-auto animate-float relative">
                  <img 
                    src="https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Organic Farming Harvest" 
                    className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="space-y-1.5">
                  <span className="bg-[#16A34A]/20 text-[#16A34A] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Sustainably Grown
                  </span>
                  <p className="text-xs font-bold text-slate-500 mt-2">Connecting Local Indian Farms</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════ LIVE TICKER ALERT SYSTEM ═══════ */}
      <div className="w-full bg-[#16A34A] text-white py-3 overflow-hidden relative border-y border-white/10 shadow-md">
        <div className="flex animate-ticker whitespace-nowrap gap-12 font-bold text-xs uppercase tracking-widest">
          <span>⚡ FLASH DEAL: Organic Mangoes 25% Off </span>
          <span>• 🚚 FREE Delivery on orders above ₹200 </span>
          <span>• 🌾 Suresh Gowda joined from Mandya </span>
          <span>• ⭐ Average farm rating 4.8 Stars </span>
          <span>• 📍 Supporting 12 Local Greenhouses </span>
          {/* Duplicate for infinite loop spacing */}
          <span>⚡ FLASH DEAL: Organic Mangoes 25% Off </span>
          <span>• 🚚 FREE Delivery on orders above ₹200 </span>
          <span>• 🌾 Suresh Gowda joined from Mandya </span>
          <span>• ⭐ Average farm rating 4.8 Stars </span>
          <span>• 📍 Supporting 12 Local Greenhouses </span>
        </div>
      </div>

      {/* ═══════ FEATURED CATEGORIES (Glass Cards) ═══════ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16 space-y-8">
        <div className="text-center">
          <span className="bg-emerald-100 text-[#16A34A] text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full">
            Featured Categories
          </span>
          <h2 className="text-3xl font-black text-slate-800 mt-4">Explore Healthy Fresh Harvests</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedCategory(cat.name);
                const element = document.getElementById('products-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass rounded-3xl p-6 border border-white/50 text-center cursor-pointer hover:shadow-xl hover:shadow-[#16A34A]/5 hover:border-[#16A34A] transition-all duration-300 card-hover flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-sm">
                {cat.icon}
              </div>
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-800">{cat.name}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ TODAY'S DEALS COUNTDOWN ═══════ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="space-y-4 text-center md:text-left z-10">
            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              Flash Deal of the Day ⏳
            </span>
            <h3 className="text-3xl font-black">Organic Fresh Produce deals ending soon!</h3>
            <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-md">
              Grab certified organic vegetables directly from local mandis at lowest prices. Valid until stocks last.
            </p>

            {/* Countdown timer UI */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center backdrop-blur-md">
                <span className="text-xl font-black block">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Hours</span>
              </div>
              <span className="font-bold text-xl">:</span>
              <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center backdrop-blur-md">
                <span className="text-xl font-black block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Mins</span>
              </div>
              <span className="font-bold text-xl">:</span>
              <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center backdrop-blur-md">
                <span className="text-xl font-black block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Secs</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl space-y-4 z-10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Deal Item: <strong className="text-white">Fresh Vine Tomatoes</strong></span>
              <span className="bg-[#84CC16] text-black text-[9px] font-black px-2 py-0.5 rounded-full">₹25 / kg</span>
            </div>
            
            {/* Animated progress bar for deal item limit */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Available stock sold: 82%</span>
                <span>18kg Left</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#16A34A] to-[#84CC16] h-full rounded-full transition-all duration-1000" style={{ width: '82%' }} />
              </div>
            </div>

            <button
              onClick={() => {
                const tomato = products.find(p => p.id === 'prod-1');
                if (tomato) {
                  addToCart(tomato, 1);
                  addToast('Deal Tomato added to cart!', 'success');
                } else {
                  addToast('Deal Tomato is loaded. Navigate to products.', 'info');
                }
              }}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-black rounded-xl transition duration-200 btn-press"
            >
              Claim Deal Now
            </button>
          </div>

        </div>
      </section>

      {/* ═══════ FLOATING SEARCH BAR & FILTERS PANEL TRIGGER ═══════ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🛒</span>
          <h3 className="text-lg font-black text-slate-800">Fresh Marketplace Products</h3>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4.5 py-2.5 glass border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700 flex items-center gap-2 hover:bg-[#16A34A]/5 transition-colors duration-200"
          >
            <span>🎛️</span> Filters {isFilterOpen ? 'Close' : 'Open'}
          </button>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 bg-white/80 rounded-xl text-xs font-bold text-slate-600 outline-none cursor-pointer focus:border-[#16A34A]"
          >
            <option value="All">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Grains">Grains</option>
            <option value="Eggs">Eggs</option>
            <option value="Flowers">Flowers</option>
          </select>
        </div>
      </section>

      {/* ═══════ INTERACTIVE FILTERS PANEL ═══════ */}
      {isFilterOpen && (
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-4 animate-fadeIn">
          <div className="glass border border-white/50 rounded-3xl p-6 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Price Slider */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Max Price: <strong className="text-slate-800">₹{maxPrice}</strong></label>
              <input
                type="range"
                min="10"
                max="1500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#16A34A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>₹10</span>
                <span>₹1500</span>
              </div>
            </div>

            {/* Distance Slider */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Max Farmer Distance: <strong className="text-slate-800">{maxDistance} km</strong></label>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-[#16A34A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>1 km</span>
                <span>25 km</span>
              </div>
            </div>

            {/* Organic Switch */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="organicSwitch"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="w-5 h-5 rounded accent-[#16A34A] cursor-pointer"
              />
              <label htmlFor="organicSwitch" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                🌿 Show Organic Harvest Only
              </label>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Minimum Rating</label>
              <div className="flex gap-2">
                {[0, 4.2, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${minRating === rating ? 'bg-[#16A34A] text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                  >
                    {rating === 0 ? 'All' : `★ ${rating}+`}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ═══════ PRODUCT GRID ═══════ */}
      <section id="products-section" className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 animate-pulse">
                <div className="h-44 bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-200 rounded w-1/4" />
                  <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-[32px] border border-white/40">
            <span className="text-5xl block animate-bounce">🥬</span>
            <p className="text-slate-500 font-extrabold text-base mt-4">No Products Available</p>
            <p className="text-slate-400 text-xs mt-1">Try relaxing filters or search term parameters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#16A34A]/5 hover:border-[#16A34A]/30 transition-all duration-300 card-hover flex flex-col justify-between relative group"
                >
                  {/* Heart Wishlist Button */}
                  <button
                    onClick={(e) => handleToggleWishlist(e, product)}
                    className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 flex items-center justify-center text-sm transition-transform hover:scale-110 shadow-sm"
                  >
                    {isWishlisted ? '❤️' : '♡'}
                  </button>

                  {/* Image & Badges */}
                  <div
                    className="relative cursor-pointer h-48 bg-slate-50 overflow-hidden"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                      {product.organic && (
                        <span className="bg-[#16A34A] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                          🌿 Organic
                        </span>
                      )}
                      {product.discount > 0 ? (
                        <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                          {product.discount}% OFF
                        </span>
                      ) : (
                        <span className="bg-[#84CC16] text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                          Harvest
                        </span>
                      )}
                    </div>
                    
                    <span className="absolute bottom-3.5 right-3.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      📍 {product.distance || 3.5} km
                    </span>
                  </div>

                  {/* Details Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          onClick={() => setQuickViewProduct(product)}
                          className="font-extrabold text-slate-800 hover:text-[#16A34A] cursor-pointer transition text-base leading-snug line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5 whitespace-nowrap bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                          ★ {product.rating || 4.5}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                        🌾 Farm: {product.farmName || 'Verified AgriLink Farm'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                      <div>
                        <div className="flex items-baseline space-x-0.5">
                          <span className="text-base font-black text-slate-800">₹{product.price}</span>
                          <span className="text-[10px] text-slate-400 font-bold">/ {product.unit || 'kg'}</span>
                        </div>
                        <p className="text-[9px] text-[#16A34A] font-bold mt-1">🚚 Delivery in 3 hrs</p>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl text-xs font-black transition-colors duration-200 shadow-sm btn-press"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════ NEARBY FARMERS MAP INTERACTIVE COMPONENT ═══════ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16 space-y-8">
        <div className="text-center">
          <span className="bg-emerald-100 text-[#16A34A] text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full">
            GPS Live Connection
          </span>
          <h2 className="text-3xl font-black text-slate-800 mt-4">Verified Growers Coordinates Map</h2>
        </div>

        {/* Map UI Preview */}
        <div className="glass-dark rounded-[36px] p-8 border border-white/10 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[#0f172a] opacity-90 z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#1e293b,transparent)] z-0" />
          
          <div className="relative z-10 flex justify-between items-center">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs px-3.5 py-2 rounded-full flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full relative pulse-dot" />
              Live Interactive GPS Grid Map
            </span>
            <span className="text-slate-400 text-xs font-bold">Showing {farmers.length} nearby locations</span>
          </div>

          <div className="relative z-10 grid sm:grid-cols-3 gap-5 my-8">
            {farmers.length > 0 ? farmers.slice(3, 10).map((farmer, idx) => (
              <div
                key={farmer.farmerId || idx}
                onClick={() => navigate(`/customer/products?farmerId=${farmer.farmerId}`)}
                className="bg-slate-900/80 border border-slate-800 hover:border-[#16A34A] hover:bg-slate-900 rounded-2xl p-5 space-y-4 cursor-pointer transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#16A34A] to-[#84CC16] flex items-center justify-center text-xl">
                    🌾
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white leading-none">{farmer.farmName}</h4>
                    <p className="text-[10px] text-slate-500 mt-1.5">By {farmer.name}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl space-y-1.5 text-[10px] text-slate-400 font-bold font-mono">
                  <p>📍 GPS: <span className="text-emerald-400">{farmer.lat}, {farmer.lng}</span></p>
                  <p>🏡 village: {farmer.village} ({farmer.mandal})</p>
                  <p className="text-amber-400">⚡ Distance: {farmer.distance} km</p>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center text-slate-500 py-8">Loading agricultural locations...</div>
            )}
          </div>

          <p className="relative z-10 text-center text-xs text-slate-500 font-semibold border-t border-slate-800 pt-4">
            Click on any farm card to browse their direct harvest crops.
          </p>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE US (Apple/Airbnb Premium Cards) ═══════ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16 space-y-8">
        <div className="text-center">
          <span className="bg-emerald-100 text-[#16A34A] text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full">
            Supply Transparency
          </span>
          <h2 className="text-3xl font-black text-slate-800 mt-4">Why AgriLink is Built Different</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🌾', title: 'Farm Fresh Direct', desc: 'No intermediate wholesale brokers or agents. Local growers pack and ship directly to your home.' },
            { icon: '🚚', title: 'Instant Express Shipping', desc: 'Secure shipping updates with real-time GPS courier assignment and OTP delivery code.' },
            { icon: '🔒', title: 'Secured Payments', desc: '100% transparent checkout options. Farmers receive payouts directly upon success callback.' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#16A34A]/5 transition-all duration-300 card-hover flex flex-col justify-between text-center"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm">
                {item.icon}
              </div>
              <h4 className="text-base font-extrabold text-slate-800 mt-6">{item.title}</h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ TESTIMONIALS CAROUSEL ═══════ */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="glass rounded-[32px] p-8 md:p-12 border border-white/50 shadow-xl relative text-center space-y-6">
          <div className="text-5xl text-emerald-300">“</div>
          <div className="min-h-[120px] transition-all duration-500 animate-fadeIn">
            <p className="text-slate-600 text-sm md:text-base font-bold italic leading-relaxed">
              {testimonials[currentReviewIdx].text}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <img
                src={testimonials[currentReviewIdx].avatar}
                alt={testimonials[currentReviewIdx].name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
              />
              <div>
                <h5 className="font-extrabold text-slate-800 text-sm leading-none">{testimonials[currentReviewIdx].name}</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{testimonials[currentReviewIdx].role}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 pt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentReviewIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentReviewIdx === i ? 'bg-[#16A34A] w-6' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ QUICK VIEW MODAL DETAIL PANEL ═══════ */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl p-6 md:p-8 max-w-2xl w-full relative animate-scaleIn">
            
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 h-52 bg-slate-50 rounded-2xl overflow-hidden">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-xl font-black text-slate-800 leading-none">{quickViewProduct.name}</h3>
                  <span className="bg-[#16A34A]/10 text-[#16A34A] text-[9px] font-black uppercase px-2.5 py-1 rounded-full whitespace-nowrap">
                    ★ {quickViewProduct.rating || 4.5}
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {quickViewProduct.description || 'Fresh chemical-free handpicked harvest items directly sourced from local grower fields.'}
                </p>

                <div className="bg-[#F5F7FA] p-4 rounded-2xl text-xs space-y-1.5 border border-slate-100">
                  <p className="text-slate-500">🌾 Grower: <strong className="text-slate-800">{quickViewProduct.farmerName}</strong></p>
                  <p className="text-slate-500">📍 Distance: <strong className="text-slate-800">{quickViewProduct.distance} km away</strong></p>
                  <p className="text-slate-500">🚚 Shipping: <strong className="text-emerald-600">Free over ₹200</strong></p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-black text-slate-800">₹{quickViewProduct.price} <small className="text-[10px] text-slate-400">/ {quickViewProduct.unit || 'kg'}</small></span>
                  <button
                    onClick={(e) => {
                      handleAddToCart(e, quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="px-6 py-3 bg-[#16A34A] hover:bg-[#15803d] text-white font-extrabold rounded-xl text-xs transition duration-200 shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═══════ PREMIUM GLASS FOOTER ═══════ */}
      <footer className="w-full px-4 md:px-8 py-8 mt-16 bg-slate-900 text-white rounded-t-[32px] relative overflow-hidden">
        <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-[#16A34A] opacity-20 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-b border-white/10 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-[#16A34A] to-[#84CC16] rounded-xl flex items-center justify-center text-white font-black text-lg">
                AL
              </div>
              <span className="text-lg font-black tracking-tight">AgriLink</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Premium farm-direct agricultural marketplace connecting verified local growers with healthy households across India.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-300">Quick Links</h5>
            <ul className="space-y-2 text-xs font-bold text-slate-400">
              <li><Link to="/customer/products" className="hover:text-white transition-colors duration-200">Browse Harvest</Link></li>
              <li><Link to="/customer/products?nearby=true" className="hover:text-white transition-colors duration-200">Local Farmers</Link></li>
              <li><Link to="/customer/orders" className="hover:text-white transition-colors duration-200">Order History</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors duration-200">Join Community</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-300">Contact</h5>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>📧 contact@agrilink.co.in</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Nelamangala Organic Farm Hub, Karnataka</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-300">Newsletter</h5>
            <p className="text-[10px] text-slate-400 font-semibold">Subscribe to receive fresh mandi rates alerts.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#16A34A] w-full"
              />
              <button
                onClick={() => addToast('Subscribed to AgriLink newsletter!', 'success')}
                className="px-3.5 py-2 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl text-xs font-black btn-press"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-bold relative z-10">
          <span>© 2026 AgriLink — Premium AgriTech Marketplace. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
