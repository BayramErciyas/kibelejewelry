import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from './App';
import { supabase } from './supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import heroVideo from './videos/zultanite.mp4';

const normalizeKey = (value) =>
  String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[\s_]+/g, '-');

const STONE_ALIASES = {
  zultanite: 'zultanite',
  zultanit: 'zultanite',
  paraiba: 'paraiba',
  'turmalin-paraiba': 'paraiba',
  'tourmaline-paraiba': 'paraiba',
  'paraiba-tourmaline': 'paraiba',
  citrine: 'citrine',
  sitrin: 'citrine',
  moissanite: 'moissanite',
  mozanit: 'moissanite',
  aquamarine: 'aquamarine',
  akuamarin: 'aquamarine',
  'akuamarin-taşı': 'aquamarine',
  'akuamarin-tasi': 'aquamarine',
  diamond: 'diamond',
  elmas: 'diamond',
  opal: 'opal',
  sapphire: 'sapphire',
  safir: 'sapphire',
  tanzanite: 'tanzanite',
  tanzanit: 'tanzanite',
  topaz: 'topaz',
  tourmaline: 'tourmaline',
  turmalin: 'tourmaline',
  ruby: 'ruby',
  yakut: 'ruby',
  zircon: 'zircon',
  zirkon: 'zircon',
  emerald: 'emerald',
  zumrut: 'emerald',
  'zümrüt': 'emerald',
  'pink-quartz': 'pink-quartz',
  'pembe-kuvars': 'pink-quartz',
};

const CATEGORY_ALIASES = {
  ring: 'rings',
  rings: 'rings',
  yuzuk: 'rings',
  'yüzük': 'rings',
  necklace: 'necklaces',
  necklaces: 'necklaces',
  kolye: 'necklaces',
  earring: 'earrings',
  earrings: 'earrings',
  kupe: 'earrings',
  'küpe': 'earrings',
  bracelet: 'bracelets',
  bracelets: 'bracelets',
  bileklik: 'bracelets',
  charm: 'charms',
  charms: 'charms',
};

const NATURAL_STONE_KEYS = new Set([
  'zultanite',
  'paraiba',
  'citrine',
  'moissanite',
  'aquamarine',
  'pink-quartz',
  'diamond',
  'opal',
  'sapphire',
  'tanzanite',
  'topaz',
  'tourmaline',
  'ruby',
  'zircon',
  'emerald',
]);

const SERIES_ALIASES = {
  balloon: 'balloon',
  balon: 'balloon',
  'cappadocia-balloon': 'balloon',
  'kapadokya-balon': 'balloon',
  nazar: 'nazar',
  'evil-eye': 'nazar',
  'evil eye': 'nazar',
  'cappadocia-evil-eye': 'nazar',
  'kapadokya-nazar': 'nazar',
  cappadocia: 'cappadocia',
  kapadokya: 'cappadocia',
};

const METAL_ALIASES = {
  silver: 'silver',
  '925-silver': 'silver',
  '925-gümüş': 'silver',
  '925-gumus': 'silver',
  gold: 'gold',
  '14k-gold': 'gold',
  '14k-altın': 'gold',
  '14k-altin': 'gold',
  'white-gold': 'white-gold',
  'beyaz-altın': 'white-gold',
  'beyaz-altin': 'white-gold',
};

const PRICE_RANGE_LIMITS = {
  'under-5000': { min: null, max: 5000 },
  '5000-10000': { min: 5000, max: 10000 },
  '10000-25000': { min: 10000, max: 25000 },
  '25000-plus': { min: 25000, max: null },
};

