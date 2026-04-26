import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'investor' });
  const [error, setError] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      setIsOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await verifyOtp(formData.email, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP Verification failed');
    }
  };

  if (isOtpSent) {
    return (
      <div className="container flex justify-center" style={{ marginTop: '4rem' }}>
        <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="text-center mb-4 text-gradient-blue">Verify OTP</h2>
          <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
            We've sent an OTP to {formData.email}
          </p>
          {error && <div className="mb-4" style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group mb-8">
              <label className="form-label">Enter OTP</label>
              <input type="text" className="form-input" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Verify & Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex justify-center" style={{ marginTop: '4rem' }}>
      <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4 text-gradient-blue">Create Account</h2>
        {error && <div className="mb-4" style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="form-group mb-8">
            <label className="form-label">Role</label>
            <select className="form-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="investor">Investor</option>
              <option value="owner">Property Owner</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
        </form>
        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
