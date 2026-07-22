import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import customerService from '../../../services/customerService';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  // Add / Edit Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [formData, setFormData] = useState({
    name: 'Home',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const prof = await customerService.getProfile();
      const addrs = await customerService.getAddresses();
      setProfile(prof);
      setAddresses(addrs);
      setName(prof.name || '');
      setMobile(prof.mobile || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await customerService.updateProfile({ name, mobile });
      setMessage('Profile updated successfully!');
      loadData();
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddrId) {
        await customerService.updateAddress(editingAddrId, formData);
      } else {
        await customerService.addAddress(formData);
      }
      setShowAddressForm(false);
      setEditingAddrId(null);
      resetForm();
      const updatedAddrs = await customerService.getAddresses();
      setAddresses(updatedAddrs);
    } catch (err) {
      alert('Failed to save address.');
    }
  };

  const handleEditClick = (addr) => {
    setEditingAddrId(addr.id);
    setFormData({
      name: addr.name || 'Home',
      houseNo: addr.houseNo || '',
      street: addr.street || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: addr.isDefault || false
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddrs = await customerService.deleteAddress(id);
      setAddresses(updatedAddrs);
    }
  };

  const handleSetDefault = async (id) => {
    const updatedAddrs = await customerService.setDefaultAddress(id);
    setAddresses(updatedAddrs);
  };

  const resetForm = () => {
    setFormData({
      name: 'Home',
      houseNo: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Left: Profile Info */}
      <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-sm space-y-6 md:col-span-1">
        <div className="flex items-center space-x-4 border-b pb-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-black">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="font-bold text-stone-800 text-base">{name || 'Customer'}</h2>
            <p className="text-xs text-stone-400 font-medium">{profile?.email}</p>
          </div>
        </div>

        {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold">{message}</div>}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={profile?.email || ''}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-stone-100 bg-stone-50 text-stone-400 text-sm font-semibold focus:outline-none cursor-not-allowed"
            />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-primary/20">
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Right: Saved Addresses with Dynamic Count */}
      <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-sm space-y-6 md:col-span-2">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-800">Delivery Address Book</h3>
            <p className="text-xs text-stone-400 font-semibold mt-0.5">
              {addresses.length === 0 ? '0 Addresses' : `${addresses.length} ${addresses.length === 1 ? 'Address' : 'Addresses'} Saved`}
            </p>
          </div>
          <button
            onClick={() => {
              if (showAddressForm) {
                setShowAddressForm(false);
                setEditingAddrId(null);
                resetForm();
              } else {
                resetForm();
                setEditingAddrId(null);
                setShowAddressForm(true);
              }
            }}
            className="text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl transition"
          >
            {showAddressForm ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {/* Address Form (Add / Edit) */}
        {showAddressForm && (
          <form onSubmit={handleSaveAddress} className="p-5 border border-dashed border-primary/40 rounded-2xl space-y-4 bg-emerald-50/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              {editingAddrId ? 'Edit Address' : 'Add New Delivery Address'}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Label</label>
                <select
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">House / Flat No.</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 301, Sunshine Apts"
                  value={formData.houseNo}
                  onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Street / Area</label>
              <input
                type="text"
                placeholder="e.g. 1st Main, Indiranagar"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">City</label>
                <input
                  type="text"
                  placeholder="Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">State</label>
                <input
                  type="text"
                  placeholder="Karnataka"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Pincode</label>
                <input
                  type="text"
                  placeholder="560001"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="accent-primary"
              />
              <label htmlFor="isDefault" className="text-xs text-stone-600 font-semibold cursor-pointer">
                Set as default delivery address
              </label>
            </div>
            <div className="flex space-x-3 pt-1">
              <button type="submit" className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition shadow-sm">
                {editingAddrId ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddrId(null);
                  resetForm();
                }}
                className="px-4 py-2.5 bg-stone-200 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Address List / Empty State */}
        {addresses.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-3xl space-y-3 bg-stone-50/50">
            <div className="text-4xl">📍</div>
            <h4 className="text-sm font-bold text-stone-800">No addresses found</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Add your first delivery address to receive farm-fresh products directly to your doorstep.
            </p>
            <button
              onClick={() => setShowAddressForm(true)}
              className="mt-2 inline-block px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-dark transition"
            >
              + Add Address Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 border rounded-2xl flex justify-between items-start transition ${
                  addr.isDefault ? 'border-primary bg-primary/5 shadow-sm' : 'border-stone-200 bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-800 text-sm">{addr.name}</span>
                    {addr.isDefault && (
                      <span className="bg-primary/20 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {addr.houseNo}, {addr.street}{addr.landmark ? `, Near ${addr.landmark}` : ''}, {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-3 pl-3">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-bold text-stone-500 hover:text-primary transition"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(addr)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
