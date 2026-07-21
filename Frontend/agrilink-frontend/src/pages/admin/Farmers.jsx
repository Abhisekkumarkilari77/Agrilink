import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchFarmers = async () => {
    try {
      const users = await adminService.getUsers();
      // Filter role = FARMER and status = PENDING
      setFarmers(users.filter(u => u.role === 'FARMER' && u.status === 'PENDING'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const users = JSON.parse(localStorage.getItem('agrilink_mock_users') || '[]');
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx].status = 'APPROVED';
        localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
        setMessage('Farmer approved and dashboard activated.');
        fetchFarmers();
      }
    } catch (err) {
      alert('Verification failed.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Provide rejection reason (Incorrect documents / Location mismatch):');
    if (reason) {
      try {
        const users = JSON.parse(localStorage.getItem('agrilink_mock_users') || '[]');
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
          users[idx].status = 'REJECTED';
          users[idx].rejectReason = reason;
          localStorage.setItem('agrilink_mock_users', JSON.stringify(users));
          setMessage('Farmer registration rejected.');
          fetchFarmers();
        }
      } catch (err) {
        alert('Rejection failed.');
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
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Farmer Verification Centre</h2>
      {message && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold text-center">{message}</div>}

      {farmers.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-2xl p-6 text-xs">
          No pending farmer registration approvals.
        </div>
      ) : (
        <div className="space-y-6">
          {farmers.map(f => (
            <div key={f.id} className="p-6 border rounded-2xl space-y-4 bg-gray-50/20 text-xs">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-800">{f.name}</h4>
                  <p className="text-gray-400 mt-0.5">Email: {f.email} | Mobile: {f.mobile}</p>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">PENDING APPROVAL</span>
              </div>

              {/* Document Checklist */}
              <div className="grid sm:grid-cols-2 gap-4 text-gray-600">
                <div className="space-y-1.5 p-3.5 bg-white border rounded-xl">
                  <p className="font-bold text-gray-855 text-gray-800">Farm profile summary</p>
                  <p><span className="text-gray-400">Farm:</span> {f.farmName || 'Valley Organic Greens'}</p>
                  <p><span className="text-gray-400">Address:</span> Devanahalli, Bengaluru Rural</p>
                </div>
                <div className="space-y-1.5 p-3.5 bg-white border rounded-xl">
                  <p className="font-bold text-gray-800">Required Document Checklist</p>
                  <p>✔ Land ownership document</p>
                  <p>✔ Organic certification registry</p>
                  <p>✔ Aadhaar identity matches profile mobile</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => handleApprove(f.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Approve Registration
                </button>
                <button
                  onClick={() => handleReject(f.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold border border-red-200 transition"
                >
                  Reject & request review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Farmers;
