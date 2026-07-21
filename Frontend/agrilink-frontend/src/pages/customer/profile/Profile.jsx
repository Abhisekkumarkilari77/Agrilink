import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import customerService from '../../../services/customerService';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  // Add Address Form
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', details: '' });

  const loadProfile = async () => {
    try {
      const data = await customerService.getProfile();
      setProfile(data);
      setName(data.name);
      setMobile(data.mobile);
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
      await customerService.updateProfile({ name, mobile });
      setMessage('Profile updated successfully!');
      loadProfile();
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Left: Edit Info */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-6 md:col-span-1">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Personal Info</h3>
        {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold">{message}</div>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={profile?.email}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm font-semibold focus:outline-none cursor-not-allowed"
            />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition">
            Save Changes
          </button>
        </form>
      </div>

      {/* Right: Address Book */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-6 md:col-span-2">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-bold text-gray-800">Saved Addresses</h3>
          <button
            onClick={() => setShowAddAddr(!showAddAddr)}
            className="text-xs font-bold text-primary hover:underline"
          >
            {showAddAddr ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {showAddAddr && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Address added to book.');
              setShowAddAddr(false);
            }}
            className="p-4 border border-dashed border-gray-200 rounded-2xl space-y-3 bg-gray-50/50"
          >
            <input type="text" placeholder="Address Label (e.g. Home, Office)" required className="w-full px-3 py-2 border rounded-xl text-xs" />
            <textarea placeholder="Complete Address Details" required className="w-full px-3 py-2 border rounded-xl text-xs h-20" />
            <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition">
              Save Address
            </button>
          </form>
        )}

        <div className="space-y-4">
          {profile?.addresses.map((addr) => (
            <div key={addr.id} className="p-4 border border-gray-150 rounded-2xl flex justify-between items-start">
              <div>
                <span className="font-bold text-gray-800 text-sm">{addr.name}</span>
                <p className="text-xs text-gray-500 mt-1">
                  {addr.houseNo}, {addr.street}, {addr.landmark}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
              <button onClick={() => alert('Address removed.')} className="text-xs font-semibold text-red-500 hover:underline pl-3">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
