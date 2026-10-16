import { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildOrderRequest, orderRequestCopy, STORE_WHATSAPP, STORE_EMAIL } from './orderRequest';
import './Cart.css';

export default function Cart({ t, lang, cart, removeFromCart, formatPrice }) {
  const [showRequest, setShowRequest] = useState(false);
  const copy = orderRequestCopy[lang] || orderRequestCopy.TR;
  const request = buildOrderRequest(cart, lang, formatPrice);

  return (
    <div className="cart-page-container">
      <div className="section-title">
        <h2>{showRequest ? copy.title : t.yourBag}</h2>
        <div className="title-line" />
      </div>
      <div className="cart-content-wrapper">
        {cart.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-items-column">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item-card">
                  <div className="cart-img-wrapper">
                    <img src={item.img} alt={item.name || item.title} />
                  </div>
                  <div className="cart-item-details">
                    <div className="details-header">
                      <h3>{item.name || item.title}</h3>
                      <p className="item-price">{Number.isFinite(Number(item.price)) ? formatPrice(item.price) : '—'}</p>
                    </div>
                    <button type="button" className="cart-remove-btn" onClick={() => removeFromCart(index)}>{t.remove}</button>
                  </div>
                </div>
              ))}
              {showRequest && !request.error && (
                <section className="order-request" aria-label={copy.title}>
                  <p id="request-instructions">{copy.instructions}</p>
                  <label htmlFor="order-request-text">{copy.draft}</label>
                  <textarea id="order-request-text" readOnly rows={10} value={request.text} aria-describedby="request-instructions" />
                  {!request.href && <p role="status">{copy.long}</p>}
                </section>
              )}
            </div>
            <div className="cart-summary-column">
              <div className="summary-sticky">
                <p className="order-request-notice" id="order-request-notice">{copy.notice}</p>
                <div className="summary-row">
                  <span>{copy.total}</span>
                  <span className="total-amount">{request.total === null ? '—' : formatPrice(request.total)}</span>
                </div>
                {request.error ? <p role="alert">{copy.invalid}</p> : !showRequest ? (
                  <button type="button" className="checkout-cta" onClick={() => setShowRequest(true)}>{copy.prepare}</button>
                ) : request.href ? (
                  <a className="checkout-cta order-request-link" href={request.href} target="_blank" rel="noopener noreferrer" aria-describedby="order-request-notice request-instructions">{copy.open}</a>
                ) : (
                  <a className="checkout-cta order-request-link" href={STORE_WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                )}
                <a className="continue-link" href={`mailto:${STORE_EMAIL}`}>{copy.contact}: {STORE_EMAIL}</a>
                {showRequest && <button type="button" className="continue-link order-request-back" onClick={() => setShowRequest(false)}>{copy.back}</button>}
                <Link className="continue-link" to="/">{t.continueShopping}</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state-lux">
            <p>{t.emptyBag}</p>
            <Link to="/" className="explore-btn-simple">{t.continueShopping}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