const FILTER_MENU_COPY = {
  TR: {
    all: 'Tümü',
    clear: 'Filtreleri Temizle',
    andUnder: 've altı',
    andAbove: 've üzeri',
    groups: {
      category: 'Kategori',
      metal: 'Maden',
      stone: 'Taş Tipi',
      price: 'Fiyat',
    },
    categories: [
      { value: 'rings', label: 'Yüzükler' },
      { value: 'necklaces', label: 'Kolyeler' },
      { value: 'earrings', label: 'Küpeler' },
      { value: 'bracelets', label: 'Bileklikler' },
      { value: 'charms', label: 'Charmlar' },
    ],
    metals: [
      { value: 'silver', label: '925 Gümüş' },
      { value: 'gold', label: '14K Altın' },
      { value: 'white-gold', label: 'Beyaz Altın' },
    ],
    stones: [
      { value: 'aquamarine', label: 'Akuamarin Taşı' },
      { value: 'zultanite', label: 'Diaspor (Zultanite)' },
      { value: 'diamond', label: 'Elmas' },
      { value: 'opal', label: 'Opal' },
      { value: 'sapphire', label: 'Safir' },
      { value: 'citrine', label: 'Sitrin' },
      { value: 'tanzanite', label: 'Tanzanit' },
      { value: 'topaz', label: 'Topaz' },
      { value: 'tourmaline', label: 'Turmalin' },
      { value: 'ruby', label: 'Yakut' },
      { value: 'zircon', label: 'Zirkon' },
      { value: 'emerald', label: 'Zümrüt' },
      { value: 'paraiba', label: 'Turmalin Paraiba' },
      { value: 'moissanite', label: 'Mozanit' },
      { value: 'pink-quartz', label: 'Pink Quartz' },
    ],
  },
  EN: {
    all: 'All',
    clear: 'Clear Filters',
    andUnder: 'and under',
    andAbove: 'and above',
    groups: {
      category: 'Category',
      metal: 'Metal',
      stone: 'Stone Type',
      price: 'Price',
    },
    categories: [
      { value: 'rings', label: 'Rings' },
      { value: 'necklaces', label: 'Necklaces' },
      { value: 'earrings', label: 'Earrings' },
      { value: 'bracelets', label: 'Bracelets' },
      { value: 'charms', label: 'Charms' },
    ],
    metals: [
      { value: 'silver', label: '925 Sterling Silver' },
      { value: 'gold', label: '14K Gold' },
      { value: 'white-gold', label: 'White Gold' },
    ],
    stones: [
      { value: 'aquamarine', label: 'Aquamarine' },
      { value: 'zultanite', label: 'Diaspore (Zultanite)' },
      { value: 'diamond', label: 'Diamond' },
      { value: 'opal', label: 'Opal' },
      { value: 'sapphire', label: 'Sapphire' },
      { value: 'citrine', label: 'Citrine' },
      { value: 'tanzanite', label: 'Tanzanite' },
      { value: 'topaz', label: 'Topaz' },
      { value: 'tourmaline', label: 'Tourmaline' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'zircon', label: 'Zircon' },
      { value: 'emerald', label: 'Emerald' },
      { value: 'paraiba', label: 'Paraiba Tourmaline' },
      { value: 'moissanite', label: 'Moissanite' },
      { value: 'pink-quartz', label: 'Pink Quartz' },
    ],
  },
  ZH: {
    all: '全部',
    clear: '清除筛选',
    andUnder: '及以下',
    andAbove: '及以上',
    groups: {
      category: '类别',
      metal: '金属',
      stone: '宝石类型',
      price: '价格',
    },
    categories: [
      { value: 'rings', label: '戒指' },
      { value: 'necklaces', label: '项链' },
      { value: 'earrings', label: '耳环' },
      { value: 'bracelets', label: '手链' },
      { value: 'charms', label: '吊饰' },
    ],
    metals: [
      { value: 'silver', label: '925纯银' },
      { value: 'gold', label: '14K黄金' },
      { value: 'white-gold', label: '白色K金' },
    ],
    stones: [
      { value: 'aquamarine', label: '海蓝宝石' },
      { value: 'zultanite', label: '硬水铝石（苏丹石）' },
      { value: 'diamond', label: '钻石' },
      { value: 'opal', label: '欧泊' },
      { value: 'sapphire', label: '蓝宝石' },
      { value: 'citrine', label: '黄水晶' },
      { value: 'tanzanite', label: '坦桑石' },
      { value: 'topaz', label: '托帕石' },
      { value: 'tourmaline', label: '碧玺' },
      { value: 'ruby', label: '红宝石' },
      { value: 'zircon', label: '锆石' },
      { value: 'emerald', label: '祖母绿' },
      { value: 'paraiba', label: '帕拉伊巴碧玺' },
      { value: 'moissanite', label: '莫桑石' },
      { value: 'pink-quartz', label: '粉晶' },
    ],
  },
  ES: {
    all: 'Todos',
    clear: 'Limpiar filtros',
    andUnder: 'o menos',
    andAbove: 'o más',
    groups: {
      category: 'Categoría',
      metal: 'Metal',
      stone: 'Tipo de piedra',
      price: 'Precio',
    },
    categories: [
      { value: 'rings', label: 'Anillos' },
      { value: 'necklaces', label: 'Collares' },
      { value: 'earrings', label: 'Pendientes' },
      { value: 'bracelets', label: 'Pulseras' },
      { value: 'charms', label: 'Dijes' },
    ],
    metals: [
      { value: 'silver', label: 'Plata 925' },
      { value: 'gold', label: 'Oro de 14K' },
      { value: 'white-gold', label: 'Oro blanco' },
    ],
    stones: [
      { value: 'aquamarine', label: 'Aguamarina' },
      { value: 'zultanite', label: 'Diásporo (Zultanita)' },
      { value: 'diamond', label: 'Diamante' },
      { value: 'opal', label: 'Ópalo' },
      { value: 'sapphire', label: 'Zafiro' },
      { value: 'citrine', label: 'Citrino' },
      { value: 'tanzanite', label: 'Tanzanita' },
      { value: 'topaz', label: 'Topacio' },
      { value: 'tourmaline', label: 'Turmalina' },
      { value: 'ruby', label: 'Rubí' },
      { value: 'zircon', label: 'Circón' },
      { value: 'emerald', label: 'Esmeralda' },
      { value: 'paraiba', label: 'Turmalina Paraíba' },
      { value: 'moissanite', label: 'Moissanita' },
      { value: 'pink-quartz', label: 'Cuarzo rosa' },
    ],
  },
};

const normalizeStone = (value) => {
  const key = normalizeKey(value);
  return STONE_ALIASES[key] || key;
};

