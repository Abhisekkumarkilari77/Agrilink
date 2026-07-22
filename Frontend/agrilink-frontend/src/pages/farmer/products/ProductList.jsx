import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductImage from '../../../components/common/ProductImage';
import farmerService from '../../../services/farmerService';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await farmerService.getProducts();
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

  const handleDelete = async (prodId, prodName) => {
    // Check pending orders constraint
    const orders = JSON.parse(localStorage.getItem('agrilink_mock_orders') || '[]');
    const hasPendingOrders = orders.some(o => 
      (o.status === 'PENDING' || o.status === 'ACCEPTED') && 
      o.items.some(item => item.name === prodName)
    );

    if (hasPendingOrders) {
      alert(`Delete Disabled.\nReason: Pending orders exist for "${prodName}".`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${prodName}"?`)) {
      try {
        await farmerService.deleteProduct(prodId);
        alert('Product deleted.');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">My Crop Listings ({products.length})</h2>
        <button
          onClick={() => navigate('/farmer/products/add')}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-150 p-6 flex flex-col items-center justify-center space-y-2">
          <p className="font-bold text-base text-gray-700">No Crop Listings Found</p>
          <p className="text-xs text-gray-400">You haven't listed any crops yet.</p>
          <p className="text-xs text-gray-400">Click "Add Product" to list your first crop.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-sm flex flex-col justify-between">
              <div className="h-40 bg-gray-100 relative">
                <ProductImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-green-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {p.category}
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-gray-800 text-base leading-tight">{p.name}</h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Available Stock: <span className="font-bold text-gray-700">{p.quantity} kg</span></p>
                  <p className="text-xs text-gray-500">Price: <span className="font-bold text-gray-700">₹{p.price}/kg</span></p>
                  <p className="text-xs text-gray-500">Orders Received: <span className="font-bold text-primary">{p.ordersReceived}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <button
                    onClick={() => navigate(`/farmer/products/edit/${p.id}`)}
                    className="py-2 border rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 transition"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
