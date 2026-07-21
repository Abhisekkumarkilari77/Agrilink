import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id) => {
    if (window.confirm('Suspend user account?')) {
      try {
        await adminService.blockUser(id);
        alert('Account suspended.');
        fetchUsers();
      } catch (err) {
        alert('Failed to suspend account.');
      }
    }
  };

  const handleUnblock = async (id) => {
    try {
      await adminService.unblockUser(id);
      alert('Account activated.');
      fetchUsers();
    } catch (err) {
      alert('Failed to activate account.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user account permanently?')) {
      try {
        await adminService.deleteUser(id);
        alert('Account deleted.');
        fetchUsers();
      } catch (err) {
        alert('Failed to delete account.');
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

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">User Moderation Desk ({filtered.length})</h2>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-xl text-xs flex-1 sm:w-48"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-xl text-xs text-gray-500"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers</option>
            <option value="FARMER">Farmers</option>
            <option value="DELIVERY">Delivery Partners</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left text-gray-500">
          <thead className="text-[10px] uppercase text-gray-400 bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-semibold">User Details</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Moderation Triggers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/20 transition">
                <td className="px-6 py-4 font-bold text-gray-800">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-bold">{u.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${u.status === 'APPROVED' || u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : u.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {u.status === 'SUSPENDED' ? (
                    <button onClick={() => handleUnblock(u.id)} className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold">Unblock</button>
                  ) : (
                    <button onClick={() => handleBlock(u.id)} className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold border border-red-200">Suspend</button>
                  )}
                  <button onClick={() => handleDelete(u.id)} className="px-2.5 py-1.5 border hover:bg-gray-100 rounded-lg font-bold text-gray-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
