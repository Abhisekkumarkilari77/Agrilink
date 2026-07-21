import React, { useState, useEffect } from 'react';
import farmerService from '../../../services/farmerService';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
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
    fetchInventory();
  }, []);

  const handleStockUpdate = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await farmerService.updateProduct(productId, { quantity: newStock });
      fetchInventory();
    } catch (err) {
      alert('Failed to update stock.');
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
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Crop Inventory Stock</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs uppercase text-gray-400 bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-semibold">Crop Name</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Current Stock</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Quick Stock Modifiers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {products.map((p) => {
              const isLow = p.quantity <= 10 && p.quantity > 0;
              const isOut = p.quantity === 0;

              return (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4">{p.quantity} kg</td>
                  <td className="px-6 py-4">
                    {isOut && <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">Out of Stock</span>}
                    {isLow && <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 animate-pulse">Low Stock Warning</span>}
                    {!isOut && !isLow && <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">In Stock</span>}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleStockUpdate(p.id, p.quantity, -10)}
                      className="px-3 py-1.5 border hover:bg-gray-100 text-xs font-semibold rounded-lg"
                    >
                      -10 kg
                    </button>
                    <button
                      onClick={() => handleStockUpdate(p.id, p.quantity, 10)}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      +10 kg
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
