import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from './App';

const Card = () => {
  const { t, cart, removeFromCart, setCart } = useContext(LanguageContext);
  const [showCheckout, setShowCheckout] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const navigate = useNavigate();

  const totalPrice = cart ? cart.reduce((acc, item) => acc + parseFloat(item.price || 0), 0) : 0;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      alert(t.successMsg || "Ödeme Başarılı / Payment Successful");
      if (setCart) setCart([]); 
      setIsProcessing(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="cart-page-container" style={{ position: 'relative', zIndex: 5, pointerEvents: 'auto' }}>
      <div className="section-title">
        <h2>{showCheckout ? (t.checkoutTitle || "CHECKOUT") : t.yourBag}</h2>
        <div className="title-line"></div>
      </div>

      <div className="cart-content-wrapper">
        {cart && cart.length > 0 ? (
          <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '50px' }}>
            
            <div className="cart-items-column">
              {!showCheckout ? (
                cart.map((item, index) => (
                  <div key={index} className="cart-item-card" style={{ display: 'flex', gap: '20px', padding: '20px 0', borderBottom: '1px solid #eee' }}>
                    <img src={item.img} alt="" style={{ width: '80px', height: '100px', objectFit: 'cover' }} />
                    <div className="cart-item-details">
                      <h3>{item.name || item.title}</h3>
                      <p>{parseFloat(item.price).toLocaleString()} TL</p>
                      <button onClick={() => removeFromCart(index)} style={{ cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', fontSize: '10px' }}>{t.remove}</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="checkout-form-wrapper">
                  <form id="payment-form" onSubmit={handlePaymentSubmit}>
                    <div className="form-group">
                      <label style={labelStyle}>TESLİMAT BİLGİLERİ</label>
                      <input type="text" placeholder="Ad Soyad" required style={inputStyle} />
                      <textarea placeholder="Adres" required style={{...inputStyle, height:'80px'}}></textarea>
                    </div>
                    <div className="form-group" style={{marginTop: '20px'}}>
                      <label style={labelStyle}>KART BİLGİLERİ</label>
                      <input type="text" placeholder="Kart Numarası" maxLength="16" required style={inputStyle} />
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="cart-summary-column">
              {/* Z-INDEX VE POINTER-EVENTS BURADA ÇOK KRİTİK */}
              <div className="summary-sticky" style={{
                position: 'sticky', 
                top: '200px', 
                background: '#fcfcfc', 
                padding: '30px', 
                border: '1px solid #eee',
                zIndex: 999,
                pointerEvents: 'all' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <span>{t.total}</span>
                  <span style={{ fontWeight: 'bold' }}>{totalPrice.toLocaleString()} TL</span>
                </div>

                {!showCheckout ? (
                  <button 
                    type="button"
                    className="checkout-cta-active"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCheckout(true);
                    }}
                    style={buttonStyle}
                  >
                    {t.checkout}
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    form="payment-form" 
                    className="checkout-cta-active" 
                    disabled={isProcessing}
                    style={buttonStyle}
                  >
                    {isProcessing ? "İŞLENİYOR..." : (t.payNow || "ÖDEMEYİ TAMAMLA")}
                  </button>
                )}
                
                <button 
                  onClick={() => showCheckout ? setShowCheckout(false) : navigate('/')}
                  style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', marginTop: '20px', fontSize: '10px', textDecoration: 'underline' }}
                >
                  {showCheckout ? "GERİ DÖN" : t.continueShopping}
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p>{t.emptyBag}</p>
            <Link to="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 30px', border: '1px solid #000', textDecoration: 'none' }}>{t.continueShopping}</Link>
          </div>
        )}
      </div>
      <style>{`
        .checkout-cta-active {
          width: 100%;
          background: #000 !important;
          color: #fff !important;
          border: none;
          padding: 18px;
          cursor: pointer !important;
          display: block !important;
          position: relative;
          z-index: 1000;
          pointer-events: auto !important;
        }
        .checkout-cta-active:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #eee' };
const buttonStyle = { letterSpacing: '2px', fontSize: '11px' };
const labelStyle = { display: 'block', marginBottom: '10px', fontSize: '10px', fontWeight: 'bold' };

export default Card;