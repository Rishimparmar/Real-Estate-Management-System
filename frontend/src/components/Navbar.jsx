import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Building2 size={28} className="text-primary" style={{ color: 'var(--primary-color)' }} />
          <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 700 }}>SmartInvest</span>
        </Link>
        <div className="nav-links flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Welcome, <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong> <span className="badge badge-success" style={{ marginLeft: '4px', fontSize: '0.7rem' }}>{user.role}</span>
              </span>
              <button className="btn btn-secondary flex items-center gap-2" onClick={handleLogout} style={{ padding: '8px 16px' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
