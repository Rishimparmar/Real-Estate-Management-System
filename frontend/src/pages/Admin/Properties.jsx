import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PropertiesList = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/admin/properties', config);
      setProperties(res.data.properties);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/admin/properties/${id}/status`, { status }, config);
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/admin/properties/${id}`, config);
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <div className="admin-card">
      <h2 style={{ marginBottom: '24px' }} className="text-gradient-blue">Property Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.owner?.name || 'Unknown'}</td>
                <td>${p.price.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${p.status || 'pending'}`}>
                    {p.status || 'pending'}
                  </span>
                </td>
                <td>
                  {p.status !== 'approved' && (
                    <button className="action-btn success" onClick={() => handleStatusChange(p.id, 'approved')}>Approve</button>
                  )}
                  {p.status !== 'rejected' && (
                    <button className="action-btn danger" onClick={() => handleStatusChange(p.id, 'rejected')}>Reject</button>
                  )}
                  <button className="action-btn danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No properties found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertiesList;
