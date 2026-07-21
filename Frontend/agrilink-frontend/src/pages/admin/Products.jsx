import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleHide = async (id) => {
    try {
      await adminService.hideProduct(id);
      setMessage('Product visibility updated.');
      fetchProducts();
    } catch (err) {
      alert('Failed to hide product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete product listing permanently?')) {
      try {
        await adminService.deleteProduct(id);
        setMessage('Product deleted.');
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product.');
      }
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
    <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Crop Moderation Catalog ({products.length})</h2>
      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold text-center">{message}</div>}

      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left text-gray-500">
          <thead className="text-[10px] uppercase text-gray-400 bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-semibold">Crop Name</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Price</th>
              <th className="px-6 py-3 font-semibold">Stock</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/20 transition">
                <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">₹{p.price} / kg</td>
                <td className="px-6 py-4">{p.quantity} kg</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${p.status === 'Hidden' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleHide(p.id)} className="px-2.5 py-1.5 border hover:bg-gray-100 rounded-lg font-bold text-gray-700">
                    {p.status === 'Hidden' ? 'Show Crop' : 'Hide Crop'}
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold border border-red-200">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
