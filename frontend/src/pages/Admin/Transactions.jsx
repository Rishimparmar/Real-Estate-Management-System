import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const TransactionsList = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/admin/transactions', config);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/admin/transactions/${id}/status`, { status }, config);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="admin-card">
      <h2 style={{ marginBottom: '24px' }} className="text-gradient-blue">Transactions</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Property</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>#{t.id}</td>
                <td>{t.user?.name || 'Unknown'}</td>
                <td>{t.property?.title || 'Unknown'}</td>
                <td>${t.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${t.status}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <select 
                    className="select-input" 
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;
