import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container flex justify-center" style={{ marginTop: '4rem' }}>
      <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-8 text-gradient-blue">Welcome Back</h2>
        {error && <div className="mb-4" style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="investor@example.com"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group mb-8">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p className="text-center mt-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
