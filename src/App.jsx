import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// Görsel Importları
import headerImage from './header.jpg';
import kadin from './kadin.jpg'; 
import zultanitering from './zultanitering.jpg'; 
import zultanitebracelet from './zultanitebracelet.jpg'; 
import necklace from './necklace.jpg'; 
import telkariImg from './telkari.jpg'; 

// Sayfa Importları
import Store from './Store';
import Telkari from './Telkari'; 
import Jewellery from './Jewellery';
import Watches from './Watches';
import Bags from './Bags';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

export const LanguageContext = createContext();

const translations = {
  EN: {
    findStore: "Find a Store", services: "Services", cart: "Shopping Bag", account: "My Account",
    search: "Search", searchPlaceholder: "Search...", results: "Results", noResults: "No products found.",
    telkari: "Filigree", jewellery: "Jewellery", home: "Home", watches: "Watches",
    bagsAccessories: "Bags & Accessories", discoverCappadocia: "Discover the Cappadocia Series",
    rings: "Rings", bracelets: "Bracelets", necklaces: "Necklaces",
    allJewellery: "All Jewellery", collections: "Collections", newArrivals: "New Arrivals", explore: "EXPLORE",
    telkariHistory: "History of Filigree", masters: "Master Craftsmen", silver: "Silver Collection",
    watchCollections: "Watch Collections", swissMade: "Swiss Made", automatic: "Automatic",
    leatherBags: "Leather Bags", scarves: "Silk Scarves", smallLeather: "Small Leather Goods", accessoriesTitle: "Accessories",
    contactUs: "Contact Us", followUs: "FOLLOW US", customerCare: "CUSTOMER CARE",
    yourBag: "YOUR SHOPPING BAG", emptyBag: "YOUR BAG IS CURRENTLY EMPTY.", total: "TOTAL", checkout: "PROCEED TO CHECKOUT",
    remove: "REMOVE", continueShopping: "CONTINUE SHOPPING", addedMsg: "ADDED TO BAG",
    payNow: "COMPLETE PAYMENT", successMsg: "Payment Successful!"
  },
  TR: {
    findStore: "Mağaza Bul", services: "Hizmetler", cart: "Sepetim", account: "Hesabım",
    search: "Arama", searchPlaceholder: "Ara...", results: "Sonuçlar", noResults: "Ürün bulunamadı.",
    telkari: "Telkari", jewellery: "Mücevherat", home: "Anasayfa", watches: "Saatler",
    bagsAccessories: "Çantalar & Aksesuarlar", discoverCappadocia: "Kapadokya Serisini Keşfedin",
    rings: "Yüzükler", bracelets: "Bilezikler", necklaces: "Kolyeler",
    allJewellery: "Tüm Mücevherat", collections: "Koleksiyonlar", newArrivals: "Yeni Gelenler", explore: "KEŞFET",
    telkariHistory: "Telkari Sanatı Tarihi", masters: "Usta Ellerin Hikayesi", silver: "Gümüş Koleksiyonu",
    watchCollections: "Saat Koleksiyonları", swissMade: "İsviçre Yapımı", automatic: "Otomatik",
    leatherBags: "Deri Çantalar", scarves: "İpek Eşarplar", smallLeather: "Küçük Deri Eşyalar", accessoriesTitle: "Aksesuarlar",
    contactUs: "İletişim", followUs: "TAKİP EDİN", customerCare: "MÜŞTERİ HİZMETLERİ",
    yourBag: "ALIŞVERİŞ SEPETİNİZ", emptyBag: "SEPETİNİZ ŞU ANDA BOŞ.", total: "TOPLAM", checkout: "ÖDEMEYE GEÇ",
    remove: "SİL", continueShopping: "ALIŞVERİŞE DEVAM ET", addedMsg: "SEPETE EKLENDİ",
    payNow: "ÖDEMEYİ TAMAMLA", successMsg: "Ödeme Başarıyla Tamamlandı!"
  },
  ZH: {
    findStore: "查找店铺", services: "服务", cart: "购物篮", account: "我的账户",
    search: "搜索", searchPlaceholder: "搜索...", results: "结果", noResults: "未找到产品",
    telkari: "花丝镶嵌", jewellery: "珠宝", home: "首页", watches: "腕表",
    bagsAccessories: "皮具与配件", discoverCappadocia: "探索卡帕多奇亚系列",
    rings: "戒指", bracelets: "手镯", necklaces: "项链",
    allJewellery: "所有珠宝", collections: "系列", newArrivals: "新品上市", explore: "探索",
    telkariHistory: "花丝镶嵌历史", masters: "大师工匠", silver: "纯银系列",
    watchCollections: "腕表系列", swissMade: "瑞士制造", automatic: "全自动",
    leatherBags: "皮手提包", scarves: "丝巾", smallLeather: "小皮件", accessoriesTitle: "配件",
    contactUs: "联系我们", followUs: "关注我们", customerCare: "客户服务",
    yourBag: "购物篮", emptyBag: "您的购物篮是空的", total: "总计", checkout: "去结账",
    remove: "移除", continueShopping: "继续购物", addedMsg: "已加入购物篮",
    payNow: "完成支付", successMsg: "支付成功"
  }
};  