const normalizeCategory = (value) => {
  const key = normalizeKey(value);
  return CATEGORY_ALIASES[key] || key;
};

const normalizeSeries = (value) => {
  const key = normalizeKey(value);
  return SERIES_ALIASES[key] || key;
};

const normalizeMetal = (value) => {
  const key = normalizeKey(value);
  return METAL_ALIASES[key] || key;
};

const Jewellery = () => {
  const context = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { lang, addToCart, formatPrice } = context || {
    lang: 'TR',
    addToCart: () => {},
    formatPrice: (price) => `${Number(price || 0).toLocaleString('tr-TR')} TL`,
  };

  const [activePanel, setActivePanel] = useState(null);
  const [sortType, setSortType] = useState(0);
  const [openFilterGroup, setOpenFilterGroup] = useState('category');
  const [filterDraft, setFilterDraft] = useState({
    category: '',
    metal: '',
    stone: '',
    price: '',
  });

  const [initialProducts, setInitialProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  // =========================================================
  // DİL AYARLARI
  // =========================================================

  const translations = {
    EN: {
      results: 'RESULTS',
      filter: 'FILTER',
      sort: 'SORT',
      filterTitle: 'Filter',
      sortTitle: 'Sort by',
      apply: 'Apply',
      currency: 'USD',
      addBtn: 'ADD TO BAG',
      campaignTitle: 'THE COLOR OF ZULTANITE',
      campaignText: 'Discover the natural color change of Zultanite.',
      campaignBtn: 'DISCOVER MORE',
      noProducts: 'NO PRODUCTS FOUND FOR THIS SELECTION.',

      sortOptions: [
        'Newest',
        'Price: High to Low',
        'Price: Low to High',
        'Relevance'
      ]
    },

    TR: {
      results: 'SONUÇ',
      filter: 'FİLTRELE',
      sort: 'SIRALA',
      filterTitle: 'Filtre',
      sortTitle: 'Sıralama',
      apply: 'Uygula',
      currency: 'TL',
      addBtn: 'SEPETE EKLE',
      campaignTitle: 'ZULTANITE’IN RENKLERİ',
      campaignText: 'Doğal Zultanite taşının benzersiz renk geçişlerini keşfedin.',
      campaignBtn: 'DAHA FAZLASINI KEŞFET',
      noProducts: 'BU SEÇİME UYGUN ÜRÜN BULUNAMADI.',

      sortOptions: [
        'En Yeniler',
        'Fiyat: Azalan',
        'Fiyat: Artan',
        'Önerilen'
      ]
    },

    ZH: {
      results: '结果',
      filter: '筛选',
      sort: '排序',
      filterTitle: '筛选',
      sortTitle: '排序',
      apply: '应用',
      currency: 'CNY',
      addBtn: '加入购物车',
      campaignTitle: '苏丹石的色彩',
      campaignText: '探索天然苏丹石独特的变色魅力。',
      campaignBtn: '探索更多',
      noProducts: '未找到符合此筛选条件的商品。',

      sortOptions: [
        '最新上架',
        '价格：从高到低',
        '价格：从低到高',
        '相关性'
      ]
    },

    ES: {
      results: 'RESULTADOS',
      filter: 'FILTRAR',
      sort: 'ORDENAR',
      filterTitle: 'Filtrar',
      sortTitle: 'Ordenar por',
      apply: 'Aplicar',
      currency: 'EUR',
      addBtn: 'AÑADIR A LA BOLSA',
      campaignTitle: 'LOS COLORES DE LA ZULTANITA',
      campaignText:
        'Descubre el cambio de color único de la Zultanita natural.',
      campaignBtn: 'DESCUBRIR MÁS',
      noProducts: 'NO SE ENCONTRARON PRODUCTOS PARA ESTA SELECCIÓN.',

      sortOptions: [
        'Más recientes',
        'Precio: de mayor a menor',
        'Precio: de menor a mayor',
        'Relevancia'
      ]
    }
  };

  const t = translations[lang] || translations.TR;
  const filterCopy = FILTER_MENU_COPY[lang] || FILTER_MENU_COPY.TR;

  // =========================================================
  // SUPABASE'DEN ÜRÜNLERİ ÇEK
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError("");

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error('Ürünler alınamadı:', error);
        setProductsError('Ürünler yüklenirken bir hata oluştu.');
        setInitialProducts([]);
        setProductsLoading(false);
        return;
      }

      const normalizedProducts = (data || []).map((product) => ({
        ...product,
        name: product.name,
        img: product.image_url,
        date: product.created_at
          ? new Date(product.created_at).getTime()
          : 0,
      }));

      setInitialProducts(normalizedProducts);
      setProductsLoading(false);
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // ÜRÜN SIRALAMA
  // =========================================================

  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = normalizeCategory(searchParams.get('category'));
  const selectedStone = normalizeStone(searchParams.get('stone'));
  const selectedMetal = normalizeMetal(searchParams.get('metal'));
  const requestedPriceRange = normalizeKey(searchParams.get('price'));
  const selectedPriceRange = PRICE_RANGE_LIMITS[requestedPriceRange]
    ? requestedPriceRange
    : '';
  const selectedCollection = normalizeKey(searchParams.get('collection'));
  const selectedSeries = normalizeSeries(searchParams.get('series'));

  const priceOptions = [
    {
      value: 'under-5000',
      label: `${formatPrice(5000)} ${filterCopy.andUnder}`,
    },
    {
      value: '5000-10000',
      label: `${formatPrice(5000)} – ${formatPrice(10000)}`,
    },
    {
      value: '10000-25000',
      label: `${formatPrice(10000)} – ${formatPrice(25000)}`,
    },
    {
      value: '25000-plus',
      label: `${formatPrice(25000)} ${filterCopy.andAbove}`,
    },
  ];

  const filterGroups = [
    {
      key: 'category',
      label: filterCopy.groups.category,
      options: filterCopy.categories,
    },
    {
      key: 'metal',
      label: filterCopy.groups.metal,
      options: filterCopy.metals,
    },
    {
      key: 'stone',
      label: filterCopy.groups.stone,
      options: filterCopy.stones,
    },
    {
      key: 'price',
      label: filterCopy.groups.price,
      options: priceOptions,
    },
  ];

  const appliedFilterValues = {
    category: selectedCategory,
    metal: selectedMetal,
    stone: selectedStone,
    price: selectedPriceRange,
  };

  useEffect(() => {
    setFilterDraft(appliedFilterValues);
  }, [
    selectedCategory,
    selectedMetal,
    selectedStone,
    selectedPriceRange,
  ]);

  const openFilterPanel = () => {
    setFilterDraft(appliedFilterValues);
    setOpenFilterGroup('category');
    setActivePanel('filter');
  };

  const handleFilterDraftChange = (key, value) => {
    setFilterDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(location.search);

    ['category', 'metal', 'stone', 'price'].forEach((key) => {
      const value = filterDraft[key];

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete('page');

    const query = params.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}`);
    setActivePanel(null);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(location.search);

    ['category', 'metal', 'stone', 'price', 'page'].forEach((key) => {
      params.delete(key);
    });

    setFilterDraft({
      category: '',
      metal: '',
      stone: '',
      price: '',
    });

    const query = params.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}`);
    setActivePanel(null);
  };

  const filteredProducts = initialProducts.filter((product) => {
    if (product.in_stock === false) return false;

    const productCategory = normalizeCategory(product.category);
    const productStone = normalizeStone(product.stone);
    const productMetal = normalizeMetal(product.metal);
    const productPrice = Number(product.price || 0);
    const productSeries = normalizeSeries(
      product.series || product.collection || product.collection_name
    );
    const searchableProductText = normalizeKey(
      [
        product.name,
        product.description,
        product.name_en,
        product.description_en,
        product.name_zh,
        product.description_zh,
        product.name_es,
        product.description_es,
      ]
        .filter(Boolean)
        .join(' ')
    );

    const hasBalloonText =
      searchableProductText.includes('balloon') ||
      searchableProductText.includes('balon');
    const hasEvilEyeText =
      searchableProductText.includes('nazar') ||
      searchableProductText.includes('evil-eye');
    const inferredSeries =
      productSeries === 'balloon' || productSeries === 'nazar'
        ? productSeries
        : hasBalloonText
        ? 'balloon'
        : hasEvilEyeText
        ? 'nazar'
        : productSeries;

    const categoryMatches =
      !selectedCategory || productCategory === selectedCategory;
    const stoneMatches =
      !selectedStone || productStone === selectedStone;
    const metalMatches =
      !selectedMetal || productMetal === selectedMetal;
    const selectedPriceLimits = PRICE_RANGE_LIMITS[selectedPriceRange];
    const priceMatches =
      !selectedPriceLimits ||
      ((selectedPriceLimits.min === null ||
        productPrice >= selectedPriceLimits.min) &&
        (selectedPriceLimits.max === null ||
          productPrice <= selectedPriceLimits.max));
    const collectionMatches =
      selectedCollection !== 'natural-stones' ||
      NATURAL_STONE_KEYS.has(productStone);
    const seriesMatches =
      !selectedSeries ||
      (selectedSeries === 'cappadocia'
        ? productSeries === 'cappadocia' ||
          inferredSeries === 'balloon' ||
          inferredSeries === 'nazar'
        : inferredSeries === selectedSeries);

    return (
      categoryMatches &&
      stoneMatches &&
      metalMatches &&
      priceMatches &&
      collectionMatches &&
      seriesMatches
    );
  });

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {

      // Fiyat yüksekten düşüğe
      if (sortType === 1) {
        return b.price - a.price;
      }

      // Fiyat düşükten yükseğe
      if (sortType === 2) {
        return a.price - b.price;
      }

      // En yeni
      return b.date - a.date;
    }
  );

  // =========================================================
  // İKONLAR
  // =========================================================

  const Icon = ({ type }) => {

    const icons = {

      filter: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="1.2"
        >
          <path
            d="
            M4 21v-7
            m0-4V3
            m8 18v-9
            m0-4V3
            m8 18v-5
            m0-4V3
            M1 14h6
            m2-6h6
            m2 8h6
            "
          />
        </svg>
      ),

      sort: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="1.2"
        >
          <path
            d="
            M11 5h10
            M11 9h7
            M11 13h4
            M3 17l3 3 3-3
            M6 18V4
            "
          />
        </svg>
      ),

      arrow: (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      ),

      close: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="1.2"
        >
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      ),

      check: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        >
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),

      heart: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="1"
        >
          <path
            d="
            M20.84 4.61
            a5.5 5.5 0 0 0-7.78 0
            L12 5.67
            l-1.06-1.06
            a5.5 5.5 0 0 0-7.78 7.78
            l1.06 1.06
            L12 21.23
            l8.72-8.72
            1.06-1.06
            a5.5 5.5 0 0 0 0-7.78z
            "
          />
        </svg>
      ),

      bag: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="
            M6 2
            L3 6
            v14
            a2 2 0 0 0 2 2
            h14
            a2 2 0 0 0 2-2
            V6
            l-3-4Z
            "
          />

          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
          />

          <path
            d="
            M16 10
            a4 4 0 0 1-8 0
            "
          />
        </svg>
      )
    };

    return icons[type] || null;
  };

  // =========================================================
  // SWAROVSKI TARZI ÜRÜN AKIŞI
  // 8 normal ürün + 1 büyük kampanya kartı + 2 normal ürün
  // =========================================================

  const productGroups = [];
  for (let i = 0; i < sortedProducts.length; i += 10) {
    productGroups.push(sortedProducts.slice(i, i + 10));
  }

  const getLocalizedProduct = (product) => {
    if (lang === 'EN') {
      return {
        ...product,
        name: product.name_en?.trim() || product.name,
        description:
          product.description_en?.trim() || product.description,
      };
    }

    if (lang === 'ZH') {
      return {
        ...product,
        name: product.name_zh?.trim() || product.name,
        description:
          product.description_zh?.trim() || product.description,
      };
    }

    if (lang === 'ES') {
      return {
        ...product,
        name: product.name_es?.trim() || product.name,
        description:
          product.description_es?.trim() || product.description,
      };
    }

    return product;
  };

  const renderProductCard = (product) => {
    const localizedProduct = getLocalizedProduct(product);

    return (
    <div key={localizedProduct.id} className="luxury-item-card">
      <div className="item-img-box">
        <div className="wishlist-btn">
          <Icon type="heart" />
        </div>

        {localizedProduct.img ? (
          <img
            src={localizedProduct.img}
            alt={localizedProduct.name}
            loading="lazy"
          />
        ) : (
          <div className="image-error">FOTOĞRAF BULUNAMADI</div>
        )}
      </div>

      <div className="item-details">
        <h3>{localizedProduct.name}</h3>

        {localizedProduct.description && (
          <p className="item-description">
            {localizedProduct.description}
          </p>
        )}

        <div className="price-row">
          <p className="price-text">
            {formatPrice(localizedProduct.price)}
          </p>

          <button
            className="inline-add-btn"
            onClick={() => addToCart(localizedProduct)}
          >
            <Icon type="bag" />
            <span>{t.addBtn}</span>
          </button>
        </div>
      </div>
    </div>
    );
  };

  const renderCampaignCard = (groupIndex) => (
    <div key={`campaign-${groupIndex}`} className="campaign-feature-card">
      <div className="campaign-media">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className="campaign-copy">
        <div>
          <span className="campaign-kicker">KIBELE • CAPPADOCIA</span>
          <h2>{t.campaignTitle}</h2>
          <p>{t.campaignText}</p>
        </div>

        <a href="/jewellery" className="campaign-link">
          {t.campaignBtn}
        </a>
      </div>
    </div>
  );

  // =========================================================
  // SAYFA
  // =========================================================

  return (

    <div className="jewellery-page-wrapper">

      <div className="jewellery-page-fluid">

        {/* ===============================
            FİLTRE ÜST BAR
        =============================== */}

        <div className="filter-section-container">

          <div className="filter-bar-sticky">

            <div className="filter-bar-content">

              <div className="res-count">

                {productsLoading
                  ? `... ${t.results}`
                  : `${sortedProducts.length} ${t.results}`}

              </div>


              <div className="filter-actions">

                <button
                  type="button"
                  className="action-item"
                  onClick={openFilterPanel}
                >

                  <Icon type="filter" />

                  <span>
                    {t.filter}
                  </span>

                  <Icon type="arrow" />

                </button>


                <button
                  type="button"
                  className="action-item"
                  onClick={() =>
                    setActivePanel('sort')
                  }
                >

                  <Icon type="sort" />

                  <span>
                    {t.sort}
                  </span>

                  <Icon type="arrow" />

                </button>

              </div>

            </div>

          </div>

        </div>


        {/* ===============================
            KARARTMA
        =============================== */}

        <div
          className={
            `overlay ${
              activePanel
                ? 'visible'
                : ''
            }`
          }

          onClick={() =>
            setActivePanel(null)
          }
        />


        {/* ===============================
            SAĞ FİLTRE PANELİ
        =============================== */}

        <div
          className={
            `side-panel ${
              activePanel
                ? 'open'
                : ''
            }`
          }
        >

          <div className="panel-header">

            <span className="panel-title">

              {
                activePanel === 'filter'
                  ? t.filterTitle
                  : t.sortTitle
              }

            </span>


            <button
              type="button"
              className="panel-close-button"
              onClick={() => setActivePanel(null)}
              aria-label="Kapat"
            >

              <Icon type="close" />

            </button>

          </div>


          <div className="panel-content">

            {
              activePanel === 'filter'
                ? (

                  filterGroups.map((group) => {
                    const groupIsOpen = openFilterGroup === group.key;
                    const selectedOption = group.options.find(
                      (option) => option.value === filterDraft[group.key]
                    );

                    return (
                      <div
                        className={`filter-accordion ${groupIsOpen ? 'open' : ''}`}
                        key={group.key}
                      >
                        <button
                          type="button"
                          className="filter-group"
                          onClick={() =>
                            setOpenFilterGroup(groupIsOpen ? null : group.key)
                          }
                          aria-expanded={groupIsOpen}
                        >
                          <span className="filter-group-heading">
                            <span>{group.label}</span>
                            {selectedOption && (
                              <small>{selectedOption.label}</small>
                            )}
                          </span>

                          <span className="filter-group-arrow">
                            <Icon type="arrow" />
                          </span>
                        </button>

                        {groupIsOpen && (
                          <div
                            className="filter-options"
                            role="radiogroup"
                            aria-label={group.label}
                          >
                            <label className="filter-option">
                              <input
                                type="radio"
                                name={`filter-${group.key}`}
                                value=""
                                checked={!filterDraft[group.key]}
                                onChange={() =>
                                  handleFilterDraftChange(group.key, '')
                                }
                              />
                              <span className="filter-option-mark" />
                              <span>{filterCopy.all}</span>
                            </label>

                            {group.options.map((option) => (
                              <label className="filter-option" key={option.value}>
                                <input
                                  type="radio"
                                  name={`filter-${group.key}`}
                                  value={option.value}
                                  checked={filterDraft[group.key] === option.value}
                                  onChange={() =>
                                    handleFilterDraftChange(
                                      group.key,
                                      option.value
                                    )
                                  }
                                />
                                <span className="filter-option-mark" />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })

                )

                : (

                  t.sortOptions.map(
                    (opt, i) => (

                      <div
                        key={i}

                        className={
                          `filter-group sort-option ${
                            sortType === i
                              ? 'active-sort'
                              : ''
                          }`
                        }

                        onClick={() => {

                          setSortType(i);

                          setActivePanel(null);

                        }}

                        style={{
                          cursor: 'pointer'
                        }}
                      >

                        <span>
                          {opt}
                        </span>

                        {
                          sortType === i && (
                            <Icon type="check" />
                          )
                        }

                      </div>

                    )
                  )

                )
            }

          </div>


          {activePanel === 'filter' && (
            <div className="panel-footer">
              <button
                type="button"
                className="btn-clear-filters"
                onClick={clearFilters}
              >
                {filterCopy.clear}
              </button>

              <button
                type="button"
                className="btn-apply"
                onClick={applyFilters}
              >
                {t.apply}
              </button>
            </div>
          )}

        </div>


        {/* ===============================
            ÜRÜNLER
        =============================== */}

        {productsError && (
          <div className="products-status products-error">
            {productsError}
          </div>
        )}

        {productsLoading ? (
          <div className="products-status">
            ÜRÜNLER YÜKLENİYOR...
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="products-status">
            {t.noProducts}
          </div>
        ) : (
          <div className="luxury-product-grid">
            {productGroups.map((group, groupIndex) => {
              const firstEight = group.slice(0, 8);
              const lastTwo = group.slice(8, 10);

              return (
                <React.Fragment key={`group-${groupIndex}`}>
                  {firstEight.map(renderProductCard)}

                  {lastTwo.length > 0 && renderCampaignCard(groupIndex)}

                  {lastTwo.map(renderProductCard)}
                </React.Fragment>
              );
            })}
          </div>
        )}


        {/* ===============================
            CSS
        =============================== */}

        <style>{`

          .jewellery-page-wrapper {
            width: 100%;
            min-height: 100vh;
          }


          .jewellery-page-fluid {
            width: 100%;
            background: #fff;
          }


          .filter-section-container {
            padding-top: 40px;
            background: #fff;
          }


          .filter-bar-sticky {
            position: sticky;
            top: 155px;
            background: #fff;
            z-index: 100;
            border-top: 1px solid #f2f2f2;
            border-bottom: 1px solid #f2f2f2;
            width: 100%;
          }


          .filter-bar-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px 12%;
            width: 100%;
          }


          .res-count {
            font-size: 10px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #888;
          }


          .filter-actions {
            display: flex;
            gap: 40px;
          }


          .action-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0;
            border: 0;
            background: transparent;
            color: inherit;
            cursor: pointer;
            font-family: inherit;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
          }


          /* =============================
             ÜRÜN GRID
          ============================= */

          .products-status {
            width: 100%;
            padding: 70px 20px;
            text-align: center;
            background: #fff;
            font-size: 10px;
            letter-spacing: 2px;
          }

          .products-error {
            color: #a33;
            border-bottom: 1px solid #f0dddd;
          }

          .luxury-product-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 2px;
            padding: 2px 7% 100px;
            width: 100%;
            background: #efede3;
          }


          .luxury-item-card {
            width: 100%;
            display: flex;
            flex-direction: column;
            background: #fff;
            min-width: 0;
          }


          .item-img-box {
            width: 100%;
            aspect-ratio: 1 / 1.05;
            overflow: hidden;
            background: #fff;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }


          .item-img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center center;
            padding: 0;
            display: block;

            transition:
              transform 0.8s
              cubic-bezier(
                0.165,
                0.84,
                0.44,
                1
              );
          }


          .luxury-item-card:hover img {
            transform: scale(1.06);
          }


          .image-error {
            font-size: 9px;

            letter-spacing: 1px;

            color: #999;

            text-align: center;
          }



          /* =============================
             3. SATIR KAMPANYA KARTI
          ============================= */

          .campaign-feature-card {
            grid-column: span 2;
            background: #fff;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .campaign-media {
            width: 100%;
            aspect-ratio: 2 / 1.05;
            overflow: hidden;
            background: #fff;
          }

          .campaign-media video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .campaign-copy {
            min-height: 118px;
            padding: 18px 28px 20px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 30px;
            background: #fff;
          }

          .campaign-kicker {
            display: block;
            margin-bottom: 8px;
            font-size: 7px;
            letter-spacing: 2px;
            opacity: 0.45;
          }

          .campaign-copy h2 {
            margin: 0 0 8px;
            font-family: serif;
            font-size: 20px;
            font-weight: 400;
            letter-spacing: 1.2px;
          }

          .campaign-copy p {
            margin: 0;
            max-width: 420px;
            font-size: 10px;
            line-height: 1.55;
            letter-spacing: 0.4px;
            opacity: 0.62;
          }

          .campaign-link {
            flex: 0 0 auto;
            padding: 13px 18px;
            border: 1px solid #111;
            text-decoration: none;
            font-size: 8px;
            letter-spacing: 1.4px;
            font-weight: 600;
            white-space: nowrap;
          }

          /* =============================
             FAVORİ
          ============================= */

          .wishlist-btn {
            position: absolute;

            top: 15px;

            right: 15px;

            z-index: 5;

            opacity: 0.4;

            transition: 0.3s;

            cursor: pointer;
          }


          .wishlist-btn:hover {
            opacity: 1;

            transform: scale(1.1);
          }


          /* =============================
             ÜRÜN DETAY
          ============================= */

          .item-details {
            padding: 16px 18px 20px;
            min-height: 158px;
            background: #fff;
            display: flex;
            flex-direction: column;
            flex: 1;
          }


          .item-details h3 {
            font-size: 10px;

            font-weight: 400;

            letter-spacing: 1.5px;

            margin-bottom: 12px;

            color: #000;

            text-transform: uppercase;

            min-height: 24px;
          }

          .item-description {
            margin: -3px 0 14px;
            color: #666;
            font-size: 10px;
            font-weight: 400;
            line-height: 1.55;
            letter-spacing: .25px;
            white-space: pre-line;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }


          .price-row {
            display: flex;

            justify-content:
              space-between;

            align-items: center;

            border-top:
              1px solid #f5f5f5;

            padding-top: 12px;

            margin-top: auto;
          }


          .price-text {
            font-size: 12px;

            font-weight: 600;

            color: #000;

            margin: 0;
          }


          /* =============================
             SEPET BUTONU
          ============================= */

          .inline-add-btn {
            background: transparent;

            border: none;

            display: flex;

            align-items: center;

            gap: 8px;

            cursor: pointer;

            color: #000;

            transition: 0.3s;

            position: relative;

            padding: 0;
          }


          .inline-add-btn span {
            font-size: 9px;

            font-weight: 700;

            letter-spacing: 1px;

            text-transform: uppercase;
          }


          .inline-add-btn::after {
            content: '';

            position: absolute;

            bottom: -2px;

            right: 0;

            width: 0;

            height: 1px;

            background: #000;

            transition:
              width 0.3s ease;
          }


          .inline-add-btn:hover::after {
            width: 100%;

            left: 0;
          }


          /* =============================
             SAĞ PANEL
          ============================= */

          .side-panel {
            position: fixed;

            top: 0;

            right: 0;

            width: 400px;

            height: 100%;

            background: #fff;

            display: flex;

            flex-direction: column;

            z-index: 9999;

            transform:
              translateX(100%);

            transition:
              0.5s
              cubic-bezier(
                0.19,
                1,
                0.22,
                1
              );

            box-shadow:
              -10px 0 30px
              rgba(0,0,0,0.05);
          }


          .side-panel.open {
            transform:
              translateX(0);
          }


          .active-sort {
            font-weight: 700;

            color: #000;
          }


          /* =============================
             OVERLAY
          ============================= */

          .overlay {
            position: fixed;

            inset: 0;

            background:
              rgba(0,0,0,0.2);

            opacity: 0;

            visibility: hidden;

            z-index: 9998;

            transition: 0.4s;
          }


          .overlay.visible {
            opacity: 1;

            visibility: visible;
          }


          /* =============================
             PANEL BAŞLIK
          ============================= */

          .panel-header {
            padding: 30px;

            display: flex;

            justify-content:
              space-between;

            align-items: center;

            border-bottom:
              1px solid #f2f2f2;
          }


          .panel-title {
            font-size: 14px;

            letter-spacing: 2px;

            font-weight: 700;

            text-transform: uppercase;
          }


          .panel-close-button {
            width: 32px;
            height: 32px;
            margin: -8px;
            padding: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 0;
            background: transparent;
            color: #000;
            cursor: pointer;
          }


          .filter-group {
            width: 100%;

            display: flex;

            justify-content:
              space-between;

            align-items: center;

            padding: 20px 0;

            border: 0;

            border-bottom: 1px solid #f0eee8;

            background: transparent;

            color: #111;

            cursor: pointer;

            font-family: inherit;

            font-size: 12px;

            letter-spacing: 1px;

            text-transform: uppercase;
          }


          .filter-group-heading {
            min-width: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            text-align: left;
          }


          .filter-group-heading small {
            max-width: 280px;
            overflow: hidden;
            color: #777;
            font-size: 9px;
            font-weight: 400;
            letter-spacing: .5px;
            text-overflow: ellipsis;
            text-transform: none;
            white-space: nowrap;
          }


          .filter-group-arrow {
            flex: 0 0 auto;
            display: inline-flex;
            transition: transform .2s ease;
          }


          .filter-accordion.open .filter-group-arrow {
            transform: rotate(180deg);
          }


          .filter-options {
            padding: 6px 0 17px;
            border-bottom: 1px solid #f0eee8;
          }


          .filter-option {
            position: relative;
            min-height: 38px;
            display: flex;
            align-items: center;
            gap: 11px;
            color: #333;
            cursor: pointer;
            font-size: 11px;
            line-height: 1.4;
            letter-spacing: .35px;
          }


          .filter-option input {
            position: absolute;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
          }


          .filter-option-mark {
            position: relative;
            width: 15px;
            height: 15px;
            flex: 0 0 15px;
            border: 1px solid #a9a69f;
            border-radius: 50%;
          }


          .filter-option input:checked + .filter-option-mark {
            border-color: #111;
          }


          .filter-option input:checked + .filter-option-mark::after {
            content: '';
            position: absolute;
            inset: 3px;
            border-radius: 50%;
            background: #111;
          }


          .filter-option input:focus-visible + .filter-option-mark {
            outline: 2px solid #777;
            outline-offset: 2px;
          }


          .panel-content {
            flex: 1;

            min-height: 0;

            padding: 20px 30px;

            overflow-y: auto;

            overscroll-behavior: contain;
          }


          .panel-footer {
            width: 100%;

            padding: 20px 30px 30px;

            background: #fff;

            border-top: 1px solid #eeeae2;

            display: grid;

            grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);

            gap: 10px;
          }


          .btn-apply {
            width: 100%;

            padding: 18px;

            background: #000;

            color: #fff !important;

            border: none;

            display: flex;

            align-items: center;

            justify-content: center;

            font-family: inherit;

            font-size: 11px;

            font-weight: 700;

            cursor: pointer;

            letter-spacing: 2px;

            text-transform: uppercase;
          }


          .btn-clear-filters {
            width: 100%;
            padding: 17px 12px;
            border: 1px solid #171715;
            background: #fff;
            color: #171715;
            cursor: pointer;
            font-family: inherit;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1.2px;
            text-transform: uppercase;
          }


          /* =============================
             TABLET
          ============================= */

          @media (max-width: 1100px) {

            .luxury-product-grid {
              grid-template-columns: repeat(4, minmax(0, 1fr));
              padding-left: 3%;
              padding-right: 3%;
            }


            .filter-bar-content {

              padding-left: 6%;

              padding-right: 6%;

            }

          }


          /* =============================
             TELEFON
          ============================= */

          @media (max-width: 768px) {

            .luxury-product-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 2px;
              padding: 2px 10px 70px;
            }

            .campaign-feature-card {
              grid-column: 1 / -1;
            }

            .campaign-media {
              aspect-ratio: 16 / 10;
            }

            .campaign-copy {
              min-height: auto;
              padding: 16px;
              align-items: flex-start;
              flex-direction: column;
              gap: 14px;
            }

            .campaign-copy h2 {
              font-size: 17px;
            }

            .campaign-link {
              width: 100%;
              text-align: center;
            }


            .filter-bar-content {

              padding:
                20px 18px;

            }


            .filter-actions {

              gap: 20px;

            }


            .side-panel {

              width: 100%;

            }


            .item-details h3 {

              font-size: 9px;

            }

            .item-description {
              font-size: 8.5px;
              line-height: 1.45;
              -webkit-line-clamp: 2;
            }


            .inline-add-btn span {

              display: none;

            }

          }


          /* =============================
             KÜÇÜK TELEFON
          ============================= */

          @media (max-width: 480px) {

            .luxury-product-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              padding-left: 6px;
              padding-right: 6px;
              gap: 2px;
            }


            .item-img-box {

              aspect-ratio: 3 / 4;

            }


            .price-text {

              font-size: 10px;

            }

          }

        `}</style>

      </div>

    </div>

  );
};

export default Jewellery;
