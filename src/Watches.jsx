import React, { useContext } from 'react';
import { LanguageContext } from './App';

const Watches = () => {
  const { t, lang } = useContext(LanguageContext);

  const subtitle = {
    TR: 'Zamansız şıklığı ve güçlü detayları bir araya getiren seçkin saat koleksiyonu.',
    EN: 'A refined watch collection bringing together timeless elegance and distinctive details.',
    ZH: '精选腕表系列，将隽永优雅与精致细节融为一体。',
    ES: 'Una colección de relojes selecta que combina elegancia atemporal y detalles distintivos.',
  }[lang] || 'Zamansız şıklığı ve güçlü detayları bir araya getiren seçkin saat koleksiyonu.';

  const comingSoon = {
    TR: 'SAAT KOLEKSİYONU YAKINDA',
    EN: 'WATCH COLLECTION COMING SOON',
    ZH: '腕表系列即将推出',
    ES: 'COLECCIÓN DE RELOJES PRÓXIMAMENTE',
  }[lang] || 'SAAT KOLEKSİYONU YAKINDA';

  return (
    <div className="gold-page">
      <div className="gold-hero">
        <span className="gold-kicker">KIBELE • CAPPADOCIA</span>
        <h1>{t.watches}</h1>
        <div className="gold-line"></div>
        <p className="gold-subtitle">{subtitle}</p>
      </div>

      <div className="gold-coming-soon">
        <span>{comingSoon}</span>
      </div>
    </div>
  );
};

export default Watches;
