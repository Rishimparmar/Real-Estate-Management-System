import React, { useContext } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, Home as PropertyIcon, CreditCard, MessageSquare, LogOut } from 'lucide-react';
import './Admin.css';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Properties', path: '/admin/properties', icon: <PropertyIcon size={20} /> },
    { name: 'Transactions', path: '/admin/transactions', icon: <CreditCard size={20} /> },
    { name: 'Complaints', path: '/admin/complaints', icon: <MessageSquare size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar glass-panel">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar glass-panel">
          <h3>Welcome back, Admin!</h3>
          <div className="admin-profile">
            <span>{user.email}</span>
            <div className="avatar">A</div>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