// SEPET SAYFASI BİLEŞENİ
const Cart = () => {
  const { t, cart, removeFromCart, setCart } = useContext(LanguageContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.price || 0), 0).toFixed(2);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      alert(t.successMsg);
      setCart([]); // Sepeti boşalt
      setIsProcessing(false);
      navigate('/'); // Ana sayfaya dön
    }, 2000);
  };

  return (
    <div className="cart-page-container">
      <div className="section-title">
        <h2>{showCheckout ? t.checkout : t.yourBag}</h2>
        <div className="title-line"></div>
      </div>

      <div className="cart-content-wrapper">
        {cart.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-items-column">
              {!showCheckout ? (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="cart-item-card">
                    <div className="cart-img-wrapper">
                      <img src={item.img} alt={item.name || item.title} />
                    </div>
                    <div className="cart-item-details">
                      <div className="details-header">
                        <h3>{item.name || item.title}</h3>
                        <p className="item-price">{item.price} TL</p>
                      </div>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(index)}>
                        {t.remove}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="checkout-form-container" style={{padding: '20px', background: '#fcfcfc'}}>
                  <form id="pay-form" onSubmit={handlePayment}>
                    <input type="text" placeholder="Full Name" required style={{width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #eee'}} />
                    <input type="text" placeholder="Card Number" maxLength="16" required style={{width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #eee'}} />
                    <div style={{display: 'flex', gap: '10px'}}>
                      <input type="text" placeholder="MM/YY" required style={{flex: 1, padding: '12px', border: '1px solid #eee'}} />
                      <input type="text" placeholder="CVV" maxLength="3" required style={{flex: 1, padding: '12px', border: '1px solid #eee'}} />
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="cart-summary-column">
              <div className="summary-sticky">
                <div className="summary-row">
                  <span>{t.total}</span>
                  <span className="total-amount">{totalPrice} TL</span>
                </div>
                {!showCheckout ? (
                  <button className="checkout-cta" onClick={() => setShowCheckout(true)}>{t.checkout}</button>
                ) : (
                  <button type="submit" form="pay-form" className="checkout-cta" disabled={isProcessing}>
                    {isProcessing ? "..." : t.payNow}
                  </button>
                )}
                <button 
                  onClick={() => showCheckout ? setShowCheckout(false) : navigate('/')} 
                  className="continue-link" 
                  style={{background: 'none', border: 'none', cursor: 'pointer', width: '100%'}}
                >
                  {showCheckout ? "BACK" : t.continueShopping}
                </button>
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
};

const SearchResults = () => {
  const { t } = useContext(LanguageContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || "";

  const allProducts = [
    { id: 1, title: "Zultanite Ring", category: "Jewellery", img: zultanitering },
    { id: 2, title: "Zultanite Bracelet", category: "Jewellery", img: zultanitebracelet },
    { id: 3, title: "Silver Necklace", category: "Jewellery", img: necklace },
    { id: 4, title: "Telkari Masterpiece", category: "Telkari", img: telkariImg },
    { id: 5, title: "Classic Watch", category: "Watches", img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&h=800' },
    { id: 6, title: "Leather Bag", category: "Bags", img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&h=800' },
  ];

  const filtered = allProducts.filter(p => 
    p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );

  return (
    <div className="search-page-absolute">
      <div className="section-title">
        <span className="search-meta-label">{t.search.toUpperCase()}</span>
        <h2>"{query.toUpperCase()}"</h2>
        <div className="title-line"></div>
        <p className="search-stats-info">{filtered.length} {t.results}</p>
      </div>
      
      <div className="search-content-viewport">
        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map(item => (
              <div key={item.id} className="product-card">
                <div className="img-wrapper"><img src={item.img} alt={item.title} /></div>
                <div className="product-info"><span>{item.title}</span></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-lux">
            <span className="empty-icon">×</span>
            <p>{t.noResults.toUpperCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const { t } = useContext(LanguageContext);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  const collectionItems = [
    { id: 1, title: t.rings, img: zultanitering },
    { id: 2, title: t.bracelets, img: zultanitebracelet },
    { id: 3, title: t.necklaces, img: necklace },
    { id: 4, title: t.telkari, img: telkariImg }, 
    { id: 5, title: t.watches, img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&h=800&fit=crop' },
    { id: 6, title: t.bagsAccessories, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&h=800&fit=crop' },
  ];

  return (
    <div className="home-content">
      <div onMouseEnter={() => setIsBannerHovered(true)} onMouseLeave={() => setIsBannerHovered(false)} className="banner-container">
        <img src={kadin} alt="Banner" className={`banner-img ${isBannerHovered ? 'hidden' : ''}`} />
        <img src={headerImage} alt="Hover" className={`banner-img ${isBannerHovered ? '' : 'hidden'}`} />
      </div>
      <div className="section-title">
        <h2>{t.discoverCappadocia}</h2>
        <div className="title-line"></div>
      </div>
      <div className="product-grid">
        {collectionItems.map((item) => (
          <div key={item.id} className="product-card">
            <div className="img-wrapper"><img src={item.img} alt={item.title} /></div>
            <div className="product-info"><span>{item.title}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  const { t } = useContext(LanguageContext);
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-column footer-left">
          <span className="footer-label">{t.customerCare}</span>
          <div className="footer-links">
            <Link to="/store">{t.findStore}</Link>
            <Link to="/">{t.services}</Link>
            <Link to="/">{t.contactUs}</Link>
          </div>
        </div>
        
        <div className="footer-column footer-center">
          <h2 className="footer-logo-main">KIBELE</h2>
          <p className="footer-tagline">CAPPADOCIA • Kibele Jewellery</p>
        </div>

        <div className="footer-column footer-right">
          <span className="footer-label">{t.followUs}</span>
          <div className="contact-icons-container">
            <a href="https://wa.me/+905050349650" target="_blank" rel="noreferrer" className="contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L21 3l-5.5 5.5"></path></svg>
              <span>WHATSAPP</span>
            </a>
            <a href="mailto:kibelejewellery@gmail.com" className="contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>E-MAIL</span>
            </a>
            <a href="https://www.instagram.com/kibele.jewelry/" target="_blank" rel="noreferrer" className="contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <span>INSTAGRAM</span>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 1996 KIBELE. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};

const Header = ({ value, isSearchOpen, setIsSearchOpen, lang, setLang }) => {
  const [query, setQuery] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim() !== "") {
      navigate(`/search?q=${query}`);
      setIsSearchOpen(false);
      setQuery("");
    }
  };

  const SearchIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 8px' }}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  return (
    <header className={showHeader ? 'header-visible' : 'header-hidden'}>
      <div className="top-bar">
        <div className="top-left">
          <Link to="/store" className="top-link">{value.t.findStore}</Link>
          <div className="lang-switcher">
            {['EN', 'TR', 'ZH'].map((l) => (
              <span key={l} onClick={() => setLang(l)} className={lang === l ? 'active' : ''}>{l}</span>
            ))}
          </div>
          <div className="search-box">
            {!isSearchOpen ? (
              <div onClick={() => setIsSearchOpen(true)} className="search-trigger">
                <SearchIcon /> <span>{value.t.search}</span>
              </div>
            ) : (
              <div className="search-input-wrapper">
                <SearchIcon />
                <input 
                  type="text" 
                  placeholder={value.t.searchPlaceholder} 
                  autoFocus 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)} 
                />
              </div>
            )}
          </div>
        </div>
        <div className="top-right">
          <Link to="/cart" className="cart-container-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span>{value.t.cart} ({value.cart.length})</span>
          </Link>
          <span>{value.t.account}</span>
        </div>
      </div>

      <div className="logo-container">
        <Link to="/"><h1>KIBELE</h1></Link>
      </div>

      <nav className="main-nav">
        <Link className="nav-item" to="/telkari">{value.t.telkari}</Link>
        <Link className="nav-item" to="/jewellery">{value.t.jewellery}</Link>
        <Link className="nav-item" to="/watches">{value.t.watches}</Link>
        <Link className="nav-item" to="/bags">{value.t.bagsAccessories}</Link>
        <Link className="nav-item" to="/">{value.t.home}</Link>
      </nav>
    </header>
  );
};

function App() {
  const [lang, setLang] = useState(localStorage.getItem('language') || 'EN'); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // SEPET VE BİLDİRİM STATE'LERİ
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setNotification(product);
    setTimeout(() => setNotification(null), 2000);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => { localStorage.setItem('language', lang); }, [lang]);
  
  // setCart value içerisine eklendi ki Cart bileşeni sepeti boşaltabilsin
  const value = { lang, setLang, t: translations[lang], cart, setCart, addToCart, removeFromCart };

  return (
    <LanguageContext.Provider value={value}>
      <Router>
        <ScrollToTop />
        <div className="app-wrapper">
          
          {notification && (
            <div className="cart-notification-toast">
              <div className="toast-content">
                <img src={notification.img} alt="" />
                <div className="toast-txt">
                  <span className="toast-status">{value.t.addedMsg}</span>
                  <span className="toast-name">{notification.name || notification.title}</span>
                </div>
              </div>
            </div>
          )}

          <Header value={value} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} lang={lang} setLang={setLang} />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/store" element={<Store />} />
              <Route path="/telkari" element={<Telkari />} />
              <Route path="/jewellery" element={<Jewellery />} />
              <Route path="/watches" element={<Watches />} />
              <Route path="/bags" element={<Bags />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <style>{`
          * { box-sizing: border-box; outline: none; color: #000 !important; }
          html, body, #root { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 100% !important; 
            max-width: none !important; 
            background-color: #fff;
            font-family: 'Inter', sans-serif;
          }
          
          .app-wrapper { width: 100%; min-height: 100vh; display: flex; flex-direction: column; }
          
          main { 
            flex: 1; 
            width: 100% !important; 
            display: block !important; 
            margin: 0 !important; 
            padding: 180px 0 0 0 !important;
          }

          /* HEADER */
          header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            background-color: #fff;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .header-visible { transform: translateY(0); }
          .header-hidden { transform: translateY(-100%); }

          .top-bar { display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; border-bottom: 1px solid #f0f0f0; }
          .top-left, .top-right { display: flex; gap: 30px; align-items: center; flex: 1; }
          .top-right { justify-content: flex-end; }
          .top-link { font-size: 11px; text-decoration: none; letter-spacing: 1px; }
          .lang-switcher span { cursor: pointer; font-size: 11px; margin: 0 5px; opacity: 0.5; }
          .lang-switcher span.active { opacity: 1; font-weight: bold; }
          .search-trigger { display: flex; align-items: center; cursor: pointer; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
          .search-input-wrapper { display: flex; align-items: center; border-bottom: 1px solid #000; padding-bottom: 2px; }
          .search-input-wrapper input { border: none; font-size: 11px; padding: 0 5px; width: 120px; text-transform: uppercase; letter-spacing: 1px; background: transparent; }
          
          .cart-container-link { display: flex; align-items: center; gap: 8px; text-decoration: none; cursor: pointer; }
          .cart-container-link span { font-size: 11px; letter-spacing: 1px; }

          .logo-container { text-align: center; padding: 30px 0 10px; }
          .logo-container h1 { font-family: 'serif'; font-size: 52px; font-weight: 200; letter-spacing: 18px; margin: 0; }
          
          .main-nav { display: flex; justify-content: center; gap: 50px; padding: 10px 0 30px; }
          .nav-item { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; text-decoration: none; font-weight: 300; transition: opacity 0.3s; }
          .nav-item:hover { opacity: 0.6; }

          /* BİLDİRİM TOAST CSS */
          .cart-notification-toast {
            position: fixed;
            top: 100px;
            right: 30px;
            background: #fff;
            border: 1px solid #000;
            padding: 15px;
            z-index: 10001;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            animation: slideIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
          .toast-content { display: flex; gap: 15px; align-items: center; }
          .toast-content img { width: 50px; height: 65px; object-fit: cover; }
          .toast-txt { display: flex; flex-direction: column; }
          .toast-status { font-size: 9px; font-weight: 800; letter-spacing: 1px; color: #555 !important; }
          .toast-name { font-size: 11px; margin-top: 4px; letter-spacing: 0.5px; }

          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          /* CART PAGE SPECIFIC */
          .cart-page-container { padding: 40px; min-height: 60vh; }
          .cart-content-wrapper { max-width: 1400px; margin: 0 auto; width: 100%; }
          .cart-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 100px; }
          
          .cart-item-card { display: flex; gap: 30px; padding: 30px 0; border-bottom: 1px solid #eee; }
          .cart-img-wrapper { width: 140px; aspect-ratio: 3/4; overflow: hidden; background: #f9f9f9; }
          .cart-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
          
          .cart-item-details { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
          .details-header h3 { font-size: 14px; letter-spacing: 1px; font-weight: 400; margin: 0 0 10px 0; }
          .item-price { font-size: 13px; color: #555; }
          .cart-remove-btn { 
             background: none; border: none; padding: 0; cursor: pointer; 
             font-size: 10px; letter-spacing: 1px; text-decoration: underline; width: fit-content;
             opacity: 0.5; transition: opacity 0.3s;
          }
          .cart-remove-btn:hover { opacity: 1; }

          .summary-sticky { position: sticky; top: 220px; background: #fcfcfc; padding: 40px; border: 1px solid #f5f5f5; }
          .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
          .summary-row span { font-size: 12px; letter-spacing: 2px; font-weight: 600; }
          .total-amount { font-size: 16px !important; }
          
          .checkout-cta { 
            width: 100%; background: #000; color: #fff !important; border: none; padding: 18px;
            font-size: 11px; letter-spacing: 3px; cursor: pointer; transition: opacity 0.3s;
          }
          .checkout-cta:hover { opacity: 0.8; }
          .continue-link { 
            display: block; text-align: center; margin-top: 20px; font-size: 10px; 
            letter-spacing: 1px; text-decoration: none; opacity: 0.6;
          }

          .empty-state-lux { text-align: center; padding: 100px 0; }
          .explore-btn-simple { 
            display: inline-block; margin-top: 30px; padding: 12px 30px; border: 1px solid #000;
            text-decoration: none; font-size: 11px; letter-spacing: 2px;
          }

          /* BANNER & GRID */
          .banner-container { width: 100%; height: 85vh; position: relative; overflow: hidden; }
          .banner-img { width: 100%; height: 100%; object-fit: cover; position: absolute; transition: opacity 1s ease; }
          .banner-img.hidden { opacity: 0; }
          
          .section-title { text-align: center; padding: 80px 0 50px; width: 100%; }
          .section-title h2 { font-size: 18px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase; }
          .title-line { width: 50px; height: 1px; background: #000; margin: 20px auto; }

          .product-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 15px; padding: 0 40px 100px; width: 100%; }
          .img-wrapper { aspect-ratio: 3/4; overflow: hidden; background: #f9f9f9; }
          .img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s ease; }
          .img-wrapper:hover img { transform: scale(1.05); }
          .product-info { padding: 15px 0; font-size: 10px; text-align: center; letter-spacing: 1px; text-transform: uppercase; }

          /* FOOTER */
          .footer-container { background-color: #fff; padding: 100px 40px 40px; border-top: 1px solid #f2f2f2; }
          .footer-content { display: grid; grid-template-columns: 1fr 2fr 1fr; align-items: flex-start; max-width: 1600px; margin: 0 auto; }
          .footer-column { display: flex; flex-direction: column; }
          .footer-center { align-items: center; text-align: center; }
          .footer-right { align-items: flex-end; }
          .footer-label { font-size: 10px; letter-spacing: 2px; color: #999; margin-bottom: 25px; font-weight: 600; }
          .footer-links { display: flex; flex-direction: column; gap: 12px; }
          .footer-links a { font-size: 11px; text-decoration: none; letter-spacing: 1px; transition: opacity 0.3s; opacity: 0.7; }
          .footer-logo-main { font-size: 38px; font-weight: 200; letter-spacing: 14px; margin: 0 0 10px 0; }
          .footer-tagline { font-size: 9px; letter-spacing: 4px; color: #888; font-weight: 300; }
          .contact-icons-container { display: flex; gap: 35px; }
          .contact-item { display: flex; flex-direction: column; align-items: center; gap: 10px; text-decoration: none; transition: transform 0.4s ease; }
          .contact-item span { font-size: 9px; letter-spacing: 1.5px; }
          .footer-bottom { margin-top: 80px; padding-top: 30px; border-top: 1px solid #f9f9f9; text-align: center; }
          .footer-bottom p { font-size: 9px; letter-spacing: 2px; color: #bbb; }

          @media (max-width: 1200px) { 
            .product-grid { grid-template-columns: repeat(4, 1fr); } 
            .cart-layout { gap: 40px; }
          }
          @media (max-width: 992px) {
            .footer-content { grid-template-columns: 1fr; gap: 60px; }
            .footer-left, .footer-right { align-items: center; text-align: center; }
            .footer-center { order: -1; }
            .cart-layout { grid-template-columns: 1fr; }
          }
          @media (max-width: 768px) { 
            .product-grid { grid-template-columns: repeat(2, 1fr); padding: 0 20px 60px; }
            .logo-container h1 { font-size: 32px; letter-spacing: 8px; }
            main { padding-top: 160px !important; }
          }
        `}</style>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;