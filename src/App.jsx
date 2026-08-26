import heroVideo from "./videos/zultanite.mp4";
import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ResetPassword from "./ResetPassword";
import Account from "./Account";
import { supabase } from './supabaseClient';
// Görsel Importları
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
  const { pathname, search } = useLocation();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, search]);

  return null;
};

export const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = ['EN', 'TR', 'ZH', 'ES'];

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'TR';

  try {
    const savedLanguage = String(
      window.localStorage.getItem('language') || ''
    ).toUpperCase();

    return SUPPORTED_LANGUAGES.includes(savedLanguage)
      ? savedLanguage
      : 'TR';
  } catch {
    return 'TR';
  }
};

const translations = {
  EN: {
    findStore: "Find a Store", services: "Services", cart: "Shopping Bag", account: "My Account",
    search: "Search", searchPlaceholder: "Search...", results: "Results", noResults: "No products found.",
    telkari: "Create Your Own", jewellery: "Zultanite", jewelleryMenu: "Jewellery", earringsMenu: "Earrings", necklacesMenu: "Necklaces", ringsMenu: "Rings", charmsMenu: "Charms", braceletsMenu: "Bracelets", allJewelleryMenu: "All Jewellery", gold: "Gold", home: "Home", watches: "Watches",
    bagsAccessories: "Bags & Accessories", naturalStones: "Natural Stones", cappadociaSeries: "Cappadocia Series", balloon: "Balloon", evilEye: "Turkish Eye", discoverCappadocia: "Discover the Cappadocia Series",
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
    telkari: "Kendin Yap", jewellery: "Zultanite", jewelleryMenu: "Takılar", earringsMenu: "Küpeler", necklacesMenu: "Kolyeler", ringsMenu: "Yüzükler", charmsMenu: "Charmlar", braceletsMenu: "Bileklikler", allJewelleryMenu: "Tüm Takılar", gold: "Altın", home: "Anasayfa", watches: "Saatler",
    bagsAccessories: "Çantalar & Aksesuarlar", naturalStones: "Doğal Taşlar", cappadociaSeries: "Kapadokya Serisi", balloon: "Balon", evilEye: "Nazar", discoverCappadocia: "Kapadokya Serisini Keşfedin",
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
    telkari: "自定义设计", jewellery: "苏丹石", jewelleryMenu: "珠宝", earringsMenu: "耳环", necklacesMenu: "项链", ringsMenu: "戒指", charmsMenu: "吊饰", braceletsMenu: "手链", allJewelleryMenu: "全部珠宝", gold: "黄金", home: "首页", watches: "腕表",
    bagsAccessories: "皮具与配件", naturalStones: "天然宝石", cappadociaSeries: "卡帕多奇亚系列", balloon: "热气球", evilEye: "纳扎尔之眼", discoverCappadocia: "探索卡帕多奇亚系列",
    rings: "戒指", bracelets: "手镯", necklaces: "项链",
    allJewellery: "所有珠宝", collections: "系列", newArrivals: "新品上市", explore: "探索",
    telkariHistory: "花丝镶嵌历史", masters: "大师工匠", silver: "纯银系列",
    watchCollections: "腕表系列", swissMade: "瑞士制造", automatic: "全自动",
    leatherBags: "皮手提包", scarves: "丝巾", smallLeather: "小皮件", accessoriesTitle: "配件",
    contactUs: "联系我们", followUs: "关注我们", customerCare: "客户服务",
    yourBag: "购物篮", emptyBag: "您的购物篮是空的", total: "总计", checkout: "去结账",
    remove: "移除", continueShopping: "继续购物", addedMsg: "已加入购物篮",
    payNow: "完成支付", successMsg: "支付成功"
  },
  ES: {
    findStore: "Buscar una tienda", services: "Servicios", cart: "Bolsa de compra", account: "Mi cuenta",
    search: "Buscar", searchPlaceholder: "Buscar...", results: "Resultados", noResults: "No se encontraron productos.",
    telkari: "Crea tu joya", jewellery: "Zultanita", jewelleryMenu: "Joyería", earringsMenu: "Pendientes", necklacesMenu: "Collares", ringsMenu: "Anillos", charmsMenu: "Dijes", braceletsMenu: "Pulseras", allJewelleryMenu: "Toda la joyería", gold: "Oro", home: "Inicio", watches: "Relojes",
    bagsAccessories: "Bolsos y accesorios", naturalStones: "Piedras naturales", cappadociaSeries: "Serie Capadocia", balloon: "Globo", evilEye: "Ojo turco", discoverCappadocia: "Descubre la colección Capadocia",
    rings: "Anillos", bracelets: "Pulseras", necklaces: "Collares",
    allJewellery: "Toda la joyería", collections: "Colecciones", newArrivals: "Novedades", explore: "EXPLORAR",
    telkariHistory: "Historia de la filigrana", masters: "Maestros artesanos", silver: "Colección de plata",
    watchCollections: "Colecciones de relojes", swissMade: "Hecho en Suiza", automatic: "Automático",
    leatherBags: "Bolsos de cuero", scarves: "Pañuelos de seda", smallLeather: "Pequeños artículos de cuero", accessoriesTitle: "Accesorios",
    contactUs: "Contacto", followUs: "SÍGUENOS", customerCare: "ATENCIÓN AL CLIENTE",
    yourBag: "TU BOLSA DE COMPRA", emptyBag: "TU BOLSA ESTÁ VACÍA.", total: "TOTAL", checkout: "CONTINUAR AL PAGO",
    remove: "ELIMINAR", continueShopping: "SEGUIR COMPRANDO", addedMsg: "AÑADIDO A LA BOLSA",
    payNow: "COMPLETAR EL PAGO", successMsg: "¡Pago realizado correctamente!"
  }
};  

const jewellerySubmenuCopy = {
  TR: {
    zultaniteNecklaces: "Zultanite Kolyeler", paraibaNecklaces: "Turmalin Paraiba Kolyeler", citrineNecklaces: "Sitrin Kolyeler", moissaniteNecklaces: "Mozanit Kolyeler", minimalNecklaces: "Minimal Kolyeler", statementNecklaces: "Gösterişli Kolyeler",
    zultaniteEarrings: "Zultanite Küpeler", paraibaEarrings: "Turmalin Paraiba Küpeler", citrineEarrings: "Sitrin Küpeler", moissaniteEarrings: "Mozanit Küpeler", dropEarrings: "Damla Küpeler", hoopEarrings: "Halka Küpeler",
    zultaniteRings: "Zultanite Yüzükler", paraibaRings: "Turmalin Paraiba Yüzükler", citrineRings: "Sitrin Yüzükler", moissaniteRings: "Mozanit Yüzükler", solitaireRings: "Tektaş Yüzükler", cocktailRings: "Kokteyl Yüzükler",
    zultaniteBracelets: "Zultanite Bileklikler", chainBracelets: "Zincir Bileklikler", gemstoneBracelets: "Taşlı Bileklikler",
    necklaceCharms: "Kolye Charmları", braceletCharms: "Bileklik Charmları", charms: "Charmlar", collectionTitle: "ZULTANITE KOLEKSİYONU"
  },
  EN: {
    zultaniteNecklaces: "Zultanite Necklaces", paraibaNecklaces: "Paraiba Tourmaline Necklaces", citrineNecklaces: "Citrine Necklaces", moissaniteNecklaces: "Moissanite Necklaces", minimalNecklaces: "Minimal Necklaces", statementNecklaces: "Statement Necklaces",
    zultaniteEarrings: "Zultanite Earrings", paraibaEarrings: "Paraiba Tourmaline Earrings", citrineEarrings: "Citrine Earrings", moissaniteEarrings: "Moissanite Earrings", dropEarrings: "Drop Earrings", hoopEarrings: "Hoop Earrings",
    zultaniteRings: "Zultanite Rings", paraibaRings: "Paraiba Tourmaline Rings", citrineRings: "Citrine Rings", moissaniteRings: "Moissanite Rings", solitaireRings: "Solitaire Rings", cocktailRings: "Cocktail Rings",
    zultaniteBracelets: "Zultanite Bracelets", chainBracelets: "Chain Bracelets", gemstoneBracelets: "Gemstone Bracelets",
    necklaceCharms: "Necklace Charms", braceletCharms: "Bracelet Charms", charms: "Charms", collectionTitle: "ZULTANITE COLLECTION"
  },
  ZH: {
    zultaniteNecklaces: "苏丹石项链", paraibaNecklaces: "帕拉伊巴碧玺项链", citrineNecklaces: "黄水晶项链", moissaniteNecklaces: "莫桑石项链", minimalNecklaces: "简约项链", statementNecklaces: "个性项链",
    zultaniteEarrings: "苏丹石耳环", paraibaEarrings: "帕拉伊巴碧玺耳环", citrineEarrings: "黄水晶耳环", moissaniteEarrings: "莫桑石耳环", dropEarrings: "水滴耳环", hoopEarrings: "圈形耳环",
    zultaniteRings: "苏丹石戒指", paraibaRings: "帕拉伊巴碧玺戒指", citrineRings: "黄水晶戒指", moissaniteRings: "莫桑石戒指", solitaireRings: "单石戒指", cocktailRings: "鸡尾酒戒指",
    zultaniteBracelets: "苏丹石手链", chainBracelets: "链式手链", gemstoneBracelets: "宝石手链",
    necklaceCharms: "项链吊饰", braceletCharms: "手链吊饰", charms: "吊饰", collectionTitle: "苏丹石系列"
  },
  ES: {
    zultaniteNecklaces: "Collares de Zultanita", paraibaNecklaces: "Collares de turmalina Paraíba", citrineNecklaces: "Collares de citrino", moissaniteNecklaces: "Collares de moissanita", minimalNecklaces: "Collares minimalistas", statementNecklaces: "Collares llamativos",
    zultaniteEarrings: "Pendientes de Zultanita", paraibaEarrings: "Pendientes de turmalina Paraíba", citrineEarrings: "Pendientes de citrino", moissaniteEarrings: "Pendientes de moissanita", dropEarrings: "Pendientes de lágrima", hoopEarrings: "Pendientes de aro",
    zultaniteRings: "Anillos de Zultanita", paraibaRings: "Anillos de turmalina Paraíba", citrineRings: "Anillos de citrino", moissaniteRings: "Anillos de moissanita", solitaireRings: "Anillos solitarios", cocktailRings: "Anillos de cóctel",
    zultaniteBracelets: "Pulseras de Zultanita", chainBracelets: "Pulseras de cadena", gemstoneBracelets: "Pulseras con gemas",
    necklaceCharms: "Dijes para collares", braceletCharms: "Dijes para pulseras", charms: "Dijes", collectionTitle: "COLECCIÓN ZULTANITA"
  }
};

const naturalStoneMenuCopy = {
  TR: [
    { slug: "aquamarine", label: "Akuamarin Taşı" },
    { slug: "zultanite", label: "Diaspor (Zultanite)" },
    { slug: "diamond", label: "Elmas" },
    { slug: "opal", label: "Opal" },
    { slug: "sapphire", label: "Safir" },
    { slug: "citrine", label: "Sitrin" },
    { slug: "tanzanite", label: "Tanzanit" },
    { slug: "topaz", label: "Topaz" },
    { slug: "tourmaline", label: "Turmalin" },
    { slug: "ruby", label: "Yakut" },
    { slug: "zircon", label: "Zirkon" },
    { slug: "emerald", label: "Zümrüt" },
  ],
  EN: [
    { slug: "aquamarine", label: "Aquamarine" },
    { slug: "zultanite", label: "Diaspore (Zultanite)" },
    { slug: "diamond", label: "Diamond" },
    { slug: "opal", label: "Opal" },
    { slug: "sapphire", label: "Sapphire" },
    { slug: "citrine", label: "Citrine" },
    { slug: "tanzanite", label: "Tanzanite" },
    { slug: "topaz", label: "Topaz" },
    { slug: "tourmaline", label: "Tourmaline" },
    { slug: "ruby", label: "Ruby" },
    { slug: "zircon", label: "Zircon" },
    { slug: "emerald", label: "Emerald" },
  ],
  ZH: [
    { slug: "aquamarine", label: "海蓝宝石" },
    { slug: "zultanite", label: "硬水铝石（苏丹石）" },
    { slug: "diamond", label: "钻石" },
    { slug: "opal", label: "欧泊" },
    { slug: "sapphire", label: "蓝宝石" },
    { slug: "citrine", label: "黄水晶" },
    { slug: "tanzanite", label: "坦桑石" },
    { slug: "topaz", label: "托帕石" },
    { slug: "tourmaline", label: "碧玺" },
    { slug: "ruby", label: "红宝石" },
    { slug: "zircon", label: "锆石" },
    { slug: "emerald", label: "祖母绿" },
  ],
  ES: [
    { slug: "aquamarine", label: "Aguamarina" },
    { slug: "zultanite", label: "Diásporo (Zultanita)" },
    { slug: "diamond", label: "Diamante" },
    { slug: "opal", label: "Ópalo" },
    { slug: "sapphire", label: "Zafiro" },
    { slug: "citrine", label: "Citrino" },
    { slug: "tanzanite", label: "Tanzanita" },
    { slug: "topaz", label: "Topacio" },
    { slug: "tourmaline", label: "Turmalina" },
    { slug: "ruby", label: "Rubí" },
    { slug: "zircon", label: "Circón" },
    { slug: "emerald", label: "Esmeralda" },
  ],
};

