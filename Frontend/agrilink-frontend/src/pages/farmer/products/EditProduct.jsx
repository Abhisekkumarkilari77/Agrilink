import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import farmerService from '../../../services/farmerService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'Vegetables',
    description: '',
    price: '',
    quantity: '',
    image: '',
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const prods = await farmerService.getProducts();
        const p = prods.find(item => item.id === id);
        if (p) {
          setForm(p);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(form.price) <= 0 || Number(form.quantity) <= 0) {
      setError('Price and quantity must be greater than 0.');
      return;
    }

    setSaving(true);
    try {
      await farmerService.updateProduct(id, form);
      alert('Product updated successfully!');
      navigate('/farmer/products');
    } catch (err) {
      setError('Failed to update product.');
    } finally {
      setSaving(false);
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
    <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto border border-gray-155 shadow-sm space-y-6">
      <h2 className="text-2xl font-black text-gray-800">Edit Crop Listing</h2>
      {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-bold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Product Name</label>
          <input
            type="text" placeholder="Product name" required
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
            placeholder="Product details..." required
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Price (₹ per KG)</label>
            <input
              type="number" placeholder="Price" required
              value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Available Quantity</label>
            <input
              type="number" placeholder="Quantity" required
              value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700 transition">
            {saving ? 'Saving...' : 'Save Updates'}
          </button>
          <button type="button" onClick={() => navigate('/farmer/products')} className="px-6 py-2.5 border rounded-xl font-bold text-xs hover:bg-gray-50 text-gray-700 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
