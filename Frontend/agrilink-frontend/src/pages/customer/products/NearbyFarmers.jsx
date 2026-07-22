import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../../../services/customerService';

const NearbyFarmers = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [sortBy, setSortBy] = useState('distance');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const data = await customerService.getNearbyFarmers();
        setFarmers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const sortedFarmers = useMemo(() => {
    let result = [...farmers];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(f =>
        f.name.toLowerCase().includes(term) ||
        f.farmName.toLowerCase().includes(term) ||
        f.district.toLowerCase().includes(term) ||
        f.village.toLowerCase().includes(term)
      );
    }

    if (sortBy === 'distance') {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'products') {
      result.sort((a, b) => b.availableProducts - a.availableProducts);
    }

    return result;
  }, [farmers, search, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-sm space-y-4 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-stone-800 flex items-center gap-2">
              <span>🌾</span> Nearby Local Farmers
            </h2>
            <p className="text-xs text-stone-400 font-semibold mt-0.5">
              Direct farm-to-door delivery from verified local organic growers near your address.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-stone-100 p-1 rounded-2xl flex items-center">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  viewMode === 'list' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                📋 List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  viewMode === 'map' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                🗺️ Map View
              </button>
            </div>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="distance">Sort by Distance (Nearest)</option>
              <option value="rating">Sort by Rating (Highest)</option>
              <option value="products">Sort by Product Count</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search farmer name, farm, village, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
        </div>
      </div>

      {/* Content: MAP VIEW or LIST VIEW */}
      {loading ? (
        <div className="flex justify-center py-24">
          <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : viewMode === 'map' ? (
        /* Map View Component */
        <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xl relative min-h-[480px] overflow-hidden space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-center z-10">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live Interactive GPS Map
            </span>
            <span className="text-xs text-stone-400 font-medium">Showing {sortedFarmers.length} nearby farm locations</span>
          </div>

          {/* Visual Grid Map Representation */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            {sortedFarmers.map((farmer, idx) => (
              <div
                key={farmer.farmerId || idx}
                onClick={() => navigate(`/customer/products?farmerId=${farmer.farmerId}`)}
                className="bg-stone-800/90 border border-stone-700/80 hover:border-primary p-4 rounded-2xl space-y-3 cursor-pointer transition card-hover"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    🌾
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{farmer.farmName}</h4>
                    <p className="text-[11px] text-stone-400">By {farmer.name}</p>
                  </div>
                </div>
                <div className="text-[11px] text-stone-300 space-y-1 bg-stone-900/60 p-3 rounded-xl">
                  <p>📍 GPS: <span className="text-emerald-400 font-mono">{farmer.lat}, {farmer.lng}</span></p>
                  <p>🏡 {farmer.village}, {farmer.district} - {farmer.pincode}</p>
                  <p className="font-bold text-amber-400">⚡ Distance: {farmer.distance} km away</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-stone-400 pt-2 border-t border-stone-800">
            Click on any farm pin above to view their available harvest products.
          </div>
        </div>
      ) : (
        /* List View */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFarmers.map((farmer, idx) => (
            <div
              key={farmer.farmerId || idx}
              className="bg-white rounded-3xl overflow-hidden border border-stone-150 shadow-sm flex flex-col justify-between card-hover animate-fadeIn"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Farm Cover Image */}
              <div className="relative h-44 bg-stone-100 overflow-hidden">
                <img src={farmer.farmImage} alt={farmer.farmName} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  📍 {farmer.distance} km away
                </span>
                {farmer.organicStatus && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    🌿 100% Organic
                  </span>
                )}
              </div>

              {/* Farmer Info */}
              <div className="p-5 flex-1 space-y-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={farmer.photo}
                    alt={farmer.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
                  />
                  <div>
                    <h3 className="font-extrabold text-stone-800 text-base leading-snug">{farmer.farmName}</h3>
                    <p className="text-xs text-stone-500 font-semibold">Farmer: {farmer.name}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{farmer.farmType}</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {farmer.description}
                </p>

                <div className="bg-stone-50 p-3 rounded-2xl space-y-1.5 text-xs text-stone-600 border border-stone-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-400">Location</span>
                    <span className="font-bold text-stone-800">{farmer.village}, {farmer.district} ({farmer.pincode})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-400">Rating</span>
                    <span className="font-bold text-amber-500">★ {farmer.rating} ({farmer.reviews} reviews)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-400">Products</span>
                    <span className="font-bold text-emerald-600">{farmer.availableProducts} Items Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-400">Contact</span>
                    <span className="font-bold text-stone-700">📞 {farmer.contact}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => navigate(`/customer/products?farmerId=${farmer.farmerId}`)}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs transition shadow-md shadow-primary/15"
                >
                  View Farm Products ({farmer.availableProducts})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyFarmers;
