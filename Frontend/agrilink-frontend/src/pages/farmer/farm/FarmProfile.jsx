import React, { useState, useEffect } from 'react';
import farmerService from '../../../services/farmerService';

const FarmProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  const loadProfile = async () => {
    try {
      const data = await farmerService.getFarmProfile();
      setProfile(data);
      setDescription(data.farmDesc);
      setHours(data.workingHours);
      setContact(data.contact);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await farmerService.updateFarmProfile({
        farmDesc: description,
        workingHours: hours,
        contact: contact
      });
      setMessage('Farm details updated successfully.');
      loadProfile();
    } catch (err) {
      alert('Failed to update details.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Edit Form */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-6 md:col-span-2">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Manage Farm Profile</h3>
        {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold">{message}</div>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Farm Name</label>
              <input type="text" value={profile?.farmName} readOnly className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-400 text-sm rounded-xl cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Farm Type</label>
              <input type="text" value={profile?.farmType} readOnly className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-400 text-sm rounded-xl cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Farm Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm h-32 rounded-2xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Contact Number</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Working Hours</label>
              <input type="text" value={hours} onChange={e => setHours(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-sm" />
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl text-xs hover:bg-green-700 transition">
            Save Farm Settings
          </button>
        </form>
      </div>

      {/* Address & Certificates */}
      <div className="space-y-6">
        {/* Location coordinates */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b pb-3">Location Details</h3>
          <div className="text-xs space-y-2 text-gray-600">
            <p><span className="text-gray-400">Village:</span> <span className="font-bold">{profile?.village}</span></p>
            <p><span className="text-gray-400">District:</span> <span className="font-bold">{profile?.district}</span></p>
            <p><span className="text-gray-400">Pincode:</span> <span className="font-bold">{profile?.pincode}</span></p>
            <div className="border-t pt-3 space-y-2">
              <p className="font-semibold">GPS Coordinates:</p>
              <p className="flex justify-between"><span>Lat:</span> <span className="font-mono">{profile?.lat}</span></p>
              <p className="flex justify-between"><span>Lng:</span> <span className="font-mono">{profile?.lng}</span></p>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b pb-3">Certificates</h3>
          <div className="space-y-2">
            {profile?.certificates.map((cert, idx) => (
              <div key={idx} className="p-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-800 font-semibold">
                ✓ {cert}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmProfile;
