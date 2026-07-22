import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import farmerService from '../../../services/farmerService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'Vegetables',
    description: '',
    price: '',
    quantity: '',
    image: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const validateAndSetFile = (file) => {
    setFileError('');
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file type. Allowed formats: JPG, JPEG, PNG, WEBP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File is too large. Maximum size allowed is 5 MB.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFileError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Crop image is required.');
      return;
    }

    if (Number(form.price) <= 0 || Number(form.quantity) <= 0) {
      setError('Price and quantity must be greater than 0.');
      return;
    }

    setLoading(true);
    try {
      const uploadRes = await farmerService.uploadProductImage(selectedFile);
      const imageUrl = uploadRes.imageUrl;

      const finalForm = { ...form, image: imageUrl };
      await farmerService.addProduct(finalForm);
      alert('Product listed successfully!');
      navigate('/farmer/products');
    } catch (err) {
      setError('Failed to list product or upload image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto border border-gray-150 shadow-sm space-y-6">
      <h2 className="text-2xl font-black text-gray-800">Add Crop Listing</h2>
      {error && <div className="p-3 bg-red-50 text-red-655 text-red-600 text-xs rounded-lg text-center font-bold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Product Name</label>
          <input
            type="text" placeholder="e.g. Organic Broccoli" required
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Category</label>
          <select
            value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl text-gray-500"
          >
            {['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Flowers', 'Spices'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Description</label>
          <textarea
            placeholder="Product details, freshness, etc." required
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Price (₹ per KG / Unit)</label>
            <input
              type="number" placeholder="e.g. 45" required
              value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Available Quantity</label>
            <input
              type="number" placeholder="e.g. 100" required
              value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Crop Image *</label>
          
          {fileError && <div className="mb-2 text-xs text-red-600 font-semibold">{fileError}</div>}
          
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('crop-image-input').click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
                dragActive ? 'border-green-600 bg-green-50/30' : 'border-gray-300 hover:border-green-500 bg-gray-50'
              }`}
            >
              <input
                id="crop-image-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-xs font-bold text-gray-500">Drag & drop your crop image here, or <span className="text-green-600 underline">browse</span></p>
                <p className="text-[10px] text-gray-400">Supports JPG, JPEG, PNG, WEBP (Max 5 MB)</p>
              </div>
            </div>
          ) : (
            <div className="relative border rounded-2xl p-2 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border" />
                <div>
                  <p className="text-xs font-bold text-gray-700">Image Selected</p>
                  <p className="text-[10px] text-gray-400">Ready to upload</p>
                </div>
              </div>
              <div className="flex space-x-2 mr-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('crop-image-input-change').click()}
                  className="px-3 py-1.5 bg-white border rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100"
                >
                  Remove
                </button>
                <input
                  id="crop-image-input-change"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700 transition">
            {loading ? 'Processing...' : 'List Crop'}
          </button>
          <button type="button" onClick={() => navigate('/farmer/products')} className="px-6 py-2.5 border rounded-xl font-bold text-xs hover:bg-gray-50 text-gray-700 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
