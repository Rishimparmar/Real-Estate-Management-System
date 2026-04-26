import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const UsersList = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/admin/users', config);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/admin/users/${id}/status`, { status }, config);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role }, config);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-card">
      <h2 style={{ marginBottom: '24px' }} className="text-gradient-blue">User Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select 
                    className="select-input" 
                    value={u.role} 
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={u.email === 'realestate123@gmail.com'}
                  >
                    <option value="investor">Investor</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="buyer">Buyer</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge status-${u.status || 'active'}`}>
                    {u.status || 'active'}
                  </span>
                </td>
                <td>
                  {u.email !== 'realestate123@gmail.com' && (
                    <button 
                      className={`action-btn ${u.status === 'blocked' ? 'success' : 'danger'}`}
                      onClick={() => handleStatusChange(u.id, u.status === 'blocked' ? 'active' : 'blocked')}
                    >
                      {u.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
