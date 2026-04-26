import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { Building2, PlusCircle, Smartphone, ShieldCheck, MapPin } from 'lucide-react';

export default function InvestorDashboard() {
  const { api, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'compare', 'portfolio'

  const [filters, setFilters] = useState({ budget: '', location: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
    fetchRecommendations();
    fetchPortfolio();

    // Check if we just came back from a successful payment
    if (location.state?.investmentSuccess && location.state?.propertyId) {
      handleFinalizeInvestment(location.state.propertyId);
      // Clear the state so it doesn't trigger again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/properties?${query}`);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/recommendations');
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const res = await api.get('/portfolio');
      setPortfolio(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const toggleCompare = (property) => {
    if (compareList.find(p => p.id === property.id)) {
      setCompareList(compareList.filter(p => p.id !== property.id));
    } else {
      if (compareList.length < 2) {
        setCompareList([...compareList, property]);
      } else {
        alert("You can only compare 2 properties at a time.");
      }
    }
  };

  const handleInvest = (property) => {
    navigate('/payment', { state: { property, amount: property.price * 0.1 } });
  };

  const handleFinalizeInvestment = async (propertyId) => {
    try {
      const property = properties.find(p => p.id === propertyId) || recommendations.find(p => p.id === propertyId);
      await api.post(`/invest/${propertyId}`, { amount: (property?.price || 500000) * 0.1 });
      fetchPortfolio();
      alert("🎉 Investment Successful! Your transaction has been recorded via Razorpay.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-8 text-gradient-blue">Investor Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button className={`btn ${activeTab === 'search' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('search')}>Search & AI Recs</button>
        <button className={`btn ${activeTab === 'compare' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('compare')}>Compare ({compareList.length}/2)</button>
        <button className={`btn ${activeTab === 'portfolio' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('portfolio')}>My Portfolio</button>
        <button className={`btn ${activeTab === 'support' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('support')}>Support & Complaints</button>
      </div>

      {activeTab === 'search' && (
        <>
          {/* AI Recommendations Section */}
          <div className="mb-8 p-6 bg-soft-blue rounded-3xl border border-blue-100">
            <h2 className="text-gradient-blue mb-4">🏆 Top AI Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map(p => (
                <PropertyCard key={p.id} property={p} onCompare={toggleCompare} isCompared={compareList.some(c => c.id === p.id)} onInvest={handleInvest} />
              ))}
            </div>
            {recommendations.length === 0 && <p className="text-secondary">No recommendations yet.</p>}
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

          {/* Search Section */}
          <div className="glass-panel p-6 mb-8 border-pink-100 bg-white/40">
            <h3 className="mb-4 text-gradient-pink">Smart Property Search</h3>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="form-label">Max Budget ($)</label>
                <input type="number" className="form-input" value={filters.budget} onChange={e => setFilters({ ...filters, budget: e.target.value })} placeholder="e.g. 500000" />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input type="text" className="form-input" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} placeholder="City or area" />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select className="form-input" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                  <option value="">Any</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div>
                <button type="submit" className="btn btn-primary" style={{ height: '48px', width: '100%' }}>Search Properties</button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? <p>Loading properties...</p> : (
              properties.map(p => (
                <PropertyCard key={p.id} property={p} onCompare={toggleCompare} isCompared={compareList.some(c => c.id === p.id)} onInvest={handleInvest} />
              ))
            )}
            {properties.length === 0 && !loading && <p className="text-secondary">No properties found matching your criteria.</p>}
          </div>
        </>
      )}

      {activeTab === 'compare' && (
        <div className="glass-panel p-6">
          <h2 className="mb-4">Property Comparison</h2>
          {compareList.length === 0 ? (
            <p className="text-secondary">Select properties to compare from the search page.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    {compareList.map((p, i) => <th key={i}>{p.title}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Price</strong></td>
                    {compareList.map((p, i) => <td key={i}>${p.price.toLocaleString()}</td>)}
                  </tr>
                  <tr>
                    <td><strong>Location</strong></td>
                    {compareList.map((p, i) => <td key={i}>{p.location}</td>)}
                  </tr>
                  <tr>
                    <td><strong>AI Score</strong></td>
                    {compareList.map((p, i) => <td key={i}><span className="text-gradient font-bold">{p.score}/100</span></td>)}
                  </tr>
                  <tr>
                    <td><strong>Est. ROI</strong></td>
                    {compareList.map((p, i) => <td key={i}><span className="text-success font-bold">{p.roi}%</span></td>)}
                  </tr>
                  <tr>
                    <td><strong>Risk Level</strong></td>
                    {compareList.map((p, i) => <td key={i}>{p.riskLevel}</td>)}
                  </tr>
                  <tr>
                    <td><strong>Action</strong></td>
                    {compareList.map((p, i) => (
                      <td key={i}>
                        <button className="btn btn-secondary btn-sm" onClick={() => toggleCompare(p)}>Remove</button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="glass-panel p-6">
          <h2 className="mb-4">Simulation Portfolio</h2>
          <p className="text-secondary mb-6">These are your simulated investments.</p>

          {portfolio.length === 0 ? (
            <p>No investments yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {portfolio.map((inv, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border border-border-color rounded bg-surface hover:bg-surface-hover transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{inv.property?.title || 'Unknown Property'}</h3>
                    <p className="text-secondary text-sm">Invested Date: {new Date(inv.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">Simulated Investment: ${inv.amount.toLocaleString()}</p>
                    <p className="text-sm">Expected ROI: {inv.property?.roi}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'support' && (
        <div className="flex justify-center animate-fade-in">
          <div className="glass-panel p-10 w-full max-w-2xl">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-soft-blue rounded-full mb-4">
                <Building2 size={32} className="text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gradient-blue">REGISTER COMPLAINT</h2>
              <p className="text-secondary text-sm mt-2">Please fill in the details below to report an issue</p>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                subject: `${formData.get('type')} - ${formData.get('property')}`,
                description: formData.get('description'),
                // Note: Image upload would require multipart/form-data handling in backend
              };
              try {
                await api.post('/complaints', data);
                alert('Complaint registered successfully! The admin will review it.');
                e.target.reset();
              } catch (err) {
                alert('Failed to register complaint');
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input bg-gray-50" value={user?.name} readOnly disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input bg-gray-50" value={user?.email} readOnly disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
                  <label className="form-label">Property Name</label>
                  <select name="property" className="form-input" required>
                    <option value="">Select a Property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                    {portfolio.map((p, i) => (
                      <option key={`port-${i}`} value={p.property?.title}>{p.property?.title} (Invested)</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Complaint Type</label>
                  <select name="type" className="form-input" required>
                    <option value="Property">Property Related</option>
                    <option value="Payment">Payment Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Description</label>
                <textarea 
                  name="description" 
                  className="form-input" 
                  style={{ minHeight: '150px', resize: 'vertical' }} 
                  placeholder="Describe your issue in detail..." 
                  required
                ></textarea>
              </div>

              <div className="form-group mb-10">
                <label className="form-label">Upload Image (Optional)</label>
                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-border-color rounded-xl hover:border-primary transition-colors cursor-pointer bg-gray-50">
                  <input type="file" className="hidden" id="complaint-image" accept="image/*" />
                  <label htmlFor="complaint-image" className="flex items-center gap-2 cursor-pointer w-full text-secondary text-sm">
                    <PlusCircle size={20} /> Choose File or drag and drop
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full py-4 text-lg font-bold shadow-xl" style={{ width: '100%' }}>
                Submit Complaint
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between gap-6 opacity-80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-soft-blue rounded-lg text-primary">
                  <Smartphone size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-secondary">Contact Support</p>
                  <p className="text-xs font-semibold">+91 9328012512</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-soft-pink rounded-lg text-accent">
                   <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-secondary">Email Support</p>
                  <p className="text-xs font-semibold">realestatemanagement2004@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
