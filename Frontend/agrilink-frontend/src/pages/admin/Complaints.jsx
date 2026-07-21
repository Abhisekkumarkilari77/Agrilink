import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchComplaints = async () => {
    try {
      const data = await adminService.getComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (id) => {
    try {
      await adminService.resolveComplaint(id);
      setMessage('Dispute marked as RESOLVED.');
      fetchComplaints();
    } catch (err) {
      alert('Failed to resolve complaint.');
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
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Complaints & Dispute Desk</h2>
      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold text-center">{message}</div>}

      <div className="space-y-4 text-xs font-semibold text-gray-600">
        {complaints.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No raised complaints found.</p>
        ) : (
          complaints.map(c => (
            <div key={c.id} className="p-5 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/20 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-gray-800">{c.title}</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${c.type === 'CUSTOMER' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    {c.type} ISSUE
                  </span>
                </div>
                <p className="text-gray-500 font-semibold">{c.detail}</p>
                <p className="text-[10px] text-gray-400 font-bold">Related Order ID: {c.orderId}</p>
              </div>

              <div>
                {c.status === 'PENDING' ? (
                  <button onClick={() => handleResolve(c.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition shadow-sm">
                    Mark Resolved
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-xl font-bold text-[10px]">
                    ✓ RESOLVED
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Complaints;
