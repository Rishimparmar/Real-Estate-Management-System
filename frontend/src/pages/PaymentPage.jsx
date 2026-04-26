import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Landmark, ShieldCheck, ChevronRight, MapPin } from 'lucide-react';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { property, amount } = location.state || {};
  
  const [activeMethod, setActiveMethod] = useState('card'); // 'card', 'upi', 'netbanking'
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!property) {
      navigate('/investor');
    }
  }, [property, navigate]);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        // In a real app, we would call the API here
        navigate('/investor', { state: { investmentSuccess: true, propertyId: property.id } });
      }, 2000);
    }, 2500);
  };

  if (!property) return null;

  return (
    <div className="payment-page-container">
      <div className="payment-content-wrapper">
        {/* Left Column - PROPERTY CARD */}
        <div className="payment-summary-card glass-panel overflow-hidden" style={{ height: 'fit-content' }}>
          <img 
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'} 
            alt={property.title}
            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-1">{property.title}</h2>
            <p className="text-secondary text-sm flex items-center gap-1 mb-6">
              <MapPin size={14} /> {property.location}
            </p>

            <div className="investment-details bg-soft-blue p-6 rounded-2xl border border-blue-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Investment Details</h3>
              <div className="flex justify-between mb-3">
                <span className="text-secondary">Amount</span>
                <span className="font-semibold">${amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-secondary">Transaction Fee</span>
                <span className="text-success font-bold">FREE</span>
              </div>
              <div className="border-t border-blue-200 pt-4 mt-2 flex justify-between items-center">
                <span className="font-bold text-secondary">Total Payable</span>
                <span className="text-3xl font-bold text-primary">${amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - PAYMENT SECTION */}
        <div className="payment-methods-card glass-panel p-8">
          {success ? (
            <div className="p-12 text-center animate-fade-in">
              <div className="success-icon-wrapper mb-6">
                <ShieldCheck size={64} className="text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
              <p className="text-secondary">Your investment has been processed safely.</p>
              <p className="text-sm mt-4 text-secondary">Redirecting you back to dashboard...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="payment-section-header border-b border-border-color pb-4">
                <h2 className="text-xl font-bold text-gradient-blue">Select Payment Method</h2>
                <p className="text-secondary text-xs">Choose your preferred way to pay</p>
              </div>

              {/* Payment Options Selection - VERTICAL STACK */}
              <div className="payment-options-list flex flex-col gap-3">
                <button 
                  className={`method-select-card-horizontal ${activeMethod === 'card' ? 'active' : ''}`} 
                  onClick={() => setActiveMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <div className="selection-circle"></div>
                    <CreditCard size={18} />
                    <span className="font-semibold">Credit / Debit Card</span>
                  </div>
                  <ChevronRight size={14} className="text-secondary opacity-50" />
                </button>
                <button 
                  className={`method-select-card-horizontal ${activeMethod === 'upi' ? 'active' : ''}`} 
                  onClick={() => setActiveMethod('upi')}
                >
                  <div className="flex items-center gap-3">
                    <div className="selection-circle"></div>
                    <Smartphone size={18} />
                    <span className="font-semibold">UPI Payment</span>
                  </div>
                  <ChevronRight size={14} className="text-secondary opacity-50" />
                </button>
                <button 
                  className={`method-select-card-horizontal ${activeMethod === 'netbanking' ? 'active' : ''}`} 
                  onClick={() => setActiveMethod('netbanking')}
                >
                  <div className="flex items-center gap-3">
                    <div className="selection-circle"></div>
                    <Landmark size={18} />
                    <span className="font-semibold">Net Banking</span>
                  </div>
                  <ChevronRight size={14} className="text-secondary opacity-50" />
                </button>
              </div>

              {/* Payment Form Area */}
              <div className="payment-form-area bg-soft-blue/50 p-6 rounded-2xl border border-blue-100">
                {activeMethod === 'card' && (
                  <div className="animate-fade-in">
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-secondary">Card Details</h3>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input type="text" className="form-input" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Expiry</label>
                        <input type="text" className="form-input" placeholder="MM / YY" defaultValue="12 / 26" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input type="password" className="form-input" placeholder="***" defaultValue="123" />
                      </div>
                    </div>
                  </div>
                )}

                {activeMethod === 'upi' && (
                  <div className="animate-fade-in">
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-secondary">UPI Payment</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="upi-option active">
                        <div className="flex items-center gap-2">
                           <div className="selection-circle"></div>
                           <span className="text-sm font-medium">Google Pay</span>
                        </div>
                      </div>
                      <div className="upi-option">
                        <div className="flex items-center gap-2">
                           <div className="selection-circle"></div>
                           <span className="text-sm font-medium">PhonePe</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">VPA / UPI ID</label>
                      <input type="text" className="form-input" placeholder="username@bank" />
                    </div>
                  </div>
                )}

                {activeMethod === 'netbanking' && (
                  <div className="animate-fade-in">
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-secondary">Net Banking</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map(bank => (
                        <div key={bank} className="bank-option flex justify-between items-center p-3 rounded-xl hover:bg-white cursor-pointer border border-transparent hover:border-blue-200 transition-all text-sm">
                          <span className="font-medium">{bank}</span>
                          <ChevronRight size={14} className="text-secondary" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pay Button & Security */}
              <div className="payment-footer">
                <button className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg" onClick={handlePayment} disabled={processing} style={{ width: '100%' }}>
                  {processing ? <span className="spinner"></span> : `PAY $${amount.toLocaleString()}`}
                </button>
                
                <div className="mt-6 flex items-center justify-between px-2 text-secondary opacity-60">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit SSL</span>
                  </div>
                  <p style={{ fontSize: '0.65rem' }}>Verified by Razorpay</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .payment-page-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, var(--soft-blue), transparent),
                      radial-gradient(circle at bottom left, var(--soft-pink), transparent);
          padding: 2rem;
          position: relative;
        }
        .payment-content-wrapper {
          display: flex;
          gap: 3rem;
          max-width: 1000px;
          width: 100%;
          z-index: 1;
          align-items: flex-start;
        }
        .payment-summary-card {
          flex: 1;
          max-width: 420px;
        }
        .payment-methods-card {
          flex: 1;
          min-height: 600px;
        }
        .method-select-card-horizontal {
          width: 100%;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .method-select-card-horizontal:hover {
          border-color: var(--primary-color);
          background: var(--soft-blue);
        }
        .method-select-card-horizontal.active {
          border-color: var(--primary-color);
          background: var(--soft-blue);
          box-shadow: var(--shadow-sm);
        }
        .selection-circle {
          width: 14px;
          height: 14px;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          position: relative;
          transition: all 0.2s ease;
        }
        .active .selection-circle {
          border-color: var(--primary-color);
        }
        .active .selection-circle::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background: var(--primary-color);
          border-radius: 50%;
        }
        .upi-option {
          border: 1px solid var(--border-color);
          padding: 0.75rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          background: white;
        }
        .upi-option.active {
          border-color: var(--primary-color);
          background: var(--soft-blue);
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .payment-content-wrapper {
            flex-direction: column;
          }
          .payment-summary-card {
            min-width: 100%;
          }
        }
      `}} />
    </div>
  );
};

export default PaymentPage;
