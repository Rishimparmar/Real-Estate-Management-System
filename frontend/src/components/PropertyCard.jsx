import React from 'react';
import { Home, MapPin, DollarSign, TrendingUp, ShieldAlert, Star } from 'lucide-react';

export default function PropertyCard({ property, onCompare, onInvest, isCompared }) {
  const getRiskBadgeClass = (risk) => {
    if (risk === 'Low') return 'badge-success';
    if (risk === 'Medium') return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div className="glass-panel property-card">
      <img 
        src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'} 
        alt={property.title} 
        className="property-image"
      />
      <div className="property-content">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{property.title}</h3>
        <p className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
          <MapPin size={16} /> {property.location}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4" style={{ fontSize: '0.9rem' }}>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.8rem' }}>Price</p>
            <p className="flex items-center font-semibold"><DollarSign size={16} />{property.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.8rem' }}>Type</p>
            <p className="flex items-center font-semibold"><Home size={16} className="mr-1"/> {property.type}</p>
          </div>
        </div>

        <div className="p-4 mb-4 bg-soft-blue border border-blue-100 rounded-xl">
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>AI Analysis</h4>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1 text-sm"><Star size={14} className="text-warning"/> Score</span>
            <span className="font-semibold">{property.score}/100</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1 text-sm"><TrendingUp size={14} className="text-success"/> ROI</span>
            <span className="font-semibold">{property.roi}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-sm"><ShieldAlert size={14}/> Risk Level</span>
            <span className={`badge ${getRiskBadgeClass(property.riskLevel)}`}>{property.riskLevel}</span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          {onCompare && (
            <button 
              className={`btn ${isCompared ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ flex: 1 }}
              onClick={() => onCompare(property)}
            >
              {isCompared ? 'Remove' : 'Compare'}
            </button>
          )}
          {onInvest && (
            <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => onInvest(property)}>
              Invest Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
