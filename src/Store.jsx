import React, { useContext, useEffect } from 'react';
import { LanguageContext } from './App';

const Store = () => {
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="store-page-wrapper">
      <div className="store-top-info">
        <span className="s-meta">{t.findStore?.toUpperCase()}</span>
      </div>

      <div className="store-grid-container">
        <div className="map-section-lux">
          <div className="map-container">
            {/* RESMİ GOOGLE MAPS EMBED - KIBELE JEWELRY GÖREME */}
            <iframe 
              title="Kibele Jewelry Göreme"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.111867169123!2d34.829145676451665!3d38.64336056157451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152a69b8b8010027%3A0x50538a7073cbd107!2sKibele%20Jewelry%2FSilver%2FG%C3%BCm%C3%BC%C5%9F!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
              width="100%" 
              height="600" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

        <div className="store-footer-info">
          <div className="luxury-badge">OFFICIAL STORE LOCATED HERE</div>
          <h3 className="store-title">KIBELE JEWELRY</h3>
          <p className="address-line">İsali - Gaferli - Avcılar, Müze Cd. No:36/A</p>
          <p className="city-line">50180 Göreme / NEVŞEHİR</p>
        
          
          <div className="map-button-container">
             <a href="https://maps.app.goo.gl/Lgus2EN2AAvfBjQhf" target="_blank" rel="noreferrer" className="google-maps-btn">
               GOOGLE HARİTALARDA AÇ
             </a>
          </div>
        </div>
      </div>

      <style>{`
        .store-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background-color: #fff;
          padding-bottom: 100px;
        }

        .store-top-info {
          text-align: center;
          padding-bottom: 30px;
        }

        .s-meta { 
          font-size: 10px; 
          letter-spacing: 5px; 
          color: #aaa; 
          font-weight: 700;
        }

        .store-grid-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .map-section-lux {
          width: 100%;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
          border: 1px solid #000;
          padding: 5px;
          background: #fff;
        }

        .map-container {
          width: 100%;
          height: 600px;
          overflow: hidden;
        }

        .store-footer-info {
          text-align: center;
          margin-top: 50px;
        }

        .luxury-badge {
          font-size: 9px;
          letter-spacing: 3px;
          background: #000;
          color: #fff !important;
          display: inline-block;
          padding: 8px 25px;
          margin-bottom: 25px;
        }

        .store-title {
          font-size: 24px;
          letter-spacing: 6px;
          margin-bottom: 15px;
          font-weight: 300;
        }

        .address-line { font-size: 16px; font-weight: 600; margin-bottom: 5px; }
        .city-line { font-size: 14px; color: #666; margin-bottom: 30px; }

        .direction-helper {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          padding: 15px 35px;
          background: #fdfdfd;
          border: 1px solid #eee;
          margin-bottom: 30px;
        }

        .direction-helper p {
          font-size: 13px;
          color: #000 !important;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .location-pin-icon {
          font-size: 24px;
          animation: bounce 2s infinite;
        }

        .google-maps-btn {
          display: inline-block;
          padding: 15px 40px;
          border: 1px solid #000;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 2px;
          transition: all 0.3s;
          color: #000 !important;
        }

        .google-maps-btn:hover {
          background: #000;
          color: #fff !important;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-12px);}
          60% {transform: translateY(-6px);}
        }

        @media (max-width: 768px) {
          .store-grid-container { padding: 0 15px; }
          .map-container { height: 400px; }
          .direction-helper { flex-direction: column; padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Store;