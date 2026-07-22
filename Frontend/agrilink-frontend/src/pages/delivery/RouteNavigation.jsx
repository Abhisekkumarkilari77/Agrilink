import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';

const RouteNavigation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const list = await deliveryService.getAssignedOrders();
        const found = list.find(o => o.id === id);
        setOrder(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 max-w-xl mx-auto shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Live GPS Route Map</h2>
        <button onClick={() => navigate(-1)} className="text-xs font-bold text-gray-500 hover:underline">
          ← Back
        </button>
      </div>

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load Leaflet CSS & JS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !order || !window.L) return;

    // Initialize Leaflet Map centered around Bengaluru (or mock locations)
    const map = window.L.map('leaflet-map-container').setView([12.9716, 77.5946], 12);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add Driver Marker (Bengaluru Center)
    const driverIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: "<div class='w-7 h-7 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-[10px] border border-white shadow-md'>🚗</div>",
      iconSize: [28, 28]
    });
    window.L.marker([12.9716, 77.5946], { icon: driverIcon }).addTo(map).bindPopup('My Location (Driver)').openPopup();

    // Add Farm Marker (Random offset)
    const farmIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: "<div class='w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-[10px] border border-white shadow-md'>🏡</div>",
      iconSize: [28, 28]
    });
    window.L.marker([12.9916, 77.6146], { icon: farmIcon }).addTo(map).bindPopup(order.farmName || 'Farmer Pickup Location');

    // Add Customer Marker (Random offset)
    const custIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: "<div class='w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] border border-white shadow-md'>👤</div>",
      iconSize: [28, 28]
    });
    window.L.marker([12.9516, 77.5746], { icon: custIcon }).addTo(map).bindPopup(order.customerName || 'Customer Delivery Location');

    // Draw route line
    const latlngs = [
      [12.9716, 77.5946],
      [12.9916, 77.6146],
      [12.9516, 77.5746]
    ];
    window.L.polyline(latlngs, { color: '#f59e0b', weight: 4, dashArray: '8, 8' }).addTo(map);

    return () => {
      map.remove();
    };
  }, [mapLoaded, order]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 max-w-xl mx-auto shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Live GPS Route Map</h2>
        <button onClick={() => navigate(-1)} className="text-xs font-bold text-gray-500 hover:underline">
          ← Back
        </button>
      </div>

      {/* Real Interactive Leaflet Map Container */}
      <div id="leaflet-map-container" className="w-full h-80 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-inner relative z-0">
        {!mapLoaded && <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400">Loading Map View...</span>}
      </div>

      {/* Navigation directions */}
      <div className="p-4 bg-gray-50 rounded-2xl text-xs space-y-2 border">
        <p className="font-bold text-gray-800">Trip Statistics</p>
        <p><span className="text-gray-400">Total Distance:</span> <span className="font-bold text-gray-700">{order?.distance}</span></p>
        <p><span className="text-gray-400">Est Time to Location:</span> <span className="font-bold text-green-700">{order?.eta}</span></p>
        <p><span className="text-gray-400">Traffic Condition:</span> <span className="font-bold text-gray-700">Moderate Traffic (Alternate Routes available)</span></p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => alert(`Calling Farmer: ${order?.farmerContact}`)} className="py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-xs transition">
          📞 Call Farmer
        </button>
        <button onClick={() => alert(`Calling Customer: ${order?.customerContact}`)} className="py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-xs transition">
          📞 Call Customer
        </button>
      </div>
    </div>
  );
};

export default RouteNavigation;
