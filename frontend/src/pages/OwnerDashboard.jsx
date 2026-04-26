import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Eye, BarChart2, Hash, Building2, Smartphone, ShieldCheck } from 'lucide-react';

export default function OwnerDashboard() {
  const { api, user } = useContext(AuthContext);
  const [insights, setInsights] = useState({ totalViews: 0, totalListings: 0, averageScore: 0, properties: [] });
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '', price: '', location: '', type: 'House', amenities: '', images: ''
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await api.get('/insights');
      setInsights(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        amenities: formData.amenities.split(',').map(a => a.trim()),
        images: formData.images ? [formData.images] : []
      };
      await api.post('/properties', propertyData);
      alert('Property Added Successfully. AI features have been generated!');
      setFormData({ title: '', price: '', location: '', type: 'House', amenities: '', images: '' });
      fetchInsights();
    } catch (err) {
      console.error(err);
      alert('Failed to add property');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchInsights();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container mt-8 text-center text-secondary">Loading dashboard...</div>;

  return (
    <div className="container">
      <h1 className="mb-8 text-gradient-blue">Property Owner Dashboard</h1>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
          <div className="p-3 bg-surface rounded-full text-primary" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Hash size={24} />
          </div>
          <div>
            <p className="text-secondary text-sm">Total Listings</p>
            <h2 className="text-2xl">{insights.totalListings}</h2>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--success-color)' }}>
          <div className="p-3 bg-surface rounded-full text-success" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <Eye size={24} color="var(--success-color)" />
          </div>
          <div>
            <p className="text-secondary text-sm">Total Views</p>
            <h2 className="text-2xl">{insights.totalViews}</h2>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--warning-color)' }}>
          <div className="p-3 bg-surface rounded-full text-warning" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <BarChart2 size={24} color="var(--warning-color)" />
          </div>
          <div>
            <p className="text-secondary text-sm">Average AI Score</p>
            <h2 className="text-2xl">{insights.averageScore}/100</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Property Form */}
        <div className="glass-panel p-6">
          <h2 className="mb-4 flex items-center gap-2"><PlusCircle size={20} className="text-primary"/> Add New Property</h2>
          <p className="text-sm text-secondary mb-6">When added, our backend AI instantly calculates Property Score, Est. ROI, and Risk Level.</p>
          <form onSubmit={handleAddProperty}>
            <div className="form-group">
              <label className="form-label">Property Title</label>
              <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. Modern Downtown Apartment"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input type="number" className="form-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required placeholder="e.g. 123 Main St, New York"/>
            </div>
            <div className="form-group">
              <label className="form-label">Amenities (Comma separated)</label>
              <input type="text" className="form-input" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} placeholder="Pool, Gym, Parking"/>
            </div>
            <div className="form-group mb-6">
              <label className="form-label">Image URL</label>
              <input type="url" className="form-input" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://example.com/image.jpg"/>
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ width: '100%' }}>Submit & Generate Insights</button>
          </form>
        </div>

        {/* Managed Properties */}
        <div>
          <h2 className="mb-4">My Properties</h2>
          {insights.properties.length === 0 ? (
            <div className="glass-panel p-6 text-center text-secondary">
              <p>You have no properties listed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {insights.properties.map(p => (
                <div key={p.id} className="glass-panel p-4 flex gap-4">
                  <img src={p.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200'} alt={p.title} className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div className="flex-1">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{p.title}</h3>
                    <p className="text-secondary text-sm mb-2">${p.price.toLocaleString()} • {p.location}</p>
                    <div className="flex gap-4 text-sm font-medium mb-3">
                      <span className="text-primary">Score: {p.score}</span>
                      <span className="text-success">ROI: {p.roi}%</span>
                      <span className="text-warning">Views: {p.views}</span>
                    </div>
                    <div className="flex justify-end mt-auto">
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', border: '1px solid var(--danger-color)' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Support & Complaints Section */}
      <hr style={{ borderColor: 'var(--border-color)', margin: '3rem 0' }} />
      
      <div className="flex justify-center animate-fade-in mb-12">
        <div className="glass-panel p-10 w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-soft-blue rounded-full mb-4">
              <Building2 size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gradient-blue">REGISTER COMPLAINT</h2>
            <p className="text-secondary text-sm mt-2">Owner Support Portal - Submit your issue below</p>
          </div>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              subject: `${formData.get('type')} - ${formData.get('property')}`,
              description: formData.get('description')
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
                  {insights.properties.map(p => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                  <option value="General">General / Account Issue</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Complaint Type</label>
                <select name="type" className="form-input" required>
                  <option value="Property">Property Listing</option>
                  <option value="Payment">Payment Discrepancy</option>
                  <option value="Account">Account Access</option>
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
                <input type="file" className="hidden" id="owner-complaint-image" accept="image/*" />
                <label htmlFor="owner-complaint-image" className="flex items-center gap-2 cursor-pointer w-full text-secondary text-sm">
                  <PlusCircle size={20} /> Choose File
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
                <p className="text-[10px] uppercase font-bold text-secondary">Owner Support</p>
                <p className="text-xs font-semibold">+91 9328012512</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-soft-pink rounded-lg text-accent">
                 <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-secondary">Admin Email</p>
                <p className="text-xs font-semibold">realestatemanagement2004@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
