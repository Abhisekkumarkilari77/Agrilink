import React, { useState } from 'react';
import adminService from '../../services/adminService';

const Settings = () => {
  const [form, setForm] = useState(adminService.getSettings());
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    adminService.updateSettings(form);
    setMessage('Platform configurations saved successfully.');
  };

  return (
    <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto border border-gray-150 shadow-sm space-y-6">
      <h2 className="text-2xl font-black text-gray-800">Global Platform Configurations</h2>
      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold text-center">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm font-semibold text-gray-500">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Default Delivery Fee (₹)</label>
          <input
            type="number"
            value={form.deliveryCharge}
            onChange={e => setForm({ ...form, deliveryCharge: Number(e.target.value) })}
            className="w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">Platform Marketplace Commission (%)</label>
          <input
            type="number"
            value={form.commission}
            onChange={e => setForm({ ...form, commission: Number(e.target.value) })}
            className="w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">GST Percentage Tax Rate (%)</label>
          <input
            type="number"
            value={form.gst}
            onChange={e => setForm({ ...form, gst: Number(e.target.value) })}
            className="w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">Maximum Logistics Delivery Radius (KM)</label>
          <input
            type="number"
            value={form.maxRadius}
            onChange={e => setForm({ ...form, maxRadius: Number(e.target.value) })}
            className="w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition shadow-sm">
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default Settings;
