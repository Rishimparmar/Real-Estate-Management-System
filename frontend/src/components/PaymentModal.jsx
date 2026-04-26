import React, { useState } from 'react';

const PaymentModal = ({ property, amount, onConfirm, onCancel }) => {
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '4242 4242 4242 4242',
    name: 'JOHN DOE',
    expiry: '12/26',
    cvv: '123'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      onConfirm();
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel p-8 max-w-md w-full animate-scale-up" style={{ position: 'relative' }}>
        <button className="absolute top-4 right-4 text-secondary hover:text-white transition-colors" onClick={onCancel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-2xl font-bold mb-2">Secure Investment</h2>
        <p className="text-secondary mb-6">Investing in <span className="text-white font-semibold">{property.title}</span></p>

        <div className="payment-summary bg-surface p-4 rounded-lg mb-8" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <div className="flex justify-between mb-2">
            <span className="text-secondary">Amount to Invest</span>
            <span className="font-bold text-primary">${amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Service Fee</span>
            <span className="text-success">$0.00 (Promo)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Card Number</label>
            <input 
              type="text" 
              className="form-input" 
              value={cardData.number} 
              onChange={e => setCardData({...cardData, number: e.target.value})}
              placeholder="0000 0000 0000 0000"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="form-label">Expiry Date</label>
              <input 
                type="text" 
                className="form-input" 
                value={cardData.expiry} 
                onChange={e => setCardData({...cardData, expiry: e.target.value})}
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label className="form-label">CVV</label>
              <input 
                type="password" 
                className="form-input" 
                value={cardData.cvv} 
                onChange={e => setCardData({...cardData, cvv: e.target.value})}
                placeholder="123"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary w-full py-4 relative overflow-hidden ${processing ? 'opacity-80 cursor-not-allowed' : ''}`}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner"></span> Processing...
              </span>
            ) : `Pay $${amount.toLocaleString()}`}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4 opacity-40 grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" height="15" style={{ height: '15px' }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" height="20" style={{ height: '20px' }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" height="18" style={{ height: '18px' }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes scale-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default PaymentModal;
