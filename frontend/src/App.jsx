import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import InvestorDashboard from './pages/InvestorDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import UsersList from './pages/Admin/Users';
import PropertiesList from './pages/Admin/Properties';
import TransactionsList from './pages/Admin/Transactions';
import ComplaintsList from './pages/Admin/Complaints';
import PaymentPage from './pages/PaymentPage';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="container mt-8 text-center text-secondary">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  
  return children;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div className="page-wrapper animate-fade-in">
        <div className="blob blob-blue animate-float" style={{ top: '10%', left: '-5%' }}></div>
        <div className="blob blob-pink animate-float" style={{ bottom: '20%', right: '-5%', animationDelay: '-3s' }}></div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/payment" element={<ProtectedRoute roleRequired="investor"><PaymentPage /></ProtectedRoute>} />
          
          <Route path="/" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <Navigate to="/admin" /> : 
               user?.role === 'owner' ? <Navigate to="/owner" /> : 
               <Navigate to="/investor" />}
            </ProtectedRoute>
          } />

          <Route path="/investor" element={
            <ProtectedRoute roleRequired="investor">
              <InvestorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/owner" element={
            <ProtectedRoute roleRequired="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="properties" element={<PropertiesList />} />
            <Route path="transactions" element={<TransactionsList />} />
            <Route path="complaints" element={<ComplaintsList />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