// SEPET SAYFASI BİLEŞENİ
const Cart = () => {
  const { t, cart, removeFromCart, setCart, formatPrice } = useContext(LanguageContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const totalPrice = cart.reduce(
    (acc, item) => acc + Number(item.price || 0),
    0
  );

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
                        <p className="item-price">{formatPrice(item.price)}</p>
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
                  <span className="total-amount">{formatPrice(totalPrice)}</span>
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
  const { t, lang, formatPrice } = useContext(LanguageContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.trim() || "";
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeSearchText = (value) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/ı/g, 'i')
      .trim();

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (!isMounted) return;

      if (error) {
        console.error('Arama ürünleri yüklenemedi:', error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setIsLoading(false);
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedQuery = normalizeSearchText(query);
  const filtered = products.filter((product) => {
    // in_stock alanı olmayan/eski ürünler de aramada görünsün.
    // Yalnızca açıkça stok dışı işaretlenen ürünleri gizle.
    if (product.in_stock === false) return false;

    const searchableText = [
      product.name,
      product.title,
      product.name_tr,
      product.name_en,
      product.name_zh,
      product.name_es,
      product.title_tr,
      product.title_en,
      product.title_zh,
      product.title_es,
      product.nameTR,
      product.nameEN,
      product.nameZH,
      product.description,
      product.description_tr,
      product.description_en,
      product.description_zh,
      product.description_es,
      product.category,
      product.stone,
      product.metal,
      product.series,
      product.collection,
      product.slug,
      product.sku,
      product.code,
      ...Object.values(product),
    ]
      .filter(Boolean)
      .join(' ');

    return normalizeSearchText(searchableText).includes(normalizedQuery);
  });

  const getProductTitle = (product) => {
    if (lang === 'EN') return product.name_en || product.title_en || product.nameEN || product.name || product.title;
    if (lang === 'ZH') return product.name_zh || product.title_zh || product.nameZH || product.name || product.title;
    if (lang === 'ES') return product.name_es || product.title_es || product.name || product.title;
    return product.name_tr || product.title_tr || product.nameTR || product.name || product.title;
  };

  return (
    <div className="search-page-absolute">
      <div className="section-title">
        <span className="search-meta-label">{t.search.toUpperCase()}</span>
        <h2>"{query}"</h2>
        <div className="title-line"></div>
        <p className="search-stats-info">
          {isLoading ? '...' : filtered.length} {t.results}
        </p>
      </div>
      
      <div className="search-content-viewport">
        {isLoading ? (
          <div className="empty-state-lux">
            <p>...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map(item => (
              <div key={item.id} className="product-card">
                <div className="img-wrapper">
                  <img
                    src={item.image_url || item.image || item.img}
                    alt={getProductTitle(item)}
                  />
                </div>
                <div className="product-info">
                  <span>{getProductTitle(item)}</span>
                  {item.price != null && <small>{formatPrice(item.price)}</small>}
                </div>
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

  const collectionItems = [
    { id: 1, title: t.rings, img: "/categories/yuzuk.png" },
    { id: 2, title: t.bracelets, img: "/categories/bileklik.png" },
    { id: 3, title: t.necklaces, img: "/categories/kolye.png" },
    { id: 4, title: t.telkari, img: "/categories/kendin-yap.png" },
    { id: 5, title: t.watches, img: "/categories/saat.png" },
    { id: 6, title: t.bagsAccessories, img: "/categories/canta.png" },
  ];

  return (
    <div className="home-content">
      <div className="banner-container">
        <video
          className="banner-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src={heroVideo}
            type="video/mp4"
          />
        </video>
</div>
      <section className="home-collections">
        <div className="home-collections-heading">
          <span className="home-collections-kicker">KIBELE • CAPPADOCIA</span>
          <h2>{t.discoverCappadocia}</h2>
          <div className="home-collections-line"></div>
        </div>

        <div className="home-collections-grid">
          {collectionItems.map((item, index) => (
            <article key={item.id} className="home-collection-card">
              <div className="home-collection-image-wrap">
                <img src={item.img} alt={item.title} />
                <div className="home-collection-overlay"></div>
                <span className="home-collection-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="home-collection-content">
                  <h3>{item.title}</h3>
                  <span className="home-collection-link">{t.explore}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};



const CreateYourOwn = () => {
  const { lang } = useContext(LanguageContext);
  const [productType, setProductType] = useState("ring");
  const [metal, setMetal] = useState("silver");
  const [stone, setStone] = useState("zultanite");
  const [shape, setShape] = useState("round");
  const [engraving, setEngraving] = useState("");

  const copy = {
    TR: {
      kicker: "KIBELE • ATÖLYE",
      title: "KENDİN YAP",
      intro: "Kendi takını tasarla. Ürün türünü, metali, taşı ve kesimi seç; tasarımını Kibele atölyesine gönder.",
      product: "ÜRÜN",
      metal: "METAL",
      stone: "TAŞ",
      shape: "KESİM",
      engraving: "KİŞİSELLEŞTİRME",
      engravingPlaceholder: "İsim, tarih veya kısa not",
      ring: "Yüzük",
      necklace: "Kolye",
      bracelet: "Bileklik",
      earring: "Küpe",
      silver: "925 Gümüş",
      gold: "14K Altın",
      whiteGold: "Beyaz Altın",
      zultanite: "Zultanite",
      aquamarine: "Aquamarine",
      paraiba: "Paraiba",
      quartz: "Pink Quartz",
      round: "Yuvarlak",
      oval: "Oval",
      pear: "Damla",
      emerald: "Emerald",
      preview: "TASARIMIN",
      summary: "SEÇİMLERİN",
      send: "TASARIMI WHATSAPP'TAN GÖNDER",
      note: "Bu alan ön tasarım içindir. Son ölçü, taş uygunluğu, fiyat ve üretim detayları atölye tarafından onaylanır."
    },
    EN: {
      kicker: "KIBELE • ATELIER",
      title: "CREATE YOUR OWN",
      intro: "Design your own jewellery. Choose the piece, metal, gemstone and cut, then send your design to the Kibele atelier.",
      product: "PIECE",
      metal: "METAL",
      stone: "GEMSTONE",
      shape: "CUT",
      engraving: "PERSONALISATION",
      engravingPlaceholder: "Name, date or a short note",
      ring: "Ring",
      necklace: "Necklace",
      bracelet: "Bracelet",
      earring: "Earrings",
      silver: "925 Silver",
      gold: "14K Gold",
      whiteGold: "White Gold",
      zultanite: "Zultanite",
      aquamarine: "Aquamarine",
      paraiba: "Paraiba",
      quartz: "Pink Quartz",
      round: "Round",
      oval: "Oval",
      pear: "Pear",
      emerald: "Emerald",
      preview: "YOUR DESIGN",
      summary: "YOUR SELECTION",
      send: "SEND DESIGN VIA WHATSAPP",
      note: "This is a preliminary design tool. Final sizing, gemstone availability, price and production details are confirmed by the atelier."
    },
    ZH: {
      kicker: "KIBELE • 工坊",
      title: "自定义设计",
      intro: "设计属于您的珠宝。选择款式、金属、宝石和切割方式，然后将设计发送给 Kibele 工坊。",
      product: "款式",
      metal: "金属",
      stone: "宝石",
      shape: "切割",
      engraving: "个性化",
      engravingPlaceholder: "姓名、日期或简短文字",
      ring: "戒指",
      necklace: "项链",
      bracelet: "手链",
      earring: "耳环",
      silver: "925 银",
      gold: "14K 黄金",
      whiteGold: "白金",
      zultanite: "苏丹石",
      aquamarine: "海蓝宝石",
      paraiba: "帕拉伊巴",
      quartz: "粉晶",
      round: "圆形",
      oval: "椭圆形",
      pear: "水滴形",
      emerald: "祖母绿形",
      preview: "您的设计",
      summary: "您的选择",
      send: "通过 WHATSAPP 发送设计",
      note: "此工具用于初步设计。最终尺寸、宝石库存、价格及制作细节由工坊确认。"
    },
    ES: {
      kicker: "KIBELE • ATELIER",
      title: "CREA TU JOYA",
      intro: "Diseña tu propia joya. Elige la pieza, el metal, la gema y el corte, y envía tu diseño al atelier de Kibele.",
      product: "PIEZA",
      metal: "METAL",
      stone: "GEMA",
      shape: "CORTE",
      engraving: "PERSONALIZACIÓN",
      engravingPlaceholder: "Nombre, fecha o una nota breve",
      ring: "Anillo",
      necklace: "Collar",
      bracelet: "Pulsera",
      earring: "Pendientes",
      silver: "Plata 925",
      gold: "Oro de 14K",
      whiteGold: "Oro blanco",
      zultanite: "Zultanita",
      aquamarine: "Aguamarina",
      paraiba: "Paraíba",
      quartz: "Cuarzo rosa",
      round: "Redondo",
      oval: "Ovalado",
      pear: "Pera",
      emerald: "Esmeralda",
      preview: "TU DISEÑO",
      summary: "TU SELECCIÓN",
      send: "ENVIAR EL DISEÑO POR WHATSAPP",
      note: "Esta herramienta sirve como diseño preliminar. El atelier confirmará las medidas finales, la disponibilidad de gemas, el precio y los detalles de producción."
    }
  };

  const c = copy[lang] || copy.EN;

  const productOptions = [
    { value: "ring", label: c.ring },
    { value: "necklace", label: c.necklace },
    { value: "bracelet", label: c.bracelet },
    { value: "earring", label: c.earring }
  ];

  const metalOptions = [
    { value: "silver", label: c.silver },
    { value: "gold", label: c.gold },
    { value: "whiteGold", label: c.whiteGold }
  ];

  const stoneOptions = [
    { value: "zultanite", label: c.zultanite },
    { value: "aquamarine", label: c.aquamarine },
    { value: "paraiba", label: c.paraiba },
    { value: "quartz", label: c.quartz }
  ];

  const shapeOptions = [
    { value: "round", label: c.round },
    { value: "oval", label: c.oval },
    { value: "pear", label: c.pear },
    { value: "emerald", label: c.emerald }
  ];

  const labelOf = (items, key) => items.find((item) => item.value === key)?.label || key;

  const whatsappText = encodeURIComponent(
    `${c.title}\n${c.product}: ${labelOf(productOptions, productType)}\n${c.metal}: ${labelOf(metalOptions, metal)}\n${c.stone}: ${labelOf(stoneOptions, stone)}\n${c.shape}: ${labelOf(shapeOptions, shape)}${engraving ? `\n${c.engraving}: ${engraving}` : ""}`
  );

  const stoneSymbol = shape === "round" ? "●" : shape === "oval" ? "⬭" : shape === "pear" ? "♦" : "◆";

  return (
    <div className="custom-design-page">
      <section className="custom-design-intro">
        <span>{c.kicker}</span>
        <h1>{c.title}</h1>
        <div className="custom-design-line"></div>
        <p>{c.intro}</p>
      </section>

      <section className="custom-design-studio">
        <div className="custom-design-controls">
          <div className="custom-option-group">
            <div className="custom-group-heading">
              <h3>{c.product}</h3>
              <span>{labelOf(productOptions, productType)}</span>
            </div>
            <div className="custom-option-grid custom-product-options">
              {productOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`custom-visual-option ${productType === item.value ? "selected" : ""}`}
                  onClick={() => setProductType(item.value)}
                  aria-pressed={productType === item.value}
                >
                  <span className={`product-choice-icon product-choice-${item.value}`} aria-hidden="true">
                    <span></span>
                  </span>
                  <span className="custom-option-label">{item.label}</span>
                  <span className="custom-selected-check">✓</span>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-option-group">
            <div className="custom-group-heading">
              <h3>{c.metal}</h3>
              <span>{labelOf(metalOptions, metal)}</span>
            </div>
            <div className="custom-option-grid custom-metal-options">
              {metalOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`custom-visual-option ${metal === item.value ? "selected" : ""}`}
                  onClick={() => setMetal(item.value)}
                  aria-pressed={metal === item.value}
                >
                  <span className={`metal-choice-swatch metal-choice-${item.value}`} aria-hidden="true"></span>
                  <span className="custom-option-label">{item.label}</span>
                  <span className="custom-selected-check">✓</span>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-option-group">
            <div className="custom-group-heading">
              <h3>{c.stone}</h3>
              <span>{labelOf(stoneOptions, stone)}</span>
            </div>
            <div className="custom-option-grid custom-stone-options">
              {stoneOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`custom-visual-option ${stone === item.value ? "selected" : ""}`}
                  onClick={() => setStone(item.value)}
                  aria-pressed={stone === item.value}
                >
                  <span className={`stone-choice-gem stone-choice-${item.value}`} aria-hidden="true"></span>
                  <span className="custom-option-label">{item.label}</span>
                  <span className="custom-selected-check">✓</span>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-option-group">
            <div className="custom-group-heading">
              <h3>{c.shape}</h3>
              <span>{labelOf(shapeOptions, shape)}</span>
            </div>
            <div className="custom-option-grid custom-shape-options">
              {shapeOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`custom-visual-option ${shape === item.value ? "selected" : ""}`}
                  onClick={() => setShape(item.value)}
                  aria-pressed={shape === item.value}
                >
                  <span className={`shape-choice-icon shape-choice-${item.value}`} aria-hidden="true"></span>
                  <span className="custom-option-label">{item.label}</span>
                  <span className="custom-selected-check">✓</span>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-option-group">
            <h3>{c.engraving}</h3>
            <input
              className="custom-engraving-input"
              type="text"
              maxLength="40"
              value={engraving}
              onChange={(e) => setEngraving(e.target.value)}
              placeholder={c.engravingPlaceholder}
            />
          </div>
        </div>

        <div className="custom-design-preview-column">
          <div className={`custom-design-preview metal-${metal} stone-${stone} cut-${shape}`}>
            <div className="custom-preview-topbar">
              <span className="custom-preview-label">{c.preview}</span>
              <div className="custom-preview-chips">
                <span className={`preview-metal-dot metal-choice-${metal}`}></span>
                <span>{labelOf(metalOptions, metal)}</span>
                <span className={`preview-stone-dot stone-choice-${stone}`}></span>
                <span>{labelOf(stoneOptions, stone)}</span>
              </div>
            </div>
            <div className={`custom-jewel custom-${productType}`}>
              <span className={`custom-stone shape-${shape}`}>{stoneSymbol}</span>
            </div>
            <div className="custom-preview-cut">{labelOf(shapeOptions, shape)}</div>
            {engraving && <span className="custom-engraving-preview">{engraving}</span>}
          </div>

          <div className="custom-design-summary">
            <span className="custom-summary-title">{c.summary}</span>
            <p>{labelOf(productOptions, productType)} • {labelOf(metalOptions, metal)}</p>
            <p>{labelOf(stoneOptions, stone)} • {labelOf(shapeOptions, shape)}</p>
            {engraving && <p>“{engraving}”</p>}
            <a
              className="custom-send-button"
              href={`https://wa.me/905050349650?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
            >
              {c.send}
            </a>
            <small>{c.note}</small>
          </div>
        </div>
      </section>
    </div>
  );
};

const Gold = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="gold-page">
      <div className="gold-hero">
        <span className="gold-kicker">KIBELE • CAPPADOCIA</span>
        <h1>{t.gold}</h1>
        <div className="gold-line"></div>
        <p className="gold-subtitle">
          {t.gold === "Altın"
            ? "Zarif tasarımlar ve zamansız detaylarla seçkin altın koleksiyonu."
            : t.gold === "黄金"
            ? "精选黄金系列，以优雅设计与永恒细节呈现。"
            : "A refined gold collection defined by elegant design and timeless detail."}
        </p>
      </div>

      <div className="gold-coming-soon">
        <span>
          {t.gold === "Altın"
            ? "ALTIN KOLEKSİYONU YAKINDA"
            : t.gold === "黄金"
            ? "黄金系列即将推出"
            : "GOLD COLLECTION COMING SOON"}
        </span>
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
  const [jewelleryMenuOpen, setJewelleryMenuOpen] = useState(false);
  const [naturalStonesMenuOpen, setNaturalStonesMenuOpen] = useState(false);
  const [cappadociaMenuOpen, setCappadociaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileJewelleryCategory, setMobileJewelleryCategory] = useState("");
  const menuText = jewellerySubmenuCopy[lang] || jewellerySubmenuCopy.EN;
  const naturalStoneItems =
    naturalStoneMenuCopy[lang] || naturalStoneMenuCopy.TR;
  const extraMenuText = {
    TR: {
      naturalStones: "Doğal Taşlar",
      allNaturalStones: "Tüm Doğal Taşları Gör",
      cappadociaSeries: "Kapadokya Serisi",
      balloon: "Balon",
      evilEye: "Nazar",
    },
    EN: {
      naturalStones: "Natural Stones",
      allNaturalStones: "View All Natural Stones",
      cappadociaSeries: "Cappadocia Series",
      balloon: "Balloon",
      evilEye: "Turkish Eye",
    },
    ZH: {
      naturalStones: "天然宝石",
      allNaturalStones: "查看全部天然宝石",
      cappadociaSeries: "卡帕多奇亚系列",
      balloon: "热气球",
      evilEye: "纳扎尔之眼",
    },
    ES: {
      naturalStones: "Piedras naturales",
      allNaturalStones: "Ver todas las piedras naturales",
      cappadociaSeries: "Serie Capadocia",
      balloon: "Globo",
      evilEye: "Ojo turco",
    },
  }[lang] || {
    naturalStones: "Doğal Taşlar",
    allNaturalStones: "Tüm Doğal Taşları Gör",
    cappadociaSeries: "Kapadokya Serisi",
    balloon: "Balon",
    evilEye: "Nazar",
  };
  const mobileJewelleryCategories = [
    { value: 'rings', label: value.t.ringsMenu },
    { value: 'necklaces', label: value.t.necklacesMenu },
    { value: 'earrings', label: value.t.earringsMenu },
    { value: 'bracelets', label: value.t.braceletsMenu },
    { value: 'charms', label: value.t.charmsMenu },
  ];
  const mobileStoneChoices = {
    TR: [
      ['zultanite', 'Zultanite'], ['paraiba', 'Turmalin Paraiba'],
      ['citrine', 'Sitrin'], ['moissanite', 'Mozanit'],
      ['aquamarine', 'Akuamarin'], ['pink-quartz', 'Pink Quartz'],
    ],
    EN: [
      ['zultanite', 'Zultanite'], ['paraiba', 'Paraiba Tourmaline'],
      ['citrine', 'Citrine'], ['moissanite', 'Moissanite'],
      ['aquamarine', 'Aquamarine'], ['pink-quartz', 'Pink Quartz'],
    ],
    ZH: [
      ['zultanite', '苏丹石'], ['paraiba', '帕拉伊巴碧玺'],
      ['citrine', '黄水晶'], ['moissanite', '莫桑石'],
      ['aquamarine', '海蓝宝石'], ['pink-quartz', '粉晶'],
    ],
    ES: [
      ['zultanite', 'Zultanita'], ['paraiba', 'Turmalina Paraíba'],
      ['citrine', 'Citrino'], ['moissanite', 'Moissanita'],
      ['aquamarine', 'Aguamarina'], ['pink-quartz', 'Cuarzo rosa'],
    ],
  }[lang] || [];
  const navigate = useNavigate();
  const location = useLocation();
  const menuCloseTimer = useRef(null);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setJewelleryMenuOpen(false);
    setNaturalStonesMenuOpen(false);
    setCappadociaMenuOpen(false);
    setMobileJewelleryCategory("");
  };

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
  };

  const handleMobileNavigate = (target) => {
    closeMobileMenu();
    closeMobileSearch();
    navigate(target);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
  };

  const handleNaturalStoneNavigate = (event, stoneSlug) => {
    event.preventDefault();
    event.stopPropagation();
    clearMenuCloseTimer();
    setNaturalStonesMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(`/jewellery?stone=${stoneSlug}`);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
  };

  useEffect(() => {
    closeMobileMenu();
    closeMobileSearch();
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!mobileMenuOpen && !mobileSearchOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeWithEscape = (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
        closeMobileSearch();
      }
    };

    document.addEventListener('keydown', closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, [mobileMenuOpen, mobileSearchOpen]);

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
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
      setQuery("");
    }
  };

  const handleMobileSearchSubmit = (event) => {
    event.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    closeMobileSearch();
  };

  const isMobileNavigation = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  const clearMenuCloseTimer = () => {
    if (menuCloseTimer.current) {
      window.clearTimeout(menuCloseTimer.current);
      menuCloseTimer.current = null;
    }
  };

  const closeMenusAfterDelay = () => {
    if (isMobileNavigation()) return;

    clearMenuCloseTimer();
    menuCloseTimer.current = window.setTimeout(() => {
      setJewelleryMenuOpen(false);
      setNaturalStonesMenuOpen(false);
      setCappadociaMenuOpen(false);
      menuCloseTimer.current = null;
    }, 220);
  };

  const handleJewelleryMouseEnter = () => {
    if (!isMobileNavigation()) {
      clearMenuCloseTimer();
      setNaturalStonesMenuOpen(false);
      setCappadociaMenuOpen(false);
      setJewelleryMenuOpen(true);
    }
  };

  const handleJewelleryTriggerClick = (e) => {
    if (isMobileNavigation()) {
      e.preventDefault();
      e.stopPropagation();
      setNaturalStonesMenuOpen(false);
      setCappadociaMenuOpen(false);
      setJewelleryMenuOpen((current) => !current);
    }
  };

  const handleNaturalStonesMouseEnter = () => {
    if (!isMobileNavigation()) {
      clearMenuCloseTimer();
      setJewelleryMenuOpen(false);
      setCappadociaMenuOpen(false);
      setNaturalStonesMenuOpen(true);
    }
  };

  const handleNaturalStonesTriggerClick = (e) => {
    if (isMobileNavigation()) {
      e.preventDefault();
      e.stopPropagation();
      setJewelleryMenuOpen(false);
      setCappadociaMenuOpen(false);
      setNaturalStonesMenuOpen((current) => !current);
    }
  };

  const handleCappadociaMouseEnter = () => {
    if (!isMobileNavigation()) {
      clearMenuCloseTimer();
      setJewelleryMenuOpen(false);
      setNaturalStonesMenuOpen(false);
      setCappadociaMenuOpen(true);
    }
  };

  const handleCappadociaTriggerClick = (e) => {
    if (isMobileNavigation()) {
      e.preventDefault();
      e.stopPropagation();
      setJewelleryMenuOpen(false);
      setNaturalStonesMenuOpen(false);
      setCappadociaMenuOpen((current) => !current);
    }
  };

  useEffect(() => {
    clearMenuCloseTimer();
    setJewelleryMenuOpen(false);
    setNaturalStonesMenuOpen(false);
    setCappadociaMenuOpen(false);
    setShowHeader(true);
    setLastScrollY(0);
  }, [location.pathname, location.search]);

  useEffect(() => () => {
    if (menuCloseTimer.current) {
      window.clearTimeout(menuCloseTimer.current);
    }
  }, []);

  useEffect(() => {
    if (
      (!jewelleryMenuOpen &&
        !naturalStonesMenuOpen &&
        !cappadociaMenuOpen) ||
      !isMobileNavigation()
    ) return undefined;

    const closeFromOutside = (event) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest('.mega-nav-item')
      ) {
        return;
      }

      setJewelleryMenuOpen(false);
      setNaturalStonesMenuOpen(false);
      setCappadociaMenuOpen(false);
    };

    const closeWithEscape = (event) => {
      if (event.key === 'Escape') {
        setJewelleryMenuOpen(false);
        setNaturalStonesMenuOpen(false);
        setCappadociaMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeFromOutside);
    document.addEventListener('keydown', closeWithEscape);

    return () => {
      document.removeEventListener('pointerdown', closeFromOutside);
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, [jewelleryMenuOpen, naturalStonesMenuOpen, cappadociaMenuOpen]);

  const SearchIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 8px' }}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const MobileSubmenuChevron = () => (
    <span className="mobile-submenu-arrow" aria-hidden="true">
      <svg viewBox="0 0 14 8" focusable="false">
        <path d="M1.5 1.25 7 6.5l5.5-5.25" />
      </svg>
    </span>
  );

  const MobileSubmenuHeader = ({ title, onBack }) => (
    <div className="mobile-submenu-page-header">
      <button type="button" className="mobile-submenu-back" onClick={onBack}>
        <svg viewBox="0 0 12 20" aria-hidden="true"><path d="m9.5 2-7 8 7 8" /></svg>
        <span>Geri</span>
      </button>
      <strong>{title}</strong>
      <button type="button" className="mobile-submenu-close" onClick={closeMobileMenu} aria-label="Menüyü kapat">
        <span></span><span></span>
      </button>
    </div>
  );

  return (
    <header className={showHeader ? 'header-visible' : 'header-hidden'}>
      <div className="top-bar">
        <div className="top-left">
          <button
            className={`mobile-menu-icon ${mobileMenuOpen ? 'open' : ''}`}
            type="button"
            aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Link to="/store" className="top-link">{value.t.findStore}</Link>
          <div className="lang-switcher">
            {['EN', 'TR', 'ZH', 'ES'].map((l) => (
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
          <button
            type="button"
            className="mobile-search-button"
            aria-label={value.t.search}
            onClick={() => {
              closeMobileMenu();
              setMobileSearchOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8"></circle>
              <path d="m16 16 4.2 4.2"></path>
            </svg>
          </button>
          <Link to="/cart" className="cart-container-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span>{value.t.cart} ({value.cart.length})</span>
          </Link>
          <Link to="/account" className="account-link">
            {value.t.account}
          </Link>
        </div>
      </div>

      <div className="logo-container">
        <Link to="/"><h1>KIBELE</h1></Link>
      </div>

      <nav className="main-nav">
        <div
          className={`mega-nav-item ${jewelleryMenuOpen ? "open" : ""}`}
          onMouseEnter={handleJewelleryMouseEnter}
          onMouseLeave={closeMenusAfterDelay}
        >
          <Link
            className="nav-item mega-nav-trigger"
            to="/jewellery"
            onFocus={handleJewelleryMouseEnter}
            onClick={handleJewelleryTriggerClick}
            aria-expanded={jewelleryMenuOpen}
            aria-haspopup="true"
          >
            <span>{value.t.jewelleryMenu}</span>
            <MobileSubmenuChevron />
          </Link>

          <div
            className="jewellery-mega-menu"
            onMouseEnter={handleJewelleryMouseEnter}
            onMouseLeave={closeMenusAfterDelay}
            onClick={() => setJewelleryMenuOpen(false)}
          >
            <div className="mega-menu-inner">
              <div className="mega-menu-column">
                <h4>{value.t.necklacesMenu}</h4>
                <Link to="/jewellery?category=necklaces&stone=zultanite">{menuText.zultaniteNecklaces}</Link>
                <Link to="/jewellery?category=necklaces&stone=paraiba">{menuText.paraibaNecklaces}</Link>
                <Link to="/jewellery?category=necklaces&stone=citrine">{menuText.citrineNecklaces}</Link>
                <Link to="/jewellery?category=necklaces&stone=moissanite">{menuText.moissaniteNecklaces}</Link>
                <Link to="/jewellery?category=necklaces">{menuText.minimalNecklaces}</Link>
                <Link to="/jewellery?category=necklaces">{menuText.statementNecklaces}</Link>
              </div>

              <div className="mega-menu-column">
                <h4>{value.t.earringsMenu}</h4>
                <Link to="/jewellery?category=earrings&stone=zultanite">{menuText.zultaniteEarrings}</Link>
                <Link to="/jewellery?category=earrings&stone=paraiba">{menuText.paraibaEarrings}</Link>
                <Link to="/jewellery?category=earrings&stone=citrine">{menuText.citrineEarrings}</Link>
                <Link to="/jewellery?category=earrings&stone=moissanite">{menuText.moissaniteEarrings}</Link>
                <Link to="/jewellery?category=earrings">{menuText.dropEarrings}</Link>
                <Link to="/jewellery?category=earrings">{menuText.hoopEarrings}</Link>
              </div>

              <div className="mega-menu-column">
                <h4>{value.t.ringsMenu}</h4>
                <Link to="/jewellery?category=rings&stone=zultanite">{menuText.zultaniteRings}</Link>
                <Link to="/jewellery?category=rings&stone=paraiba">{menuText.paraibaRings}</Link>
                <Link to="/jewellery?category=rings&stone=citrine">{menuText.citrineRings}</Link>
                <Link to="/jewellery?category=rings&stone=moissanite">{menuText.moissaniteRings}</Link>
                <Link to="/jewellery?category=rings">{menuText.solitaireRings}</Link>
                <Link to="/jewellery?category=rings">{menuText.cocktailRings}</Link>
              </div>

              <div className="mega-menu-column">
                <h4>{value.t.braceletsMenu}</h4>
                <Link to="/jewellery?category=bracelets">{menuText.zultaniteBracelets}</Link>
                <Link to="/jewellery?category=bracelets">{menuText.chainBracelets}</Link>
                <Link to="/jewellery?category=bracelets">{menuText.gemstoneBracelets}</Link>
              </div>

              <div className="mega-menu-column">
                <h4>{value.t.charmsMenu}</h4>
                <Link to="/jewellery?category=charms">{menuText.necklaceCharms}</Link>
                <Link to="/jewellery?category=charms">{menuText.braceletCharms}</Link>
                <Link to="/jewellery?category=charms">{menuText.charms}</Link>
              </div>

              <div className="mega-menu-feature">
                <span>KIBELE • CAPPADOCIA</span>
                <h3>{menuText.collectionTitle}</h3>
                <Link to="/jewellery">{value.t.allJewelleryMenu} →</Link>
              </div>
            </div>
          </div>
        </div>

        <Link className="nav-item" to="/jewellery?stone=zultanite">{value.t.jewellery}</Link>

        <div
          className={`mega-nav-item natural-stones-nav-item ${naturalStonesMenuOpen ? "open" : ""}`}
          onMouseEnter={handleNaturalStonesMouseEnter}
          onMouseLeave={closeMenusAfterDelay}
        >
          <Link
            className="nav-item mega-nav-trigger"
            to="/jewellery?collection=natural-stones"
            onFocus={handleNaturalStonesMouseEnter}
            onClick={handleNaturalStonesTriggerClick}
            aria-expanded={naturalStonesMenuOpen}
            aria-haspopup="true"
          >
            <span>{value.t.naturalStones || extraMenuText.naturalStones}</span>
            <MobileSubmenuChevron />
          </Link>

          <div
            className="jewellery-mega-menu natural-stones-mega-menu"
            onMouseEnter={handleNaturalStonesMouseEnter}
            onMouseLeave={closeMenusAfterDelay}
          >
            <div className="mega-menu-inner natural-stones-menu-inner">
              <div className="natural-stones-link-grid">
                {naturalStoneItems.map((stone) => (
                  <Link
                    className="natural-stone-menu-link"
                    key={stone.slug}
                    to={`/jewellery?stone=${stone.slug}`}
                    onClick={(event) => handleNaturalStoneNavigate(event, stone.slug)}
                  >
                    <span>{stone.label}</span>
                  </Link>
                ))}
              </div>

              <div className="mega-menu-feature natural-stones-menu-feature">
                <span>KIBELE • NATURAL STONES</span>
                <h3>{value.t.naturalStones || extraMenuText.naturalStones}</h3>
                <Link
                  to="/jewellery?collection=natural-stones"
                  onClick={() => setNaturalStonesMenuOpen(false)}
                >
                  {extraMenuText.allNaturalStones} →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mega-nav-item cappadocia-nav-item ${cappadociaMenuOpen ? "open" : ""}`}
          onMouseEnter={handleCappadociaMouseEnter}
          onMouseLeave={closeMenusAfterDelay}
        >
          <Link
            className="nav-item mega-nav-trigger"
            to="/jewellery?series=cappadocia"
            onFocus={handleCappadociaMouseEnter}
            onClick={handleCappadociaTriggerClick}
            aria-expanded={cappadociaMenuOpen}
            aria-haspopup="true"
          >
            <span>{value.t.cappadociaSeries || extraMenuText.cappadociaSeries}</span>
            <MobileSubmenuChevron />
          </Link>

          <div
            className="jewellery-mega-menu cappadocia-mega-menu"
            onMouseEnter={handleCappadociaMouseEnter}
            onMouseLeave={closeMenusAfterDelay}
          >
            <div className="mega-menu-inner cappadocia-menu-inner">
              <Link
                className="mega-menu-column cappadocia-menu-column"
                to="/jewellery?series=balloon"
                onClick={() => setCappadociaMenuOpen(false)}
              >
                <h4>{value.t.balloon || extraMenuText.balloon}</h4>
                <span className="cappadocia-menu-option">
                  {value.t.allJewelleryMenu} →
                </span>
              </Link>

              <Link
                className="mega-menu-column cappadocia-menu-column"
                to="/jewellery?series=nazar"
                onClick={() => setCappadociaMenuOpen(false)}
              >
                <h4>{value.t.evilEye || extraMenuText.evilEye}</h4>
                <span className="cappadocia-menu-option">
                  {value.t.allJewelleryMenu} →
                </span>
              </Link>

              <div className="mega-menu-feature cappadocia-menu-feature">
                <span>KIBELE • CAPPADOCIA</span>
                <h3>{value.t.cappadociaSeries || extraMenuText.cappadociaSeries}</h3>
                <Link
                  to="/jewellery?series=cappadocia"
                  onClick={() => setCappadociaMenuOpen(false)}
                >
                  {value.t.discoverCappadocia || extraMenuText.cappadociaSeries} →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Link className="nav-item" to="/gold">{value.t.gold}</Link>
        <Link className="nav-item" to="/watches">{value.t.watches}</Link>
        <Link className="nav-item" to="/bags">{value.t.bagsAccessories}</Link>
        <Link className="nav-item" to="/">{value.t.home}</Link>
      </nav>

      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <aside
        className={`mobile-navigation-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-brand">KIBELE</span>
          <button type="button" onClick={closeMobileMenu} aria-label="Menüyü kapat">
            <span></span><span></span>
          </button>
        </div>

        <nav className="mobile-drawer-nav" aria-label="Mobil menü">
          <div className={`mobile-drawer-group ${jewelleryMenuOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="mobile-drawer-trigger"
              onClick={() => {
                setJewelleryMenuOpen((current) => !current);
                setNaturalStonesMenuOpen(false);
                setCappadociaMenuOpen(false);
              }}
              aria-expanded={jewelleryMenuOpen}
            >
              <span>{value.t.jewelleryMenu}</span><MobileSubmenuChevron />
            </button>
            <div className="mobile-drawer-submenu">
              <MobileSubmenuHeader title={value.t.jewelleryMenu} onBack={() => setJewelleryMenuOpen(false)} />
              <button type="button" className="mobile-submenu-link" onClick={() => handleMobileNavigate('/jewellery')}>
                {value.t.allJewelleryMenu}
              </button>
              {mobileJewelleryCategories.map((categoryItem) => (
                <button
                  key={categoryItem.value}
                  type="button"
                  className="mobile-category-next"
                  onClick={() => setMobileJewelleryCategory(categoryItem.value)}
                >
                  <span>{categoryItem.label}</span><span className="mobile-link-arrow">→</span>
                </button>
              ))}

              <div className={`mobile-category-page ${mobileJewelleryCategory ? 'open' : ''}`}>
                <MobileSubmenuHeader
                  title={mobileJewelleryCategories.find((item) => item.value === mobileJewelleryCategory)?.label || value.t.jewelleryMenu}
                  onBack={() => setMobileJewelleryCategory("")}
                />
                {mobileJewelleryCategory && (
                  <>
                    <button type="button" className="mobile-submenu-link" onClick={() => handleMobileNavigate(`/jewellery?category=${mobileJewelleryCategory}`)}>
                      {value.t.allJewelleryMenu}
                    </button>
                    {mobileStoneChoices.map(([stoneValue, stoneLabel]) => (
                      <button
                        key={stoneValue}
                        type="button"
                        className="mobile-submenu-link"
                        onClick={() => handleMobileNavigate(`/jewellery?category=${mobileJewelleryCategory}&stone=${stoneValue}`)}
                      >
                        {stoneLabel}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <button type="button" className="mobile-drawer-link" onClick={() => handleMobileNavigate('/jewellery?stone=zultanite')}>
            <span>{value.t.jewellery}</span><span className="mobile-link-arrow">→</span>
          </button>

          <div className={`mobile-drawer-group ${naturalStonesMenuOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="mobile-drawer-trigger"
              onClick={() => {
                setNaturalStonesMenuOpen((current) => !current);
                setJewelleryMenuOpen(false);
                setCappadociaMenuOpen(false);
              }}
              aria-expanded={naturalStonesMenuOpen}
            >
              <span>{value.t.naturalStones || extraMenuText.naturalStones}</span><MobileSubmenuChevron />
            </button>
            <div className="mobile-drawer-submenu mobile-stones-submenu">
              <MobileSubmenuHeader
                title={value.t.naturalStones || extraMenuText.naturalStones}
                onBack={() => setNaturalStonesMenuOpen(false)}
              />
              {naturalStoneItems.map((stone) => (
                <button
                  key={stone.slug}
                  type="button"
                  className="mobile-submenu-link"
                  onClick={(event) => handleNaturalStoneNavigate(event, stone.slug)}
                >
                  {stone.label}
                </button>
              ))}
              <button type="button" className="mobile-submenu-link mobile-view-all" onClick={() => handleMobileNavigate('/jewellery?collection=natural-stones')}>
                {extraMenuText.allNaturalStones}
              </button>
            </div>
          </div>

          <div className={`mobile-drawer-group ${cappadociaMenuOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="mobile-drawer-trigger"
              onClick={() => {
                setCappadociaMenuOpen((current) => !current);
                setJewelleryMenuOpen(false);
                setNaturalStonesMenuOpen(false);
              }}
              aria-expanded={cappadociaMenuOpen}
            >
              <span>{value.t.cappadociaSeries || extraMenuText.cappadociaSeries}</span><MobileSubmenuChevron />
            </button>
            <div className="mobile-drawer-submenu">
              <MobileSubmenuHeader
                title={value.t.cappadociaSeries || extraMenuText.cappadociaSeries}
                onBack={() => setCappadociaMenuOpen(false)}
              />
              <button type="button" className="mobile-submenu-link" onClick={() => handleMobileNavigate('/jewellery?series=balloon')}>{value.t.balloon || extraMenuText.balloon}</button>
              <button type="button" className="mobile-submenu-link" onClick={() => handleMobileNavigate('/jewellery?series=nazar')}>{value.t.evilEye || extraMenuText.evilEye}</button>
              <button type="button" className="mobile-submenu-link mobile-view-all" onClick={() => handleMobileNavigate('/jewellery?series=cappadocia')}>
                {value.t.discoverCappadocia || extraMenuText.cappadociaSeries}
              </button>
            </div>
          </div>

          <button type="button" className="mobile-drawer-link" onClick={() => handleMobileNavigate('/gold')}><span>{value.t.gold}</span><span className="mobile-link-arrow">→</span></button>
          <button type="button" className="mobile-drawer-link" onClick={() => handleMobileNavigate('/watches')}><span>{value.t.watches}</span><span className="mobile-link-arrow">→</span></button>
          <button type="button" className="mobile-drawer-link" onClick={() => handleMobileNavigate('/bags')}><span>{value.t.bagsAccessories}</span><span className="mobile-link-arrow">→</span></button>
          <button type="button" className="mobile-drawer-link" onClick={() => handleMobileNavigate('/')}><span>{value.t.home}</span><span className="mobile-link-arrow">→</span></button>
        </nav>

        <div className="mobile-drawer-footer">
          <button type="button" className="mobile-footer-link" onClick={() => handleMobileNavigate('/account')}>{value.t.account}</button>
          <button type="button" className="mobile-footer-link" onClick={() => handleMobileNavigate('/store')}>{value.t.findStore}</button>
          <div className="mobile-drawer-languages">
            {['EN', 'TR', 'ZH', 'ES'].map((language) => (
              <button
                key={language}
                type="button"
                className={lang === language ? 'active' : ''}
                onClick={() => setLang(language)}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className={`mobile-search-panel ${mobileSearchOpen ? 'open' : ''}`} aria-hidden={!mobileSearchOpen}>
        <div className="mobile-search-header">
          <span>{value.t.search}</span>
          <button type="button" onClick={closeMobileSearch} aria-label="Aramayı kapat">
            <span></span><span></span>
          </button>
        </div>
        <form className="mobile-search-form" onSubmit={handleMobileSearchSubmit}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8"></circle>
            <path d="m16 16 4.2 4.2"></path>
          </svg>
          <input
            key={mobileSearchOpen ? 'mobile-search-open' : 'mobile-search-closed'}
            type="search"
            placeholder={value.t.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus={mobileSearchOpen}
          />
          <button type="submit" disabled={!query.trim()}>{value.t.search}</button>
        </form>
        <p className="mobile-search-hint">{value.t.jewelleryMenu} · {value.t.naturalStones} · {value.t.cappadociaSeries}</p>
      </section>
    </header>
  );
};

function App() {
  const [lang, setLang] = useState(getInitialLanguage);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(() => {
    try {
      const savedRates = JSON.parse(
        localStorage.getItem('kibele-exchange-rates') || 'null'
      );

      const cacheIsFresh =
        savedRates?.updatedAt &&
        Date.now() - savedRates.updatedAt < 24 * 60 * 60 * 1000;

      const cachedRates = cacheIsFresh && savedRates?.rates
        ? savedRates.rates
        : {};

      return {
        USD: Number(cachedRates.USD) || null,
        CNY: Number(cachedRates.CNY) || null,
        EUR: Number(cachedRates.EUR) || null,
      };
    } catch {
      return { USD: null, CNY: null, EUR: null };
    }
  });
  
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

  useEffect(() => {
    try {
      window.localStorage.setItem('language', lang);
    } catch {
      // Tarayıcı depolaması kapalı olsa da site çalışmaya devam eder.
    }
  }, [lang]);

  useEffect(() => {
    const controller = new AbortController();

    const loadExchangeRates = async () => {
      try {
        const response = await fetch(
          'https://api.frankfurter.dev/v2/rates?base=TRY&quotes=USD,CNY,EUR',
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Döviz kurları alınamadı.');
        }

        const data = await response.json();
        const nextRates = { USD: null, CNY: null, EUR: null };

        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (
              (item.quote === 'USD' || item.quote === 'CNY' || item.quote === 'EUR') &&
              Number(item.rate) > 0
            ) {
              nextRates[item.quote] = Number(item.rate);
            }
          });
        } else if (data?.rates) {
          nextRates.USD = Number(data.rates.USD) || null;
          nextRates.CNY = Number(data.rates.CNY) || null;
          nextRates.EUR = Number(data.rates.EUR) || null;
        }

        if (nextRates.USD && nextRates.CNY && nextRates.EUR) {
          setExchangeRates(nextRates);
          localStorage.setItem(
            'kibele-exchange-rates',
            JSON.stringify({
              rates: nextRates,
              updatedAt: Date.now(),
            })
          );
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Döviz kuru hatası:', error);
        }
      }
    };

    loadExchangeRates();

    return () => controller.abort();
  }, []);

  const formatPrice = (price) => {
    const tryAmount = Number(price || 0);

    if (lang === 'EN' && exchangeRates?.USD) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(tryAmount * exchangeRates.USD);
    }

    if (lang === 'ZH' && exchangeRates?.CNY) {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(tryAmount * exchangeRates.CNY);
    }

    if (lang === 'ES' && exchangeRates?.EUR) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(tryAmount * exchangeRates.EUR);
    }

    return `${tryAmount.toLocaleString('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} TL`;
  };
  
  // setCart value içerisine eklendi ki Cart bileşeni sepeti boşaltabilsin
  const value = {
    lang,
    setLang,
    t: translations[lang] || translations.TR,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    formatPrice,
  };

  return (
    <LanguageContext.Provider value={value}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
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
              <Route path="/account" element={<Account />} />
              <Route path="/store" element={<Store />} />
              <Route path="/telkari" element={<CreateYourOwn />} />
              <Route path="/jewellery" element={<div className="zultanite-page"><Jewellery /></div>} />
              <Route path="/gold" element={<Gold />} />
              <Route path="/watches" element={<Watches />} />
              <Route path="/bags" element={<Bags />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/reset-password" element={<ResetPassword />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
          .search-input-wrapper input { border: none; font-size: 11px; padding: 0 5px; width: 120px; letter-spacing: 1px; background: transparent; text-transform: none; }
          
          .cart-container-link { display: flex; align-items: center; gap: 8px; text-decoration: none; cursor: pointer; }
          .cart-container-link span { font-size: 11px; letter-spacing: 1px; }
          .account-link { font-size: 11px; letter-spacing: 1px; text-decoration: none; white-space: nowrap; }

          .logo-container { text-align: center; padding: 30px 0 10px; }
          .logo-container h1 { font-family: 'serif'; font-size: 52px; font-weight: 200; letter-spacing: 18px; margin: 0; }
          
          .main-nav {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: stretch;
            column-gap: 30px;
            row-gap: 14px;
            padding: 10px 24px 30px;
          }
          .nav-item { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; text-decoration: none; font-weight: 300; transition: opacity 0.3s; }
          .nav-item:hover { opacity: 0.6; }

          /* Üst menü ve Takılar mega menüsünde hiçbir bağlantının altını çizme */
          .main-nav a,
          .main-nav a:hover,
          .main-nav a:focus,
          .main-nav a:active {
            text-decoration: none !important;
            border-bottom: 0 !important;
          }

          /* SWAROVSKI TARZI TAM GENİŞLİK TAKILAR MEGA MENÜSÜ */
          .mega-nav-item {
            position: static;
            display: flex;
            align-items: center;
            align-self: stretch;
          }

          .mega-nav-trigger {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 0 10px;
            margin-bottom: -10px;
          }

          .mobile-submenu-arrow {
            display: none;
          }

          /* Başlık ile açılan panel arasındaki alanı tıklanabilir tutar */
          .mega-nav-trigger::before {
            content: "";
            position: absolute;
            left: -10px;
            right: -10px;
            top: 100%;
            height: 36px;
            background: transparent;
            pointer-events: auto;
          }
          .mega-nav-item.open .mega-nav-trigger::after,
          .mega-nav-item:hover .mega-nav-trigger::after {
            content: none;
          }
          .jewellery-mega-menu {
            position: absolute;
            top: calc(100% - 1px);
            left: 0;
            width: 100vw;
            background: #fff;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #e8e8e8;
            box-shadow: 0 18px 34px rgba(0,0,0,.07);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: translateY(-8px);
            transition: opacity .22s ease, transform .22s ease, visibility .22s ease;
            z-index: 1300;
          }
          .mega-nav-item:hover .jewellery-mega-menu,
          .mega-nav-item.open .jewellery-mega-menu {
            opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0);
          }
          .mega-menu-inner {
            width: min(1420px, calc(100% - 100px));
            margin: 0 auto;
            padding: 38px 0 44px;
            display: grid;
            grid-template-columns: repeat(5, minmax(125px,1fr)) minmax(230px,1.35fr);
            gap: 34px;
            align-items: start;
          }
          .mega-menu-column h4 {
            margin: 0 0 19px;
            font-size: 11px; letter-spacing: .5px; font-weight: 700;
          }
          .mega-menu-column a {
            display: block; margin: 0 0 14px; text-decoration: none;
            font-size: 11px; line-height: 1.35; letter-spacing: .25px; opacity: .58;
            transition: opacity .2s ease;
          }
          .mega-menu-column a:hover { opacity: 1; text-decoration: none; }
          .mega-menu-feature {
            min-height: 205px; padding: 27px;
            background: linear-gradient(135deg,#f7f4ec,#efebe0);
            display: flex; flex-direction: column; justify-content: flex-end;
          }
          .mega-menu-feature > span { font-size: 7px; letter-spacing: 2.3px; opacity: .48; margin-bottom: 10px; }
          .mega-menu-feature h3 { font-family: serif; font-size: 20px; font-weight: 300; letter-spacing: 2px; margin: 0 0 20px; }
          .mega-menu-feature a { font-size: 9px; letter-spacing: 1.5px; text-decoration: none; font-weight: 600; }

          .cappadocia-menu-inner {
            width: min(1420px, calc(100% - 100px));
            margin: 0 auto;
            padding: 38px 0 44px;
            display: grid;
            grid-template-columns: repeat(5, minmax(125px, 1fr)) minmax(230px, 1.35fr);
            gap: 34px;
            align-items: start;
          }

          .cappadocia-menu-feature {
            grid-column: 6;
            min-height: 205px;
          }

          .cappadocia-menu-column {
            display: block;
            text-decoration: none !important;
            cursor: pointer;
          }

          .cappadocia-menu-option {
            display: block;
            margin-top: 19px;
            font-size: 11px;
            line-height: 1.35;
            letter-spacing: .25px;
            opacity: .58;
            transition: opacity .2s ease;
          }

          .cappadocia-menu-column:hover .cappadocia-menu-option {
            opacity: 1;
          }

          .natural-stones-menu-inner {
            width: min(1420px, calc(100% - 100px));
            margin: 0 auto;
            padding: 38px 0 44px;
            display: grid;
            grid-template-columns: minmax(0, 4fr) minmax(230px, 1.25fr);
            gap: 44px;
            align-items: stretch;
          }

          .natural-stones-link-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(130px, 1fr));
            gap: 0 28px;
            align-content: start;
          }

          .natural-stone-menu-link {
            position: relative;
            z-index: 2;
            pointer-events: auto;
            cursor: pointer;
            min-height: 54px;
            padding: 15px 2px;
            border-bottom: 1px solid #ece9e2 !important;
            display: flex;
            align-items: center;
            color: #151513;
            font-size: 11px;
            line-height: 1.35;
            letter-spacing: .45px;
            text-decoration: none !important;
            opacity: .72;
            transition: opacity .2s ease, padding-left .2s ease;
          }

          .natural-stone-menu-link:hover,
          .natural-stone-menu-link:focus {
            padding-left: 6px;
            opacity: 1;
          }

          .natural-stones-menu-feature {
            min-height: 205px;
          }

          .mobile-menu-icon {
            display: none;
            width: 24px;
            height: 24px;
            padding: 4px;
            border: 0;
            background: transparent;
            flex: 0 0 auto;
            cursor: pointer;
          }

          .mobile-menu-icon span {
            display: block;
            width: 14px;
            height: 1px;
            background: #000;
            margin: 3px auto;
          }

          .mobile-drawer-overlay,
          .mobile-navigation-drawer,
          .mobile-search-button,
          .mobile-search-panel {
            display: none;
          }

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
          .banner-container {
            width: 100%;
            height: 68vh;
            min-height: 520px;
            position: relative;
            overflow: hidden;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .banner-video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
            display: block;
            background: #fff;
            transform: none;
          }

.section-title {
            text-align: center;
            padding: 70px 20px 45px;
            width: 100%;
          }

          .section-title h2 {
            font-size: 18px;
            font-weight: 300;
            letter-spacing: 6px;
            text-transform: uppercase;
            line-height: 1.45;
            margin: 0;
          }

          .title-line {
            width: 50px;
            height: 1px;
            background: #000;
            margin: 20px auto;
          }

          .product-grid {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 15px;
            padding: 0 40px 100px;
            width: 100%;
          }

          .img-wrapper {
            aspect-ratio: 3/4;
            overflow: hidden;
            background: #f9f9f9;
          }

          .img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 1s ease;
          }

          .img-wrapper:hover img {
            transform: scale(1.05);
          }

          /* ZULTANITE SAYFASI - ÜRÜNE YAKLAŞMA EFEKTİ */
          .zultanite-page {
            width: 100%;
            overflow-x: hidden;
          }

          .zultanite-page img {
            transition:
              transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.45s ease !important;
            transform-origin: center center;
          }

          .zultanite-page img:hover {
            transform: scale(1.18);
            filter: brightness(1.02) contrast(1.02);
          }

          .zultanite-page .img-wrapper,
          .zultanite-page .image-wrapper,
          .zultanite-page .product-image,
          .zultanite-page .product-img,
          .zultanite-page .product-image-wrapper,
          .zultanite-page .product-card {
            overflow: hidden;
          }

          @media (hover: none), (max-width: 768px) {
            .zultanite-page img:hover {
              transform: none;
              filter: none;
            }
          }

          .product-info {
            padding: 15px 0;
            font-size: 10px;
            text-align: center;
            letter-spacing: 1px;
            text-transform: uppercase;
          }


          /* HOME COLLECTIONS - COMPACT PREMIUM EDITORIAL */
          .home-collections {
            width: 100%;
            padding: 34px 4vw 92px;
            background: #fff;
          }

          .home-collections-heading {
            text-align: center;
            max-width: 760px;
            margin: 0 auto 40px;
          }

          .home-collections-kicker {
            display: block;
            margin-bottom: 12px;
            font-size: 8px;
            letter-spacing: 3.5px;
            font-weight: 600;
            opacity: 0.45;
          }

          .home-collections-heading h2 {
            margin: 0;
            font-family: serif;
            font-size: 30px;
            font-weight: 300;
            letter-spacing: 4px;
            line-height: 1.2;
            text-transform: uppercase;
          }

          .home-collections-line {
            width: 42px;
            height: 1px;
            background: #000;
            margin: 18px auto 0;
            opacity: 0.7;
          }

          .home-collections-grid {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .home-collection-card {
            min-width: 0;
          }

          .home-collection-image-wrap {
            position: relative;
            aspect-ratio: 5 / 4;
            overflow: hidden;
            background: #f6f6f4;
          }

          .home-collection-image-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .home-collection-card:hover img {
            transform: scale(1.035);
          }

          .home-collection-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              180deg,
              rgba(0,0,0,0.02) 10%,
              rgba(0,0,0,0.05) 55%,
              rgba(0,0,0,0.42) 100%
            );
            pointer-events: none;
          }

          .home-collection-number {
            position: absolute;
            top: 14px;
            left: 16px;
            color: #fff !important;
            font-size: 8px;
            letter-spacing: 2px;
            font-weight: 600;
            opacity: 0.9;
          }

          .home-collection-content {
            position: absolute;
            left: 18px;
            right: 18px;
            bottom: 16px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 12px;
            text-align: left;
          }

          .home-collection-content h3 {
            margin: 0;
            color: #fff !important;
            font-family: serif;
            font-size: 21px;
            font-weight: 300;
            letter-spacing: 1.4px;
            line-height: 1.1;
            text-transform: uppercase;
          }

          .home-collection-link {
            color: #fff !important;
            font-size: 7px;
            letter-spacing: 1.8px;
            font-weight: 600;
            white-space: nowrap;
            opacity: 0.9;
          }



          /* CREATE YOUR OWN / KENDİN YAP */
          .custom-design-page {
            width: 100%;
            background: #fff;
          }

          .custom-design-intro {
            max-width: 820px;
            margin: 0 auto;
            padding: 90px 24px 55px;
            text-align: center;
          }

          .custom-design-intro > span {
            display: block;
            margin-bottom: 16px;
            font-size: 8px;
            letter-spacing: 4px;
            font-weight: 600;
            opacity: 0.45;
          }

          .custom-design-intro h1 {
            margin: 0;
            font-family: serif;
            font-size: 42px;
            font-weight: 300;
            letter-spacing: 9px;
          }

          .custom-design-line {
            width: 44px;
            height: 1px;
            margin: 22px auto;
            background: #000;
          }

          .custom-design-intro p {
            max-width: 650px;
            margin: 0 auto;
            font-size: 11px;
            line-height: 1.9;
            letter-spacing: 1px;
            opacity: 0.62;
          }

          .custom-design-studio {
            width: calc(100% - 80px);
            max-width: 1400px;
            margin: 0 auto 100px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(420px, 0.9fr);
            gap: 70px;
            padding: 55px;
            border: 1px solid #eee;
            background: #fcfcfb;
          }

          .custom-design-controls {
            display: flex;
            flex-direction: column;
            gap: 34px;
          }

          .custom-group-heading {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 13px;
          }

          .custom-option-group h3 {
            margin: 0;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 2.4px;
          }

          .custom-group-heading > span {
            font-family: serif;
            font-size: 12px;
            letter-spacing: 0.7px;
            opacity: 0.55;
          }

          .custom-option-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .custom-visual-option {
            position: relative;
            min-height: 108px;
            padding: 14px 12px 12px;
            border: 1px solid #e3e0dc;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition:
              border-color 0.25s ease,
              box-shadow 0.25s ease,
              transform 0.25s ease,
              background 0.25s ease;
          }

          .custom-visual-option:hover {
            border-color: #aaa39a;
            transform: translateY(-1px);
            box-shadow: 0 8px 22px rgba(0,0,0,0.04);
          }

          .custom-visual-option.selected {
            border-color: #111;
            background: #fbfaf8;
            box-shadow: inset 0 0 0 1px #111, 0 9px 24px rgba(0,0,0,0.06);
          }

          .custom-option-label {
            font-size: 9px;
            letter-spacing: 1.1px;
            font-weight: 600;
            line-height: 1.2;
          }

          .custom-selected-check {
            position: absolute;
            top: 8px;
            right: 9px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #111;
            color: #fff !important;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            opacity: 0;
            transform: scale(0.7);
            transition: 0.2s ease;
          }

          .custom-visual-option.selected .custom-selected-check {
            opacity: 1;
            transform: scale(1);
          }

          /* ÜRÜN SEÇİM İKONLARI */
          .product-choice-icon {
            position: relative;
            width: 52px;
            height: 45px;
            display: block;
          }

          .product-choice-ring::before {
            content: "";
            position: absolute;
            left: 12px;
            top: 13px;
            width: 27px;
            height: 27px;
            border: 2px solid #555;
            border-radius: 50%;
          }

          .product-choice-ring::after {
            content: "";
            position: absolute;
            left: 21px;
            top: 3px;
            width: 10px;
            height: 10px;
            background: linear-gradient(135deg,#d8c7a0,#7d815e,#e5b5ae);
            transform: rotate(45deg);
            box-shadow: 0 0 0 2px #777;
          }

          .product-choice-necklace::before {
            content: "";
            position: absolute;
            left: 6px;
            top: 2px;
            width: 38px;
            height: 30px;
            border: 1.8px solid #666;
            border-top-color: transparent;
            border-radius: 0 0 50% 50%;
          }

          .product-choice-necklace::after {
            content: "";
            position: absolute;
            left: 21px;
            top: 28px;
            width: 10px;
            height: 10px;
            background: linear-gradient(135deg,#d9c8a5,#7d8058,#d9aab1);
            transform: rotate(45deg);
          }

          .product-choice-bracelet::before {
            content: "";
            position: absolute;
            left: 4px;
            top: 10px;
            width: 44px;
            height: 23px;
            border: 3px solid #666;
            border-radius: 50%;
          }

          .product-choice-bracelet::after {
            content: "••••••";
            position: absolute;
            left: 7px;
            top: 13px;
            font-size: 12px;
            letter-spacing: 0px;
            color: #aaa !important;
          }

          .product-choice-earring::before,
          .product-choice-earring::after {
            content: "";
            position: absolute;
            top: 5px;
            width: 15px;
            height: 29px;
            border: 2px solid #666;
            border-radius: 50%;
          }

          .product-choice-earring::before { left: 7px; }
          .product-choice-earring::after { right: 7px; }

          /* METAL RENKLERİ */
          .metal-choice-swatch,
          .preview-metal-dot {
            display: block;
            border-radius: 50%;
            border: 1px solid rgba(0,0,0,0.13);
          }

          .metal-choice-swatch {
            width: 42px;
            height: 42px;
            box-shadow:
              inset -8px -8px 15px rgba(0,0,0,0.10),
              inset 8px 8px 15px rgba(255,255,255,0.7);
          }

          .metal-choice-silver {
            background: linear-gradient(135deg,#f8f8f8 5%,#b9bcc0 45%,#f2f2f2 68%,#8f9499 100%);
          }

          .metal-choice-gold {
            background: linear-gradient(135deg,#fff1a8 0%,#d2a83e 42%,#f6d66a 65%,#9e7721 100%);
          }

          .metal-choice-whiteGold {
            background: linear-gradient(135deg,#ffffff 0%,#d9d7d2 38%,#f7f5ef 62%,#aaa9a4 100%);
          }

          /* TAŞ RENKLERİ */
          .stone-choice-gem,
          .preview-stone-dot {
            display: block;
            border: 1px solid rgba(0,0,0,0.13);
            box-shadow:
              inset 7px 7px 12px rgba(255,255,255,0.35),
              inset -7px -7px 14px rgba(0,0,0,0.13),
              0 3px 8px rgba(0,0,0,0.08);
          }

          .stone-choice-gem {
            width: 42px;
            height: 42px;
            transform: rotate(45deg);
            border-radius: 11px;
          }

          .stone-choice-zultanite {
            background: linear-gradient(135deg,#8a915d 0%,#d5b36f 32%,#b87b78 67%,#6f7850 100%);
          }

          .stone-choice-aquamarine {
            background: linear-gradient(135deg,#daf8fb 0%,#81cbd8 50%,#bfeef3 100%);
          }

          .stone-choice-paraiba {
            background: linear-gradient(135deg,#a6fff1 0%,#24c8b5 47%,#61ddd0 100%);
          }

          .stone-choice-quartz {
            background: linear-gradient(135deg,#fff2f6 0%,#e3a9b9 45%,#f1cbd4 100%);
          }

          /* KESİM ŞEKİLLERİ */
          .shape-choice-icon {
            display: block;
            width: 42px;
            height: 42px;
            background: linear-gradient(145deg,#f8f8f8,#cfcfcf);
            border: 1px solid #999;
            box-shadow: inset 5px 5px 8px rgba(255,255,255,0.8), inset -5px -5px 8px rgba(0,0,0,0.10);
          }

          .shape-choice-round {
            border-radius: 50%;
          }

          .shape-choice-oval {
            width: 34px;
            border-radius: 50%;
          }

          .shape-choice-pear {
            width: 34px;
            border-radius: 50% 50% 50% 8%;
            transform: rotate(45deg);
          }

          .shape-choice-emerald {
            width: 35px;
            height: 42px;
            clip-path: polygon(20% 0,80% 0,100% 20%,100% 80%,80% 100%,20% 100%,0 80%,0 20%);
          }

          .custom-engraving-input {
            width: 100%;
            height: 50px;
            padding: 0 14px;
            border: 1px solid #ddd;
            background: #fff;
            font-size: 11px;
            letter-spacing: 0.8px;
          }

          .custom-design-preview-column {
            display: flex;
            flex-direction: column;
            gap: 22px;
          }

          .custom-design-preview {
            position: relative;
            min-height: 430px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #fff;
            border: 1px solid #eee;
          }

          .custom-preview-label {
            position: absolute;
            top: 18px;
            left: 20px;
            font-size: 8px;
            letter-spacing: 2.5px;
            opacity: 0.45;
          }

          .custom-preview-topbar {
            position: absolute;
            top: 16px;
            left: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            z-index: 4;
          }

          .custom-preview-topbar .custom-preview-label {
            position: static;
          }

          .custom-preview-chips {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 7px;
            letter-spacing: 0.7px;
            opacity: 0.7;
          }

          .preview-metal-dot,
          .preview-stone-dot {
            width: 13px;
            height: 13px;
            flex: 0 0 auto;
          }

          .preview-stone-dot {
            border-radius: 4px;
            transform: rotate(45deg);
            margin-left: 6px;
          }

          .custom-preview-cut {
            position: absolute;
            right: 20px;
            bottom: 20px;
            padding: 7px 10px;
            border: 1px solid #e5e2dd;
            background: rgba(255,255,255,0.9);
            font-size: 7px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }

          .custom-jewel {
            position: relative;
            width: 190px;
            height: 190px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .custom-ring::before {
            content: "";
            position: absolute;
            width: 130px;
            height: 130px;
            border: 10px solid #bfc0c2;
            border-radius: 50%;
          }

          .metal-gold .custom-ring::before { border-color: #c9a34b; }
          .metal-whiteGold .custom-ring::before { border-color: #d8d8d8; }

          .custom-necklace::before {
            content: "";
            position: absolute;
            width: 155px;
            height: 125px;
            border: 3px solid #bfc0c2;
            border-top-color: transparent;
            border-radius: 0 0 50% 50%;
            top: 10px;
          }

          .metal-gold .custom-necklace::before { border-color: #c9a34b; border-top-color: transparent; }
          .metal-whiteGold .custom-necklace::before { border-color: #d8d8d8; border-top-color: transparent; }

          .custom-bracelet::before {
            content: "";
            position: absolute;
            width: 155px;
            height: 105px;
            border: 8px solid #bfc0c2;
            border-radius: 50%;
          }

          .metal-gold .custom-bracelet::before { border-color: #c9a34b; }
          .metal-whiteGold .custom-bracelet::before { border-color: #d8d8d8; }

          .custom-earring::before,
          .custom-earring::after {
            content: "";
            position: absolute;
            width: 3px;
            height: 72px;
            background: #bfc0c2;
            top: 38px;
          }

          .custom-earring::before { left: 65px; }
          .custom-earring::after { right: 65px; }
          .metal-gold .custom-earring::before,
          .metal-gold .custom-earring::after { background: #c9a34b; }
          .metal-whiteGold .custom-earring::before,
          .metal-whiteGold .custom-earring::after { background: #d8d8d8; }

          .custom-stone {
            position: relative;
            z-index: 2;
            font-size: 56px;
            line-height: 1;
            text-shadow: 0 5px 18px rgba(0,0,0,0.13);
          }

          .stone-zultanite .custom-stone { color: #7e8052 !important; }
          .stone-aquamarine .custom-stone { color: #8cc9d5 !important; }
          .stone-paraiba .custom-stone { color: #48c7bd !important; }
          .stone-quartz .custom-stone { color: #e5b7c3 !important; }

          .custom-stone.shape-round {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            overflow: hidden;
          }

          .custom-stone.shape-oval {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 58px;
            height: 82px;
            border-radius: 50%;
            overflow: hidden;
          }

          .custom-stone.shape-pear {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 78px;
            border-radius: 52% 52% 52% 10%;
            transform: rotate(45deg);
            overflow: hidden;
          }

          .custom-stone.shape-emerald {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 58px;
            height: 78px;
            clip-path: polygon(18% 0,82% 0,100% 18%,100% 82%,82% 100%,18% 100%,0 82%,0 18%);
            overflow: hidden;
          }

          .stone-zultanite .custom-stone {
            background: linear-gradient(135deg,#8b925c 0%,#e2bc73 35%,#b66f76 66%,#66714c 100%);
          }
          .stone-aquamarine .custom-stone {
            background: linear-gradient(135deg,#e4fbfd,#79c9d7 52%,#b7edf2);
          }
          .stone-paraiba .custom-stone {
            background: linear-gradient(135deg,#a8fff1,#23c7b4 50%,#62dfd2);
          }
          .stone-quartz .custom-stone {
            background: linear-gradient(135deg,#fff3f7,#dfa8b8 52%,#efc9d3);
          }

          .custom-stone {
            color: rgba(255,255,255,0.38) !important;
            border: 1px solid rgba(255,255,255,0.72);
            box-shadow:
              inset 12px 12px 20px rgba(255,255,255,0.30),
              inset -12px -12px 24px rgba(0,0,0,0.12),
              0 8px 22px rgba(0,0,0,0.15);
            font-size: 22px;
          }

          .custom-earring .custom-stone {
            transform: translateY(42px);
          }

          .custom-engraving-preview {
            position: absolute;
            bottom: 24px;
            font-family: serif;
            font-size: 12px;
            letter-spacing: 2px;
            opacity: 0.55;
          }

          .custom-design-summary {
            padding: 26px 28px;
            background: #fff;
            border: 1px solid #eee;
          }

          .custom-summary-title {
            display: block;
            margin-bottom: 18px;
            font-size: 8px;
            letter-spacing: 2.5px;
            font-weight: 600;
            opacity: 0.5;
          }

          .custom-design-summary p {
            margin: 7px 0;
            font-family: serif;
            font-size: 15px;
            letter-spacing: 0.7px;
          }

          .custom-send-button {
            display: block;
            width: 100%;
            margin-top: 24px;
            padding: 17px 15px;
            background: #000;
            color: #fff !important;
            text-align: center;
            text-decoration: none;
            font-size: 9px;
            letter-spacing: 2px;
          }

          .custom-design-summary small {
            display: block;
            margin-top: 15px;
            font-size: 8px;
            line-height: 1.6;
            letter-spacing: 0.5px;
            opacity: 0.5;
          }

          /* GOLD PAGE */
          .gold-page {
            width: 100%;
            min-height: 65vh;
            background: #fff;
          }

          .gold-hero {
            max-width: 900px;
            margin: 0 auto;
            padding: 110px 24px 70px;
            text-align: center;
          }

          .gold-kicker {
            display: block;
            margin-bottom: 18px;
            font-size: 8px;
            letter-spacing: 4px;
            font-weight: 600;
            opacity: 0.45;
          }

          .gold-hero h1 {
            margin: 0;
            font-family: serif;
            font-size: 48px;
            font-weight: 300;
            letter-spacing: 10px;
            text-transform: uppercase;
          }

          .gold-line {
            width: 46px;
            height: 1px;
            background: #000;
            margin: 24px auto;
          }

          .gold-subtitle {
            max-width: 620px;
            margin: 0 auto;
            font-size: 11px;
            line-height: 1.9;
            letter-spacing: 1.2px;
            opacity: 0.6;
          }

          .gold-coming-soon {
            width: calc(100% - 80px);
            max-width: 1400px;
            min-height: 280px;
            margin: 0 auto 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f7f4ee;
            border: 1px solid #eee7dc;
          }

          .gold-coming-soon span {
            font-size: 10px;
            letter-spacing: 4px;
            font-weight: 500;
            opacity: 0.6;
          }

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
            .main-nav {
              gap: 24px;
            }

            .nav-item {
              font-size: 9.5px;
              letter-spacing: 2px;
            }

            .product-grid {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }

            .cart-layout {
              gap: 40px;
            }

            .banner-video {
              width: 68%;
              height: 68%;
            }
          }

          @media (max-width: 992px) {
            .main-nav {
              gap: 14px;
            }

            .nav-item {
              font-size: 8px;
              letter-spacing: 1.1px;
            }

            .footer-content {
              grid-template-columns: 1fr;
              gap: 60px;
            }

            .footer-left,
            .footer-right {
              align-items: center;
              text-align: center;
            }

            .footer-center {
              order: -1;
            }

            .cart-layout {
              grid-template-columns: 1fr;
            }
          }

@media (max-width: 768px) {
            main {
              padding-top: 62px !important;
            }

            header {
              background: rgba(255,255,255,0.98);
              min-height: 62px;
              border-bottom: 1px solid rgba(17,17,17,.1);
            }

            .top-bar {
              position: relative;
              min-height: 62px;
              padding: 0 16px;
              border-bottom: 0;
              overflow: visible;
            }

            .top-left,
            .top-right {
              gap: 10px;
              min-width: 0;
              flex: 0 1 auto;
            }

            .top-left {
              position: static;
            }

            .top-right {
              position: absolute;
              right: 15px;
              top: 50%;
              margin: 0;
              display: flex;
              align-items: center;
              gap: 13px;
              transform: translateY(-50%);
            }

            .mobile-menu-icon {
              position: absolute;
              top: 50%;
              left: 15px;
              z-index: 3100;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 30px;
              height: 30px;
              padding: 6px;
              transform: translateY(-50%);
            }

            .mobile-menu-icon span {
              width: 17px;
              margin: 2.5px auto;
              transition: transform .3s ease, opacity .2s ease;
            }

            .mobile-menu-icon.open {
              opacity: 0;
              pointer-events: none;
            }

            .top-left > :not(.mobile-menu-icon),
            .top-right .account-link,
            .top-right > span,
            .top-right .cart-container-link span {
              display: none !important;
            }

            .mobile-search-button {
              width: 28px;
              height: 28px;
              padding: 4px;
              border: 0;
              background: transparent;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: #111;
              cursor: pointer;
            }

            .mobile-search-button svg {
              width: 18px;
              height: 18px;
              fill: none;
              stroke: currentColor;
              stroke-width: 1.35;
              stroke-linecap: round;
            }

            .top-right .cart-container-link {
              min-width: 25px;
              min-height: 28px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }

            .top-right .cart-container-link svg {
              width: 17px;
              height: 17px;
            }

            .top-link,
            .cart-container-link span,
            .top-right > span,
            .account-link {
              font-size: 8.5px;
              letter-spacing: 0.2px;
              white-space: nowrap;
            }

            .lang-switcher {
              display: none;
            }

            .lang-switcher span {
              font-size: 8px;
              margin: 0 2px;
            }

            .search-box {
              display: none;
            }

            .logo-container {
              position: absolute;
              top: 0;
              left: 50%;
              z-index: 2;
              height: 62px;
              padding: 0;
              display: flex;
              align-items: center;
              transform: translateX(-50%);
            }

            .logo-container h1 {
              margin-left: 7px;
              font-size: 25px;
              letter-spacing: 7px;
              white-space: nowrap;
            }

            .main-nav {
              display: none !important;
            }

            .mobile-drawer-overlay {
              display: block;
              position: fixed;
              inset: 0;
              z-index: 2990;
              background: rgba(12, 12, 12, .28);
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
              backdrop-filter: blur(2px);
              transition: opacity .35s ease, visibility .35s ease;
            }

            .mobile-drawer-overlay.open {
              opacity: 1;
              visibility: visible;
              pointer-events: auto;
            }

            .mobile-navigation-drawer {
              display: flex;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 3000;
              width: 100vw;
              max-width: none;
              height: 100dvh;
              flex-direction: column;
              background: #fff;
              box-shadow: none;
              transform: translateX(-105%);
              transition: transform .42s cubic-bezier(.22, 1, .36, 1);
              overflow: hidden;
            }

            .mobile-navigation-drawer.open {
              transform: translateX(0);
            }

            .mobile-drawer-header {
              min-height: 70px;
              padding: 0 20px 0 24px;
              border-bottom: 1px solid #e8e6e1;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .mobile-drawer-brand {
              margin-left: 5px;
              font-family: Georgia, 'Times New Roman', serif;
              font-size: 23px;
              letter-spacing: 7px;
            }

            .mobile-search-panel {
              position: fixed;
              inset: 0;
              z-index: 3200;
              width: 100vw;
              height: 100dvh;
              padding: 0 24px;
              box-sizing: border-box;
              background: #fff;
              display: block;
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
              transform: translateY(-12px);
              transition: opacity .28s ease, transform .38s cubic-bezier(.22,1,.36,1), visibility .28s ease;
            }

            .mobile-search-panel.open {
              opacity: 1;
              visibility: visible;
              pointer-events: auto;
              transform: translateY(0);
            }

            .mobile-search-header {
              min-height: 70px;
              border-bottom: 1px solid #e8e6e1;
              display: flex;
              align-items: center;
              justify-content: space-between;
              color: #171715;
              font-size: 9px;
              font-weight: 600;
              letter-spacing: 2.2px;
              text-transform: uppercase;
            }

            .mobile-search-header button {
              position: relative;
              width: 34px;
              height: 34px;
              border: 0;
              background: transparent;
              cursor: pointer;
            }

            .mobile-search-header button span {
              position: absolute;
              top: 50%;
              left: 8px;
              width: 19px;
              height: 1px;
              background: #111;
            }

            .mobile-search-header button span:first-child { transform: rotate(45deg); }
            .mobile-search-header button span:last-child { transform: rotate(-45deg); }

            .mobile-search-form {
              margin-top: clamp(70px, 16vh, 145px);
              padding-bottom: 13px;
              border-bottom: 1px solid #171715;
              display: grid;
              grid-template-columns: 25px 1fr auto;
              align-items: center;
              gap: 12px;
            }

            .mobile-search-form > svg {
              width: 20px;
              height: 20px;
              fill: none;
              stroke: #111;
              stroke-width: 1.25;
              stroke-linecap: round;
            }

            .mobile-search-form input {
              width: 100%;
              border: 0;
              outline: 0;
              background: transparent;
              color: #111;
              font-family: Georgia, 'Times New Roman', serif;
              font-size: clamp(23px, 7vw, 34px);
              font-weight: 400;
            }

            .mobile-search-form input::placeholder {
              color: #aaa69f;
            }

            .mobile-search-form button {
              border: 0;
              background: transparent;
              color: #111;
              padding: 9px 0 9px 12px;
              font-size: 8px;
              font-weight: 700;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              cursor: pointer;
            }

            .mobile-search-form button:disabled {
              opacity: .3;
            }

            .mobile-search-hint {
              margin: 20px 0 0 37px;
              color: #8b8781;
              font-size: 8px;
              line-height: 1.7;
              letter-spacing: .5px;
            }

            .mobile-drawer-header button {
              position: relative;
              width: 34px;
              height: 34px;
              border: 0;
              background: transparent;
              cursor: pointer;
            }

            .mobile-drawer-header button span {
              position: absolute;
              top: 50%;
              left: 8px;
              width: 19px;
              height: 1px;
              background: #111;
            }

            .mobile-drawer-header button span:first-child { transform: rotate(45deg); }
            .mobile-drawer-header button span:last-child { transform: rotate(-45deg); }

            .mobile-drawer-nav {
              flex: 1;
              overflow-y: auto;
              overscroll-behavior: contain;
              padding: 13px 24px 30px;
            }

            .mobile-drawer-link,
            .mobile-drawer-trigger {
              width: 100%;
              min-height: 59px;
              padding: 0;
              border: 0;
              border-bottom: 1px solid #eceae6;
              background: transparent;
              color: #171715 !important;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 15.5px;
              font-weight: 400;
              letter-spacing: .05px;
              text-align: left;
              text-decoration: none !important;
              cursor: pointer;
            }

            .mobile-link-arrow {
              position: relative;
              flex: 0 0 26px;
              width: 26px;
              height: 26px;
              margin: 0;
              border: 0;
              color: transparent !important;
              font-size: 0;
              transform: none;
            }

            .mobile-link-arrow::before {
              content: "";
              position: absolute;
              top: 9px;
              left: 8px;
              width: 7px;
              height: 7px;
              border-top: 1px solid #5f5d59;
              border-right: 1px solid #5f5d59;
              transform: rotate(45deg);
            }

            .mobile-drawer-trigger .mobile-submenu-arrow {
              display: inline-flex;
              flex: 0 0 26px;
              width: 26px;
              height: 26px;
              margin: 0;
              color: #77736d;
              transform: rotate(-90deg);
            }

            .mobile-drawer-group.open .mobile-drawer-trigger .mobile-submenu-arrow {
              color: #111;
              transform: rotate(0deg);
            }

            .mobile-drawer-trigger .mobile-submenu-arrow svg {
              width: 10px;
              height: 7px;
            }

            .mobile-drawer-submenu {
              position: absolute;
              inset: 0;
              z-index: 20;
              max-height: none;
              padding: 0 24px 35px;
              box-sizing: border-box;
              overflow-y: auto;
              display: block;
              background: #fff;
              opacity: 1;
              visibility: hidden;
              pointer-events: none;
              transform: translateX(100%);
              transition: transform .42s cubic-bezier(.22, 1, .36, 1), visibility .42s ease;
            }

            .mobile-drawer-group.open .mobile-drawer-submenu {
              max-height: none;
              padding: 0 24px 35px;
              visibility: visible;
              pointer-events: auto;
              transform: translateX(0);
            }

            .mobile-drawer-submenu a,
            .mobile-submenu-link,
            .mobile-category-next {
              width: 100%;
              min-height: 64px;
              border-bottom: 1px solid #eceae6;
              border-top: 0;
              border-left: 0;
              border-right: 0;
              padding: 0;
              background: transparent;
              color: #171715 !important;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 15px;
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.35;
              letter-spacing: .05px;
              text-align: left;
              text-decoration: none !important;
              cursor: pointer;
            }

            .mobile-category-page {
              position: absolute;
              inset: 0;
              z-index: 30;
              min-height: 100%;
              padding: 0 24px 35px;
              box-sizing: border-box;
              overflow-y: auto;
              background: #fff;
              visibility: hidden;
              pointer-events: none;
              transform: translateX(100%);
              transition: transform .42s cubic-bezier(.22, 1, .36, 1), visibility .42s ease;
            }

            .mobile-category-page.open {
              visibility: visible;
              pointer-events: auto;
              transform: translateX(0);
            }

            .mobile-drawer-submenu .mobile-view-all {
              grid-column: 1 / -1;
              margin-top: 0;
              border-bottom: 1px solid #eceae6;
              color: #111 !important;
              font-size: 15px;
              font-weight: 400;
              letter-spacing: .05px;
              text-transform: none;
            }

            .mobile-submenu-page-header {
              position: sticky;
              top: 0;
              z-index: 2;
              min-height: 70px;
              margin: 0 -24px;
              padding: 0 20px;
              border-bottom: 1px solid #e8e6e1;
              background: rgba(255,255,255,.98);
              display: grid;
              grid-template-columns: 1fr auto 1fr;
              align-items: center;
            }

            .mobile-submenu-page-header > strong {
              color: #171715;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: .1px;
              white-space: nowrap;
            }

            .mobile-submenu-back {
              justify-self: start;
              min-width: 65px;
              border: 0;
              background: transparent;
              padding: 8px 0;
              display: inline-flex;
              align-items: center;
              gap: 7px;
              color: #171715;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            }

            .mobile-submenu-back svg {
              width: 7px;
              height: 13px;
              fill: none;
              stroke: currentColor;
              stroke-width: 1.25;
              stroke-linecap: round;
              stroke-linejoin: round;
            }

            .mobile-submenu-close {
              position: relative;
              justify-self: end;
              width: 34px;
              height: 34px;
              border: 0;
              background: transparent;
              cursor: pointer;
            }

            .mobile-submenu-close span {
              position: absolute;
              top: 50%;
              left: 8px;
              width: 19px;
              height: 1px;
              background: #111;
            }

            .mobile-submenu-close span:first-child { transform: rotate(45deg); }
            .mobile-submenu-close span:last-child { transform: rotate(-45deg); }

            .mobile-drawer-footer {
              padding: 18px 24px 20px;
              border-top: 1px solid #e8e6e1;
              background: #f7f6f3;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px 18px;
            }

            .mobile-drawer-footer > a,
            .mobile-footer-link {
              padding: 0;
              border: 0;
              background: transparent;
              color: #403d39 !important;
              font-size: 9px;
              font-family: inherit;
              text-align: left;
              cursor: pointer;
              letter-spacing: .6px;
              text-decoration: none !important;
            }

            .mobile-drawer-languages {
              grid-column: 1 / -1;
              display: flex;
              gap: 18px;
              padding-top: 5px;
            }

            .mobile-drawer-languages button {
              border: 0;
              border-bottom: 1px solid transparent;
              background: transparent;
              padding: 2px 0;
              color: #85817b;
              font-size: 9px;
              cursor: pointer;
            }

            .mobile-drawer-languages button.active {
              border-bottom-color: #111;
              color: #111;
            }

            .nav-item {
              flex: 0 0 auto;
              font-size: 6.8px;
              letter-spacing: 0.65px;
              line-height: 1.2;
              white-space: nowrap;
              padding: 0 2px;
            }

            .mega-nav-item {
              position: static;
              display: flex;
              align-items: center;
              align-self: auto;
              height: auto;
              flex: 0 0 auto;
            }

            .mega-nav-trigger::before {
              content: none;
            }

            .mega-nav-trigger {
              height: auto;
              min-height: 0;
              margin: 0;
              padding: 0 2px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 2px;
            }

            .mobile-submenu-arrow {
              width: 15px;
              height: 15px;
              margin-left: 2px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: rgba(17, 17, 17, .62);
              transform: translateY(-.5px);
              transform-origin: center;
              transition: transform .32s cubic-bezier(.22, 1, .36, 1), color .25s ease;
            }

            .mobile-submenu-arrow svg {
              display: block;
              width: 9px;
              height: 6px;
              overflow: visible;
            }

            .mobile-submenu-arrow path {
              fill: none;
              stroke: currentColor;
              stroke-width: 1.1;
              stroke-linecap: round;
              stroke-linejoin: round;
            }

            .mega-nav-item.open .mobile-submenu-arrow {
              color: #111;
              transform: translateY(-.5px) rotate(180deg);
            }

            .jewellery-mega-menu {
              display: block !important;
              position: absolute;
              top: 100%;
              left: 0;
              width: 100%;
              max-height: calc(100vh - 148px);
              overflow-y: auto;
              overscroll-behavior: contain;
              background: #fff;
              border-top: 1px solid #eee;
              border-bottom: 1px solid #ddd;
              box-shadow: 0 18px 30px rgba(0,0,0,.12);
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
              transform: translateY(-6px);
              transition: opacity .2s ease, transform .2s ease, visibility .2s ease;
              z-index: 1500;
            }

            /* Dokunmatik cihazlarda kalan :hover durumu menüyü açık tutmasın */
            .mega-nav-item:hover .jewellery-mega-menu {
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
              transform: translateY(-6px);
            }

            .mega-nav-item.open .jewellery-mega-menu {
              opacity: 1;
              visibility: visible;
              pointer-events: auto;
              transform: translateY(0);
            }

            .mega-menu-inner {
              width: 100%;
              margin: 0;
              padding: 22px 18px 30px;
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 24px 18px;
              align-items: start;
            }

            .mega-menu-column h4 {
              margin-bottom: 14px;
              font-size: 10px;
              letter-spacing: 1px;
            }

            .mega-menu-column a {
              margin-bottom: 11px;
              font-size: 9.5px;
              line-height: 1.45;
              opacity: .68;
            }

            .mega-menu-feature {
              grid-column: 1 / -1;
              min-height: 150px;
              padding: 22px;
            }

            .cappadocia-menu-inner {
              width: 100%;
              margin: 0;
              padding: 22px 18px 28px;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 24px 18px;
            }

            .cappadocia-menu-column {
              grid-column: 1 / -1;
            }

            .cappadocia-menu-feature {
              grid-column: 1 / -1;
              min-height: 140px;
            }

            .natural-stones-menu-inner {
              width: 100%;
              margin: 0;
              padding: 18px 18px 28px;
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
            }

            .natural-stones-link-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 0 16px;
            }

            .natural-stone-menu-link {
              min-height: 48px;
              padding: 13px 0;
              font-size: 9px;
              line-height: 1.35;
            }

            .natural-stone-menu-link:hover,
            .natural-stone-menu-link:focus {
              padding-left: 0;
            }

            .natural-stones-menu-feature {
              grid-column: 1 / -1;
              min-height: 140px;
            }

            .banner-container {
              height: clamp(260px, 38vh, 340px);
              min-height: 0;
              padding: 0;
            }

            .banner-video {
              width: 145%;
              max-width: none;
              height: 100%;
              object-fit: contain;
              object-position: center;
              transform: none;
            }

.section-title {
              padding: 54px 16px 36px;
            }

            .section-title h2 {
              font-size: 13px;
              letter-spacing: 3px;
              line-height: 1.6;
            }

            .product-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 14px 12px;
              padding: 0 16px 64px;
            }

            .product-info {
              font-size: 9px;
              letter-spacing: 1px;
              padding: 12px 0;
            }

            .home-collections {
              padding: 30px 14px 66px;
            }

            .home-collections-heading {
              margin-bottom: 28px;
              padding: 0 10px;
            }

            .home-collections-heading h2 {
              font-size: 24px;
              letter-spacing: 2.6px;
            }

            .home-collections-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 10px;
            }

            .home-collection-image-wrap {
              aspect-ratio: 1 / 1;
            }

            .home-collection-content {
              left: 12px;
              right: 12px;
              bottom: 12px;
            }

            .home-collection-content h3 {
              font-size: 15px;
              letter-spacing: 0.9px;
            }

            .home-collection-link {
              font-size: 6px;
              letter-spacing: 1.2px;
            }

            .footer-container {
              padding: 64px 20px 28px;
            }

            .footer-content {
              gap: 40px;
            }

            .footer-logo-main {
              font-size: 30px;
              letter-spacing: 10px;
            }

            .contact-icons-container {
              gap: 24px;
              flex-wrap: wrap;
              justify-content: center;
            }
          }

          @media (max-width: 480px) {
            main {
              padding-top: 110px !important;
            }

            .top-bar {
              padding: 9px 10px;
            }

            .top-link,
            .cart-container-link span,
            .top-right > span,
            .account-link {
              font-size: 8px;
            }

            .top-right > span {
              display: inline-block;
            }

            .logo-container h1 {
              font-size: 31px;
              letter-spacing: 8px;
            }

            .main-nav {
              column-gap: 10px;
              row-gap: 10px;
              padding: 9px 7px 15px;
            }

            .nav-item {
              font-size: 6.2px;
              letter-spacing: 0.4px;
              padding: 0 1px;
            }

            .banner-container {
              height: clamp(240px, 34vh, 300px);
              min-height: 0;
            }

            .banner-video {
              width: 150%;
              max-width: none;
              height: 100%;
              object-fit: contain;
              object-position: center;
              transform: none;
            }

.section-title {
              padding: 48px 14px 32px;
            }

            .section-title h2 {
              font-size: 12px;
              letter-spacing: 2.5px;
            }

            .product-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 12px 10px;
              padding: 0 12px 54px;
            }

            .home-collections {
              padding: 26px 10px 56px;
            }

            .home-collections-kicker {
              font-size: 6.5px;
              letter-spacing: 2.2px;
            }

            .home-collections-heading h2 {
              font-size: 21px;
              letter-spacing: 2px;
            }

            .home-collections-grid {
              gap: 8px;
            }

            .home-collection-number {
              top: 10px;
              left: 10px;
              font-size: 6px;
            }

            .home-collection-content {
              left: 10px;
              right: 10px;
              bottom: 10px;
            }

            .home-collection-content h3 {
              font-size: 13px;
              letter-spacing: 0.6px;
            }

            .home-collection-link {
              display: none;
            }
          }
        `}</style>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App; 
