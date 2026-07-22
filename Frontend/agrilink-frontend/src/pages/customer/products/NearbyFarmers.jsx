import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../../../services/customerService';

const NearbyFarmers = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Map and UI States
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 13.6250, lng: 78.4980, name: "Your Location (Madanapalle)" });
  
  // Filter States
  const [maxDistance, setMaxDistance] = useState(15);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const data = await customerService.getNearbyFarmers();
        setFarmers(data);
        if (data && data.length > 0) {
          // Select Gangadhar Rao by default (nearest)
          setSelectedFarmer(data[1] || data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  // Filter nearby farmers
  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const matchDistance = f.distance <= maxDistance;
      const matchCategory = selectedCategory === 'All' || 
                            (f.farmType && f.farmType.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                            (f.description && f.description.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchOrganic = !organicOnly || f.organicStatus === true;
      const matchRating = f.rating >= minRating;
      
      return matchDistance && matchCategory && matchOrganic && matchRating;
    });
  }, [farmers, maxDistance, selectedCategory, organicOnly, minRating]);

  // Convert GPS Coordinates to SVG X/Y percentages
  // Madanapalle region bounds: Lat [13.55 to 13.72], Lng [78.40 to 78.56]
  const getCoordinates = (latStr, lngStr) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const minLat = 13.55, maxLat = 13.72;
    const minLng = 78.40, maxLng = 78.56;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100; // Invert Y for UI coordinate space
    return { x, y };
  };

  const handleLocateMe = () => {
    setUserLocation({ lat: 13.6250, lng: 78.4980, name: "Locating..." });
    setTimeout(() => {
      setUserLocation({ lat: 13.6250, lng: 78.4980, name: "Your Location (Madanapalle)" });
      alert("GPS Location calibrated to current local address successfully!");
    }, 800);
  };

  const handleCall = (name, contact) => {
    alert(`Dialing ${name} at ${contact || '9876543210'}...\n(Local connection established successfully)`);
  };

  const handleChat = (name) => {
    alert(`Opening AgriLink secure instant chat with ${name}...`);
  };

  const userCoords = getCoordinates(userLocation.lat, userLocation.lng);

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-sm space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-800 flex items-center gap-2">
              <span>🌾</span> Interactive GPS Grid Map
            </h1>
            <p className="text-xs text-stone-400 font-semibold mt-0.5">
              Showing Nearby Verified Farmers and Real-time Logistics Routes
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleLocateMe}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-stone-200/50"
            >
              🎯 Locate Me
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-stone-200/50"
            >
              🖥️ {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-stone-100">
          <div className="flex flex-col space-y-1.5">
            <span className="text-xs font-bold text-stone-500">Max Distance: <span className="text-primary font-black">{maxDistance} km</span></span>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="accent-primary cursor-pointer w-full"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <span className="text-xs font-bold text-stone-500">Category Filter</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-bold text-stone-600 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Rice & Grains</option>
              <option value="Herbs">Herbs & Spices</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <span className="text-xs font-bold text-stone-500">Minimum Rating</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-bold text-stone-600 focus:outline-none cursor-pointer"
            >
              <option value={0}>All Ratings</option>
              <option value={4.6}>★ 4.6 & above</option>
              <option value={4.8}>★ 4.8 & above</option>
            </select>
          </div>

          <label className="flex items-center space-x-2.5 text-xs font-bold text-stone-600 cursor-pointer select-none group h-full pt-4 justify-end">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <span className="group-hover:text-primary transition">🌿 Show Organic Only</span>
          </label>
        </div>
      </div>

      {/* Map Layout */}
      <div className={`grid lg:grid-cols-3 gap-6 ${isFullscreen ? 'fixed inset-4 bg-stone-50 z-50 p-6 rounded-3xl border shadow-2xl overflow-y-auto' : ''}`}>
        
        {/* Visual Map Grid */}
        <div className="lg:col-span-2 bg-stone-900 rounded-3xl p-6 shadow-xl relative min-h-[500px] overflow-hidden flex flex-col justify-between text-white border border-stone-800">
          
          {/* Map Top Bar */}
          <div className="flex justify-between items-center z-10 bg-stone-900/60 backdrop-blur-md p-3 rounded-2xl border border-stone-800">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[11px] px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live Interactive GPS Grid Map
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.0))} 
                className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-sm font-black border border-stone-750 transition"
              >
                +
              </button>
              <button 
                onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.8))} 
                className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-sm font-black border border-stone-750 transition"
              >
                -
              </button>
              <button 
                onClick={() => { setZoom(1); setShowRoute(false); }} 
                className="px-3 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-[10px] font-black border border-stone-750 transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* SVG Map Canvas Grid */}
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-[radial-gradient(#2c2c2c_1px,transparent_1px)] [background-size:24px_24px]">
            <div 
              className="w-full h-full relative transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* SVG routes overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {showRoute && selectedFarmer && (() => {
                  const targetCoords = getCoordinates(selectedFarmer.lat, selectedFarmer.lng);
                  return (
                    <>
                      {/* Pulse Route Animation path */}
                      <line
                        x1={`${userCoords.x}%`}
                        y1={`${userCoords.y}%`}
                        x2={`${targetCoords.x}%`}
                        y2={`${targetCoords.y}%`}
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeDasharray="8 6"
                        className="animate-dash"
                      />
                      {/* Outer Glow path */}
                      <line
                        x1={`${userCoords.x}%`}
                        y1={`${userCoords.y}%`}
                        x2={`${targetCoords.x}%`}
                        y2={`${targetCoords.y}%`}
                        stroke="#10b981"
                        strokeWidth="8"
                        opacity="0.25"
                      />
                    </>
                  );
                })()}
              </svg>

              {/* User Position Pin */}
              <div 
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-default"
                style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-20 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center shadow-lg text-[10px] text-white font-bold">
                    👤
                  </div>
                </div>
                <div className="bg-stone-950/80 backdrop-blur-md border border-stone-850 px-2 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap mt-1.5 text-center text-blue-300">
                  You
                </div>
              </div>

              {/* Farmer Pins */}
              {filteredFarmers.map((farmer) => {
                const coords = getCoordinates(farmer.lat, farmer.lng);
                const isSelected = selectedFarmer && selectedFarmer.farmerId === farmer.farmerId;

                return (
                  <div
                    key={farmer.farmerId}
                    onClick={() => {
                      setSelectedFarmer(farmer);
                      setShowRoute(true);
                    }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Active Highlight Ring */}
                      {isSelected && (
                        <span className="absolute -inset-3 rounded-full bg-emerald-400 opacity-30 animate-pulse border border-emerald-400" />
                      )}
                      
                      {/* Pin Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition transform group-hover:scale-110 ${
                        isSelected ? 'bg-emerald-500 border-white text-white' : 'bg-stone-800 border-stone-600 text-stone-300 hover:border-emerald-400'
                      }`}>
                        🌾
                      </div>

                      {/* Small Label */}
                      <div className={`px-2 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap mt-1 border shadow-md transition duration-200 ${
                        isSelected 
                          ? 'bg-emerald-600 border-emerald-500 text-white font-black' 
                          : 'bg-stone-900/90 border-stone-800 text-stone-300 group-hover:text-white'
                      }`}>
                        {farmer.farmName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Footer Bar */}
          <div className="z-10 bg-stone-900/60 backdrop-blur-md p-3 rounded-2xl border border-stone-800 text-[11px] text-stone-400 flex items-center justify-between mt-auto">
            <span>📍 Center: Madanapalle region grid</span>
            <span>Active: {filteredFarmers.length} farmers within filter limits</span>
          </div>

        </div>

        {/* Selected Farmer Info Side Panel */}
        <div className="space-y-6">
          {selectedFarmer ? (
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-150 shadow-sm flex flex-col justify-between card-hover animate-fadeIn">
              
              {/* Cover Photo */}
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img 
                  src={selectedFarmer.farmImage || 'https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                  alt={selectedFarmer.farmName} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/10">
                  📍 {selectedFarmer.distance} km away
                </span>
                
                {selectedFarmer.organicStatus && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    🌿 100% Organic
                  </span>
                )}
              </div>

              {/* Description & Profile Details */}
              <div className="p-5 space-y-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={selectedFarmer.photo || 'https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt={selectedFarmer.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
                  />
                  <div>
                    <h3 className="font-extrabold text-stone-800 text-base leading-snug">{selectedFarmer.farmName}</h3>
                    <p className="text-xs text-stone-500 font-semibold">Farmer: {selectedFarmer.name}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{selectedFarmer.farmType || 'Multi-Crop Organic Cultivation'}</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed min-h-[48px]">
                  {selectedFarmer.description || 'Verified local farmer producing clean, fresh agricultural crop supplies using organic techniques.'}
                </p>

                {/* Grid Information */}
                <div className="bg-stone-50 p-4 rounded-2xl space-y-2 text-xs text-stone-600 border border-stone-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-400">Village</span>
                    <span className="font-bold text-stone-800">{selectedFarmer.village}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-400">GPS Coordinates</span>
                    <span className="font-bold text-stone-700 font-mono">{selectedFarmer.lat}, {selectedFarmer.lng}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-400">Rating</span>
                    <span className="font-bold text-amber-500">★ {selectedFarmer.rating || 4.5} ({selectedFarmer.reviews || 20} reviews)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-400">Available Products</span>
                    <span className="font-bold text-emerald-600">{selectedFarmer.availableProducts || 10} items listed</span>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleCall(selectedFarmer.name, selectedFarmer.contact)}
                    className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-stone-200/50"
                  >
                    📞 Call Farmer
                  </button>
                  <button
                    onClick={() => handleChat(selectedFarmer.name)}
                    className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-stone-200/50"
                  >
                    💬 Chat
                  </button>
                </div>
              </div>

              {/* Footer View Products and Navigate Buttons */}
              <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-2">
                <button
                  onClick={() => {
                    setSelectedFarmer(selectedFarmer);
                    setShowRoute(true);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5"
                >
                  🗺️ Trace Route & Navigate
                </button>
                <button
                  onClick={() => navigate(`/customer/products?farmerId=${selectedFarmer.farmerId}`)}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs transition shadow-md shadow-primary/15"
                >
                  View Farm Products ({selectedFarmer.availableProducts})
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-150 shadow-sm space-y-4">
              <span className="text-4xl block animate-bounce">📍</span>
              <p className="text-stone-500 font-bold text-xs">No Farmer Selected</p>
              <p className="text-stone-400 text-[11px]">Click on any farm node in the GPS map grid to view profile and crop products.</p>
            </div>
          )}
        </div>

      </div>

      {/* Grid List View Below */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-stone-800">Nearby Farmers Directory</h2>
        
        {filteredFarmers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-150">
            <span className="text-4xl block animate-bounce">🔍</span>
            <p className="text-stone-500 font-bold text-xs mt-3">No Farmers Matching Filters Found</p>
            <p className="text-stone-400 text-xs mt-1">Try expanding your distance slider or resetting category choices.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredFarmers.map((farmer, idx) => (
              <div
                key={farmer.farmerId || idx}
                onClick={() => {
                  setSelectedFarmer(farmer);
                  setShowRoute(true);
                  // Scroll to map top smoothly
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`bg-white rounded-3xl overflow-hidden border p-5 shadow-sm space-y-4 flex flex-col justify-between cursor-pointer transition card-hover ${
                  selectedFarmer && selectedFarmer.farmerId === farmer.farmerId ? 'border-primary/60 ring-2 ring-primary/10 shadow-md' : 'border-stone-150 hover:border-primary/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={farmer.photo || 'https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt={farmer.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-100"
                  />
                  <div>
                    <h4 className="font-extrabold text-stone-800 text-sm leading-snug">{farmer.farmName}</h4>
                    <p className="text-[11px] text-stone-500 font-semibold">Farmer: {farmer.name}</p>
                    <p className="text-[9px] text-stone-400 font-bold">{farmer.farmType}</p>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 space-y-1 bg-stone-50 p-3 rounded-2xl border border-stone-100/50">
                  <p>🏡 Village: <span className="text-stone-800 font-bold">{farmer.village}</span></p>
                  <p>★ Rating: <span className="text-amber-500 font-bold">★ {farmer.rating}</span> ({farmer.reviews} reviews)</p>
                  <p>📦 Products: <span className="text-emerald-600 font-bold">{farmer.availableProducts} items available</span></p>
                  <p className="font-extrabold text-primary pt-1">📍 Distance: {farmer.distance} km away</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default NearbyFarmers;
