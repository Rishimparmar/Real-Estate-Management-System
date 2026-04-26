import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPassword() {
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await api.post('/forgot-password', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await api.post('/reset-password', { email, otp, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="container flex justify-center" style={{ marginTop: '4rem' }}>
      <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4 text-gradient-blue">Reset Password</h2>
        {error && <div className="mb-4" style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</div>}
        {message && <div className="mb-4" style={{ color: 'var(--success-color, #4ade80)', textAlign: 'center' }}>{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            <div className="form-group mb-8">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input type="text" className="form-input" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <div className="form-group mb-8">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Reset Password</button>
          </form>
        )}

        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
