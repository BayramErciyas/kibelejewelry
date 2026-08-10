import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from './App';

// Görselleri buraya ekleyin
import zultanitering from './zultanitering.jpg'; 
import zultanitebracelet from './zultanitebracelet.jpg'; 

const Search = () => {
  const { t } = useContext(LanguageContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  const allProducts = [
    { id: 1, title: "Zultanite Ring", category: "Jewellery", img: zultanitering },
    { id: 2, title: "Zultanite Bracelet", category: "Jewellery", img: zultanitebracelet },
  ];

  const filtered = allProducts.filter(p => 
    p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );

  return (
    <div className="full-viewport-search">
      <div className="search-content-inner">
        <header className="search-header-lux">
          <span className="search-meta">{t.search?.toUpperCase()}</span>
          <h2 className="search-query-title">"{query.toUpperCase()}"</h2>
          <div className="search-divider-line"></div>
          <p className="search-count-info">{filtered.length} {t.results}</p>
        </header>
        
        <div className="search-display-area">
          {filtered.length > 0 ? (
            <div className="search-grid-system">
              {filtered.map(item => (
                <div key={item.id} className="search-card-lux">
                  <div className="search-img-box"><img src={item.img} alt={item.title} /></div>
                  <div className="search-label-box"><span>{item.title}</span></div>
                </div>
              ))}
            </div>
          ) : (
            /* BOŞ DURUM: Sayfayı dikey ve yatayda geren özel yapı */
            <div className="search-empty-full-screen">
              <span className="empty-x-icon">×</span>
              <p className="empty-msg-text">{t.noResults?.toUpperCase()}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* 1. TÜM DIŞ DÜNYAYI (APP.CSS) DEVRE DIŞI BIRAKAN EN ÜST KATMAN */
        :global(main), :global(#root), :global(.app-wrapper) {
          display: block !important;
          width: 100% !important;
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .full-viewport-search {
          width: 100vw !important; /* Ekranın gerçek genişliği */
          min-height: 100vh;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0;
          padding: 0;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }

        .search-content-inner {
          width: 100%;
          max-width: 1600px; /* İçerik çok dağılmasın ama arka plan tam kalsın */
          padding: 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .search-header-lux { text-align: center; margin-bottom: 60px; width: 100%; }
        .search-meta { font-size: 10px; letter-spacing: 5px; color: #999; }
        .search-query-title { font-size: 32px; font-weight: 200; letter-spacing: 12px; margin: 25px 0; color: #000; }
        .search-divider-line { width: 40px; height: 1px; background: #000; margin: 0 auto; }
        .search-count-info { font-size: 11px; opacity: 0.5; margin-top: 25px; letter-spacing: 2px; }

        .search-display-area { width: 100%; flex: 1; }

        .search-grid-system {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          width: 100%;
        }

        .search-img-box { aspect-ratio: 3/4; overflow: hidden; background: #f9f9f9; }
        .search-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .search-label-box { padding: 20px 0; text-align: center; font-size: 10px; letter-spacing: 2px; }

        /* 2. BOŞ SONUÇ DURUMU: EKRANI BEMBEYAZ TUTAR */
        .search-empty-full-screen {
          width: 100%;
          height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
        }

        .empty-x-icon { font-size: 120px; font-weight: 100; opacity: 0.1; color: #000; }
        .empty-msg-text { font-size: 12px; letter-spacing: 6px; opacity: 0.4; margin-top: 20px; color: #000; }

        @media (max-width: 1024px) {
          .search-grid-system { grid-template-columns: repeat(2, 1fr); }
          .full-viewport-search { padding-top: 40px; }
        }
      `}</style>
    </div>
  );
};

export default Search;