import React, { useContext, useState } from 'react';
import { LanguageContext } from './App';

const Telkari = () => {
  const context = useContext(LanguageContext);
  const { lang, addToCart } = context || { lang: 'TR', addToCart: () => {} };
  
  const [activePanel, setActivePanel] = useState(null);
  const [sortType, setSortType] = useState(0); // 0: En Yeniler, 1: Azalan, 2: Artan

  const localTranslations = {
    EN: { 
      results: "RESULTS", filter: "FILTER", sort: "SORT",
      filterTitle: "Filter", sortTitle: "Sort by", apply: "Apply", currency: "USD",
      addBtn: "ADD TO BAG",
      sortOptions: ["Newest", "Price: High to Low", "Price: Low to High", "Relevance"]
    },
    TR: { 
      results: "SONUÇ", filter: "FİLTRELE", sort: "SIRALA",
      filterTitle: "Filtre", sortTitle: "Sıralama", apply: "Uygula", currency: "TL",
      addBtn: "SEPETE EKLE",
      sortOptions: ["En Yeniler", "Fiyat: Azalan", "Fiyat: Artan", "Önerilen"]
    },
    ZH: { 
      results: "结果", filter: "筛选", sort: "排序",
      filterTitle: "筛选", sortTitle: "排序", apply: "应用", currency: "CNY",
      addBtn: "加入购物车",
      sortOptions: ["最新上架", "价格：从高到低", "价格：从低到高", "相关性"]
    }
  };

  const lt = localTranslations[lang] || localTranslations['TR'];

  // Ürün Verisi
  const initialProducts = Array.from({ length: 34 }).map((_, i) => ({
    id: `tel-${i}`,
    name: lang === 'TR' ? `EL İŞLEMESİ TELKARİ #${i+101}` : `HANDMADE FILIGREE #${i+101}`,
    price: 4500 + (i * 150), // Sıralamayı test etmek için farklı fiyatlar
    date: i,
    img: `https://picsum.photos/seed/tel-${i}/800/1067`
  }));

  // Sıralama Fonksiyonu
  const sortedProducts = [...initialProducts].sort((a, b) => {
    if (sortType === 1) return b.price - a.price; // Azalan
    if (sortType === 2) return a.price - b.price; // Artan
    return b.date - a.date; // Varsayılan: Yeni
  });

  const Icon = ({ type }) => {
    const icons = {
      filter: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.2"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/></svg>,
      sort: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.2"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/></svg>,
      arrow: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>,
      close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
      check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
      heart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
      bag: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
    };
    return icons[type] || null;
  };

  return (
    <div className="telkari-page-wrapper">
      <div className="telkari-page-fluid">
        
        <div className="filter-section-container">
          <div className="filter-bar-sticky">
            <div className="filter-bar-content">
              <div className="res-count">{initialProducts.length} {lt.results}</div>
              <div className="filter-actions">
                <div className="action-item" onClick={() => setActivePanel('filter')}>
                  <Icon type="filter" /> <span>{lt.filter}</span> <Icon type="arrow" />
                </div>
                <div className="action-item" onClick={() => setActivePanel('sort')}>
                  <Icon type="sort" /> <span>{lt.sort}</span> <Icon type="arrow" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`overlay ${activePanel ? 'visible' : ''}`} onClick={() => setActivePanel(null)} />
        
        <div className={`side-panel ${activePanel ? 'open' : ''}`}>
          <div className="panel-header">
            <span className="panel-title">{activePanel === 'filter' ? lt.filterTitle : lt.sortTitle}</span>
            <div onClick={() => setActivePanel(null)} style={{ cursor: 'pointer' }}><Icon type="close" /></div>
          </div>
          <div className="panel-content">
            {activePanel === 'filter' ? (
              ['KOLEKSİYON', 'MATERYAL', 'RENK', 'FİYAT'].map(item => (
                <div key={item} className="filter-group"><span>{item}</span><Icon type="arrow" /></div>
              ))
            ) : (
              lt.sortOptions.map((opt, i) => (
                <div 
                  key={i} 
                  className={`filter-group sort-option ${sortType === i ? 'active-sort' : ''}`}
                  onClick={() => { setSortType(i); setActivePanel(null); }}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{opt}</span>
                  {sortType === i && <Icon type="check" />}
                </div>
              ))
            )}
          </div>
          <div className="panel-footer">
            <button className="btn-apply-black" onClick={() => setActivePanel(null)}>{lt.apply}</button>
          </div>
        </div>

        <div className="luxury-product-grid">
          {sortedProducts.map((product) => (
            <div key={product.id} className="luxury-item-card">
              <div className="item-img-box">
                <div className="wishlist-btn"><Icon type="heart" /></div>
                <img src={product.img} alt={product.name} />
              </div>

              <div className="item-details">
                <h3>{product.name}</h3>
                <div className="price-row">
                  <p className="price-text">{product.price.toLocaleString()} {lt.currency}</p>
                  <button className="inline-add-btn" onClick={() => addToCart(product)}>
                    <Icon type="bag" />
                    <span>{lt.addBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          .telkari-page-wrapper { width: 100%; min-height: 100vh; }
          .telkari-page-fluid { width: 100%; background: #fff; }

          .filter-section-container { padding-top: 40px; background: #fff; }
          .filter-bar-sticky { position: sticky; top: 155px; background: #fff; z-index: 100; border-top: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2; }
          .filter-bar-content { display: flex; justify-content: space-between; align-items: center; padding: 25px 12%; }

          .res-count { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #888; }
          .filter-actions { display: flex; gap: 40px; }
          .action-item { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 11px; font-weight: 700; letter-spacing: 2px; }

          .luxury-product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px 20px; padding: 40px 12% 100px; }

          .luxury-item-card { width: 100%; position: relative; display: flex; flex-direction: column; }
          .item-img-box { width: 100%; aspect-ratio: 3/4; overflow: hidden; background: #f9f9f9; position: relative; }
          .item-img-box img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
          .luxury-item-card:hover img { transform: scale(1.06); }

          .wishlist-btn { position: absolute; top: 15px; right: 15px; z-index: 5; opacity: 0.4; cursor: pointer; transition: 0.3s; }
          .wishlist-btn:hover { opacity: 1; transform: scale(1.1); }

          .item-details { padding: 15px 0; }
          .item-details h3 { font-size: 10px; font-weight: 400; letter-spacing: 1.5px; margin-bottom: 12px; color: #000; text-transform: uppercase; min-height: 24px; }
          
          .price-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f5f5f5; padding-top: 12px; }
          .price-text { font-size: 12px; font-weight: 600; color: #000; margin: 0; }

          .inline-add-btn { background: transparent; border: none; display: flex; align-items: center; gap: 8px; cursor: pointer; color: #000; transition: 0.3s; position: relative; padding: 0; }
          .inline-add-btn span { font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
          .inline-add-btn::after { content: ''; position: absolute; bottom: -2px; right: 0; width: 0; height: 1px; background: #000; transition: width 0.3s ease; }
          .inline-add-btn:hover::after { width: 100%; left: 0; }

          /* SIDE PANEL STİLLERİ */
          .side-panel { position: fixed; top: 0; right: 0; width: 400px; height: 100%; background: #fff; z-index: 9999; transform: translateX(100%); transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1); box-shadow: -10px 0 30px rgba(0,0,0,0.05); }
          .side-panel.open { transform: translateX(0); }
          .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 30px; border-bottom: 1px solid #f2f2f2; }
          .panel-title { font-size: 14px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase; }
          .panel-content { padding: 20px 30px; }
          
          /* Paneldeki seçeneklerin yazı stili */
          .filter-group { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #f9f9f9; cursor: pointer; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
          .active-sort { font-weight: 700; color: #000; }
          
          .panel-footer { position: absolute; bottom: 0; left: 0; width: 100%; padding: 30px; background: #fff; }
          .btn-apply-black { width: 100%; padding: 18px; background: #000; color: #fff; border: none; font-size: 11px; font-weight: 700; cursor: pointer; letter-spacing: 2px; text-transform: uppercase; }

          .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.2); opacity: 0; visibility: hidden; z-index: 9998; transition: 0.4s; }
          .overlay.visible { opacity: 1; visibility: visible; }

          @media (max-width: 1024px) {
            .luxury-product-grid { grid-template-columns: repeat(3, 1fr); padding: 40px 5%; }
            .filter-bar-content { padding: 20px 5%; }
          }
          @media (max-width: 768px) {
            .filter-bar-sticky { top: 120px; }
            .luxury-product-grid { grid-template-columns: repeat(2, 1fr); gap: 20px 10px; }
            .inline-add-btn span { display: none; }
            .side-panel { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Telkari;