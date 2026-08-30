import React, { useContext } from 'react';
import { LanguageContext } from './App';

const Bags = () => {
  const { t, lang } = useContext(LanguageContext);

  const subtitle = {
    TR: 'Zarif çizgiler ve özgün detaylarla tamamlanan seçkin çanta ve aksesuar koleksiyonu.',
    EN: 'A refined collection of bags and accessories defined by elegant lines and distinctive details.',
    ZH: '精选包袋与配饰系列，以优雅线条与独特细节呈现。',
    ES: 'Una selecta colección de bolsos y accesorios definida por líneas elegantes y detalles distintivos.',
  }[lang] || 'Zarif çizgiler ve özgün detaylarla tamamlanan seçkin çanta ve aksesuar koleksiyonu.';

  const comingSoon = {
    TR: 'ÇANTA & AKSESUAR KOLEKSİYONU YAKINDA',
    EN: 'BAGS & ACCESSORIES COLLECTION COMING SOON',
    ZH: '包袋与配饰系列即将推出',
    ES: 'COLECCIÓN DE BOLSOS Y ACCESORIOS PRÓXIMAMENTE',
  }[lang] || 'ÇANTA & AKSESUAR KOLEKSİYONU YAKINDA';

  return (
    <div className="gold-page">
      <div className="gold-hero">
        <span className="gold-kicker">KIBELE • CAPPADOCIA</span>
        <h1>{t.bagsAccessories}</h1>
        <div className="gold-line"></div>
        <p className="gold-subtitle">{subtitle}</p>
      </div>

      <div className="gold-coming-soon">
        <span>{comingSoon}</span>
      </div>
    </div>
  );
};

export default Bags;
