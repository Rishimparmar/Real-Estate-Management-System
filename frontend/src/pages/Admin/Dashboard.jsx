import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Users, Home, CreditCard, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    stats: { 
      totalUsers: 0, 
      activeListings: 0, 
      soldProperties: 0, 
      pendingComplaints: 0,
      totalRevenue: 0,
      totalTransactions: 0
    },
    monthlySales: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.token) return;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get('http://localhost:5000/api/admin/dashboard', config);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.token]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger-color)' }}>{error}</div>;

  const chartData = data.monthlySales.map(m => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return { name: monthNames[m.id - 1] || 'Unknown', amount: m.totalAmount };
  });

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '1.8rem' }} className="text-gradient-blue">Dashboard Overview</h2>
      
      <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', display: 'grid', gap: '20px', marginBottom: '32px' }}>
        <div className="admin-card stat-card">
          <div className="stat-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}><DollarSign /></div>
          <div className="stat-info">
            <h4>Total Revenue</h4>
            <p>₹{data.stats.totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="admin-card stat-card">
          <div className="stat-icon" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}><Home /></div>
          <div className="stat-info">
            <h4>Listed Properties</h4>
            <p>{data.stats.activeListings}</p>
          </div>
        </div>
        <div className="admin-card stat-card">
          <div className="stat-icon" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)' }}><CheckCircle /></div>
          <div className="stat-info">
            <h4>Sold Properties</h4>
            <p>{data.stats.soldProperties}</p>
          </div>
        </div>
        <div className="admin-card stat-card">
          <div className="stat-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}><AlertTriangle /></div>
          <div className="stat-info" style={{ color: data.stats.pendingComplaints > 0 ? 'var(--danger-color)' : 'inherit' }}>
            <h4>Pending Complaints</h4>
            <p>{data.stats.pendingComplaints}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="admin-card">
          <h3 style={{ marginBottom: '20px' }}>Monthly Sales Analytics</h3>
          <div style={{ height: '300px', width: '100%' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }} />
                  <Area type="monotone" dataKey="amount" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p>No sales data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
