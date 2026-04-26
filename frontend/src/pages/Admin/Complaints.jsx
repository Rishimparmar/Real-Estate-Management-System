import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ComplaintsList = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/admin/complaints', config);
      setComplaints(res.data);
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
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/admin/complaints/${id}/resolve`, {}, config);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading complaints...</div>;

  return (
    <div className="admin-card">
      <h2 style={{ marginBottom: '24px' }} className="text-gradient-blue">Complaints Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td>{c.user?.name || 'Unknown'}</td>
                <td>{c.subject}</td>
                <td>{c.description}</td>
                <td>
                  <span className={`status-badge status-${c.status}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  {c.status === 'open' && (
                    <button className="action-btn success" onClick={() => handleResolve(c.id)}>
                      Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No complaints found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintsList;
