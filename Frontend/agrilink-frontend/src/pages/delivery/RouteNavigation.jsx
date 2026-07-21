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

      {/* Mock Map Layout */}
      <div className="w-full h-64 bg-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-200">
        {/* Simple mock map drawing */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Custom mock map details */}
        <div className="absolute top-8 left-12 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-xs shadow">Driver</div>
          <span className="text-[9px] font-bold text-gray-500 mt-1">My Location</span>
        </div>

        <div className="absolute top-24 right-16 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shadow">Farm</div>
          <span className="text-[9px] font-bold text-gray-500 mt-1">{order?.farmName}</span>
        </div>

        <div className="absolute bottom-12 left-24 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow">Cust</div>
          <span className="text-[9px] font-bold text-gray-500 mt-1">{order?.customerName}</span>
        </div>

        {/* Drawn mock paths */}
        <div className="w-24 h-1 border-t-2 border-dashed border-gray-400 absolute top-16 left-20 rotate-12"></div>
        <div className="w-32 h-1 border-t-2 border-dashed border-gray-400 absolute top-36 right-24 -rotate-45"></div>

        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10">Google Maps Mock View</span>
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
