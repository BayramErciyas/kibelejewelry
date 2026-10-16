/* KİBELE — Vitrin etkileşimleri
 * Sayfa yapısı: templates/storefront.html
 * Görünüm ve mobil düzen: public/style.css
 * Ürün/fiyat düzenleme: /admin (ürünleri bu dosyaya yazmanız gerekmez)
 */
"use strict";
// 1. SEPET VE FAVORİLER: Sadece ziyaretçinin tarayıcısında saklanır.
function stored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
// SAYFA BAĞLAMI: Sunucu, kategori sayfasının varsayılanlarını body üzerinde belirtir.
const pageSettings = document.body?.dataset || {};
const pageKind = pageSettings.pageKind || "home";
const defaultCategory = pageSettings.defaultCategory || "All";
const defaultMaterial = pageSettings.defaultMaterial || "All";
const defaultSeries = pageSettings.defaultSeries || "";
const categoryLinks = {
  All: "all",
  Rings: "rings",
  Necklaces: "necklaces",
  Earrings: "earrings",
  Bracelets: "bracelets",
  Charms: "charms",
};
let catalogLoaded = false;
let products = [],
  cart = stored("aurel-cart", []),
  favorites = stored("aurel-favorites", []),
  category = defaultCategory,
  favoritesOnly = false,
  language = stored("kibele-language", "en");
if (!(window.KibeleLocale?.languages || { en: 1, tr: 1 })[language]) language = "en";
function t(source, turkishFallback) {
  return (
    window.KibeleLocale?.translate(source, language, turkishFallback) ||
    (language === "tr" && turkishFallback ? turkishFallback : source)
  );
}
const getElement = (s) => document.querySelector(s),
  formatPrice = (n) =>
    new Intl.NumberFormat(window.KibeleLocale?.languages[language]?.locale || t("en-IE", "tr-TR"), {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(n),
  escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
function saveVisitorState() {
  try {
    localStorage.setItem("aurel-cart", JSON.stringify(cart));
    localStorage.setItem("aurel-favorites", JSON.stringify(favorites));
  } catch {}
  updateCount();
}
function showToast(t) {
  getElement("#toast").textContent = t;
  getElement("#toast").classList.add("visible");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => getElement("#toast").classList.remove("visible"), 2600);
}
// 2. ÜRÜN LİSTESİ: Kategori, materyal, arama ve sıralama.
function renderProducts() {
  if (!getElement("#products")) return;
  syncFiltersToUrl();
  let list = products.filter(
    (p) =>
      (defaultSeries !== "cappadocia" ||
        ["cappadocia", "balloon", "turkish-eye"].includes(p.series)) &&
      (category === "All" || p.category === category) &&
      (getElement("#metal").value === "All" || p.material === getElement("#metal").value) &&
      (!favoritesOnly || favorites.includes(p.id)),
  );
  const q = getElement("#search").value.trim().toLocaleLowerCase();
  if (q)
    list = list.filter((p) =>
      [p.name, p.category, p.material, p.detail, p.stone].join(" ").toLocaleLowerCase().includes(q),
    );
  if (getElement("#sort").value !== "featured")
    list.sort((a, b) =>
      getElement("#sort").value === "low" ? a.price - b.price : b.price - a.price,
    );
  getElement("#tabs").innerHTML = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Charms"]
    .map(
      (c, i) => /* HTML */ `
        <a
          class="${category === c ? "active" : ""}"
          aria-current="${category === c ? "page" : "false"}"
          href="/collections/${categoryLinks[c]}"
        >
          ${t(c === "All" ? "All jewelry" : c)}
        </a>
      `,
    )
    .join("");
  getElement("#result-count").textContent =
    `${list.length} ${t("pieces")}${favoritesOnly ? " · " + t("Favorites") : ""}`;
  getElement("#products").innerHTML = list.length
    ? list
        .map(
          (p) => /* HTML */ `
            <article>
              <div class="product-image">
                <a href="#product-${p.id}" onclick="event.preventDefault();openProduct(${p.id})">
                  <img
                    src="${escapeHtml(p.image)}"
                    alt="${escapeHtml(p.name)}"
                    loading="lazy"
                    width="600"
                    height="750"
                  />
                </a>
                ${p.tag
                  ? /* HTML */ `
                      <span class="tag">${escapeHtml(p.tag)}</span>
                    `
                  : ""}
                <button
                  class="favorite ${favorites.includes(p.id) ? "saved" : ""}"
                  aria-label="${favorites.includes(p.id)
                    ? "Remove from"
                    : "Add to"} favorites: ${escapeHtml(p.name)}"
                  aria-pressed="${favorites.includes(p.id)}"
                  onclick="toggleFavorite(${p.id})"
                >
                  ${favorites.includes(p.id) ? "♥" : "♡"}
                </button>
                <button class="quick-add" onclick="openProduct(${p.id})">
                  ${t("DISCOVER PIECE +", "ÜRÜNÜ İNCELE +")}
                </button>
              </div>
              <div class="product-info">
                <span class="meta">${escapeHtml(p.stone || p.material)}</span>
                <h3 translate="no">
                  <a href="#product-${p.id}" onclick="event.preventDefault();openProduct(${p.id})">
                    ${escapeHtml(p.name)}
                  </a>
                </h3>
                ${p.stock === 0 ? '<span class="stock-status">Stokta yok / Sold out</span>' : ""}
                <div class="price-row">
                  <span>${formatPrice(p.price)}</span>
                  <span
                    class="swatch"
                    style="background:${p.material === "Silver"
                      ? "#c2c2bf"
                      : p.material === "Gemstone"
                        ? "#91a18d"
                        : "#be9d63"}"
                  ></span>
                </div>
              </div>
            </article>
          `,
        )
        .join("")
    : /* HTML */ `
        <div class="empty">
          ${t("No pieces match your selection.", "Bu seçime uygun ürün yok.")}
          <br />
          <button class="link-button" onclick="resetFilters()">
            ${t("Reset filters", "Filtreleri temizle")}
          </button>
        </div>
      `;
  window.KibeleLocale?.translateTree?.(getElement("#products"), language);
}
function filterCategory(c) {
  category = c;
  favoritesOnly = false;
  renderProducts();
  getElement("nav").classList.remove("open");
}
function filterMetal(m) {
  category = "All";
  favoritesOnly = false;
  getElement("#metal").value = m;
  renderProducts();
}
function resetFilters() {
  category = defaultCategory;
  favoritesOnly = false;
  getElement("#metal").value = defaultMaterial;
  getElement("#sort").value = "featured";
  getElement("#search").value = "";
  renderProducts();
}
function openSearch() {
  if (!getElement("#collection")) {
    window.location.assign("/collections/all?search=1");
    return;
  }
  getElement("#search-bar").hidden = false;
  getElement("#collection").scrollIntoView();
  getElement("#search").focus({ preventScroll: true });
}
function clearSearch() {
  getElement("#search").value = "";
  renderProducts();
}
function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
  saveVisitorState();
  renderProducts();
  showToast(favorites.includes(id) ? "Saved to your favorites" : "Removed from favorites");
}
function showFavorites() {
  if (!getElement("#collection")) {
    window.location.assign("/collections/all?favorites=1");
    return;
  }
  resetFilters();
  favoritesOnly = true;
  renderProducts();
  getElement("#collection").scrollIntoView();
}
// 3. ÜRÜN DETAYI VE GALERİ: Fotoğraflar, açıklama ve ölçü seçimi.
function openModal(label, content) {
  getElement("#modal-label").textContent = t(label);
  getElement("#modal-content").innerHTML = content;
  window.KibeleLocale?.translateTree?.(getElement("#modal-content"), language);
  if (!getElement("#dialog").open) getElement("#dialog").showModal();
}
function closeModal() {
  getElement("#dialog").close();
}
getElement("#dialog").addEventListener("click", (e) => {
  if (e.target === getElement("#dialog")) {
    let r = e.target.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      closeModal();
  }
});
function openProduct(id) {
  let p = products.find((x) => x.id === id);
  if (!p) return;
  openModal(
    "THE KİBELE COLLECTION",
    /* HTML */ `
      <div class="detail">
        <div class="detail-gallery">
          <img id="detail-main-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" />
          <div class="gallery-thumbs">
            ${(p.images || [p.image])
              .map(
                (url, i) => /* HTML */ `
                  <button
                    aria-label="Photo ${i + 1}"
                    onclick="document.querySelector('#detail-main-image').src=this.querySelector('img').src"
                  >
                    <img src="${escapeHtml(url)}" alt="${escapeHtml(p.name)} ${i + 1}" />
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
        <div>
          <span class="eyebrow">
            ${escapeHtml([p.material, p.stone].filter(Boolean).join(" · "))}
          </span>
          <h2 translate="no">${escapeHtml(p.name)}</h2>
          <div>${formatPrice(p.price)}</div>
          <p translate="no">${escapeHtml(p.description || p.detail)}</p>
          <label for="size">${t("Size", "Ölçü")}</label>
          <select id="size">
            ${(p.category === "Rings"
              ? ["EU 50", "EU 52", "EU 54", "EU 56", "EU 58"]
              : p.category === "Necklaces"
                ? ["40 cm", "45 cm", "50 cm"]
                : ["One size"]
            )
              .map(
                (s) => /* HTML */ `
                  <option>${s}</option>
                `,
              )
              .join("")}
          </select>
          <button class="button dark" onclick="addToCart(${id})" ${p.stock === 0 ? "disabled" : ""}>
            ${p.stock === 0
              ? t("Sold out", "Stokta yok")
              : t("Add to bag", "Sepete ekle") + " — " + formatPrice(p.price)}
          </button>
          <div class="notice">
            ${t(
              "Concept piece · Not available for real purchase.",
              "Konsept ürün · Gerçek satış yapılmaz.",
            )}
          </div>
          <details>
            <summary>Details & materials</summary>
            <p>
              ${escapeHtml(p.description || p.detail)}${p.stone ? " · " + escapeHtml(p.stone) : ""}
            </p>
          </details>
          <details>
            <summary>Care & keeping</summary>
            <p>
              Store pieces separately. Clean gently with a soft cloth and avoid harsh chemicals.
              Specific care depends on the metal and stone.
            </p>
          </details>
        </div>
      </div>
    `,
  );
}
// 4. ALIŞVERİŞ SEPETİ: Adet ve mevcut stok denetimleri.
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const qty = cart.filter((x) => x.id === id).reduce((a, x) => a + x.qty, 0);
  if (!product || product.stock === 0 || qty >= product.stock) {
    showToast(t("Not enough stock.", "Yeterli stok yok."));
    return;
  }
  const size = getElement("#size").value;
  const row = cart.find((x) => x.id === id && x.size === size);
  if (row) row.qty++;
  else cart.push({ id, size, qty: 1 });
  saveVisitorState();
  openCart();
  showToast(t("Added to your bag", "Sepetine eklendi"));
}
function updateCount() {
  getElement("#count").textContent = cart.reduce((a, x) => a + x.qty, 0);
}
function total() {
  return cart.reduce((a, x) => a + (products.find((p) => p.id === x.id)?.price || 0) * x.qty, 0);
}
function changeQty(i, n) {
  if (n > 0) {
    const p = products.find((p) => p.id === cart[i].id);
    const count = cart.filter((x) => x.id === cart[i].id).reduce((a, x) => a + x.qty, 0);
    if (!p || count >= p.stock) {
      showToast("Not enough stock / Yeterli stok yok");
      return;
    }
  }
  cart[i].qty += n;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveVisitorState();
  openCart();
}
function reconcileCart() {
  const used = {};
  cart = cart.filter((x) => {
    const p = products.find((p) => p.id === x.id);
    if (!p || p.stock <= 0) return false;
    const remaining = p.stock - (used[p.id] || 0);
    x.qty = Math.min(x.qty, remaining);
    used[p.id] = (used[p.id] || 0) + x.qty;
    return x.qty > 0;
  });
  saveVisitorState();
}
function openCart() {
  if (!catalogLoaded) {
    showToast("Koleksiyon yükleniyor. Lütfen tekrar deneyin.");
    return;
  }
  reconcileCart();
  openModal(
    t("YOUR BAG", "ALIŞVERİŞ SEPETİN"),
    /* HTML */ `
      <h2 class="cart-title">${t("A beautiful selection.", "Güzel seçimler.")}</h2>
      ${cart.length
        ? cart
            .map((x, i) => {
              let p = products.find((p) => p.id === x.id);
              return /* HTML */ `
                <div class="cart-row">
                  <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" />
                  <div>
                    <h3 translate="no">${escapeHtml(p.name)}</h3>
                    <p>${escapeHtml(x.size)}</p>
                    <div class="qty">
                      <button aria-label="Decrease quantity" onclick="changeQty(${i},-1)">−</button>
                      <span>${x.qty}</span>
                      <button aria-label="Increase quantity" onclick="changeQty(${i},1)">+</button>
                      <button
                        aria-label="Remove item"
                        onclick="cart.splice(${i},1);saveVisitorState();openCart()"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <span>${formatPrice(p.price * x.qty)}</span>
                </div>
              `;
            })
            .join("") +
          /* HTML */ `
            <div class="cart-total">
              <span>${t("Subtotal", "Ara toplam")}</span>
              <span>${formatPrice(total())}</span>
            </div>
            <p class="small">Shipping and taxes are not calculated in this preview.</p>
            <div class="notice">
              ${t(
                "Preview store. This flow does not collect payments or create orders.",
                "Deneme mağazası. Bu akış ödeme almaz veya sipariş oluşturmaz.",
              )}
            </div>
            <button class="button dark" onclick="checkout()">
              ${t("Preview checkout ↗", "Teslimat adımını dene ↗")}
            </button>
          `
        : /* HTML */ `
            <div class="empty">
              ${t("Your bag is waiting for something special.", "Sepetin henüz boş.")}
              <br />
              <br />
              <button
                class="button dark"
                onclick="closeModal();window.location.assign('/collections/all')"
              >
                ${t("Explore the collection", "Koleksiyonu keşfet")}
              </button>
            </div>
          `}
    `,
  );
}
// 5. TESLİMAT ÖNİZLEMESİ: Gerçek ödeme veya sipariş oluşturmaz.
function checkout() {
  openModal(
    "CHECKOUT PREVIEW · 1 / 2",
    /* HTML */ `
      <h2 class="cart-title">Delivery details</h2>
      <div class="notice">
        Demo only. Use fictional details. Nothing entered here is sent or saved.
      </div>
      <form id="delivery-form" onsubmit="event.preventDefault();reviewCheckout()">
        <div class="form-grid">
          <label>
            First name
            <input name="first" autocomplete="off" required maxlength="60" />
          </label>
          <label>
            Last name
            <input name="last" autocomplete="off" required maxlength="60" />
          </label>
          <label class="full">
            Email
            <input name="email" type="email" autocomplete="off" required />
          </label>
          <label class="full">
            Address
            <input name="address" autocomplete="off" required />
          </label>
          <label>
            City
            <input name="city" autocomplete="off" required />
          </label>
          <label>
            Country
            <select name="country" required>
              <option value="">Choose a country</option>
              <option>Türkiye</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Germany</option>
              <option>France</option>
              <option>China</option>
              <option>Spain</option>
              <option>Other destination</option>
            </select>
          </label>
          <label>
            Postal code
            <input name="postal" autocomplete="off" required />
          </label>
        </div>
        <br />
        <button class="button dark" type="submit">Review demo selection ↗</button>
        <button type="button" class="link-button" onclick="openCart()">Back to bag</button>
      </form>
    `,
  );
}
function reviewCheckout() {
  const data = new FormData(getElement("#delivery-form"));
  openModal(
    "CHECKOUT PREVIEW · 2 / 2",
    /* HTML */ `
      <h2 class="cart-title">Everything, in one place.</h2>
      <p>
        Delivery preview for ${escapeHtml(data.get("first"))} · ${escapeHtml(data.get("city"))},
        ${escapeHtml(data.get("country"))}
      </p>
      <div class="cart-total">
        <span>Product subtotal</span>
        <span>${formatPrice(total())}</span>
      </div>
      <div class="notice">
        Shipping, duties and taxes require live store configuration. Payment is not connected. No
        card information is requested, no order has been placed and your bag remains saved.
      </div>
      <button
        class="button dark"
        onclick="closeModal();showToast('Preview complete — no order or payment was created.')"
      >
        Finish preview
      </button>
      <button class="link-button" onclick="openCart()">Back to bag</button>
    `,
  );
}
// 6. BİLGİ PENCERELERİ VE DİL: Görünen metinler burada düzenlenebilir.
function openStory() {
  openModal(
    "OUR PERSPECTIVE",
    /* HTML */ `
      <h2 class="cart-title">Objects of lasting beauty.</h2>
      <p style="font-size:15px;line-height:2;max-width:650px">
        This KİBELE concept explores a refined jewelry shopping experience. Its visual language
        brings together sculptural forms, natural light and quiet typography. This edition explores
        how gold, silver and gemstone collections can be presented with clarity and warmth.
      </p>
      <div class="notice">
        The name, photography, copy and catalog are placeholders. The final store can be adapted to
        your own brand and verified product information.
      </div>
    `,
  );
}
function info(type) {
  const texts = {
    care: [
      "Jewelry care",
      "Keep jewelry in separate soft pouches. Use a soft, lint-free cloth. Avoid harsh chemicals. Gemstones and plated pieces require care specific to their materials.",
    ],
    sizing: [
      "Find your fit",
      "Ring sizes in this demo use EU circumference: 50, 52, 54, 56 and 58 mm. Have a jeweler measure your finger for a reliable fit. Necklace options show chain lengths in centimeters.",
    ],
    shipping: [
      "Shipping & returns",
      "This is a design preview and does not ship products. Shipping destinations, delivery times, duties and return terms must be configured and published before the real store launches.",
    ],
  };
  openModal(
    "A LITTLE GUIDANCE",
    /* HTML */ `
      <h2 class="cart-title">${texts[type][0]}</h2>
      <p style="line-height:2">${texts[type][1]}</p>
    `,
  );
}
function applyLanguage() {
  document.documentElement.lang = language;
  document
    .querySelectorAll("[data-en]")
    .forEach((element) => (element.innerHTML = t(element.dataset.en, element.dataset.tr)));
  const title = getElement("#page-title");
  if (title) document.title = title.textContent + " — KİBELE";
  window.KibeleLocale?.translateTree?.(document, language);
  const search = getElement("#search");
  if (search) search.placeholder = t("Search the collection");
  window.renderFooterLanguages?.();
}
function setLanguage(code) {
  if (!(window.KibeleLocale?.languages || { en: 1, tr: 1 })[code]) return;
  language = code;
  try {
    localStorage.setItem("kibele-language", JSON.stringify(language));
  } catch {}
  applyLanguage();
  renderProducts();
}
function toggleLanguage() {
  setLanguage(language === "en" ? "tr" : "en");
}
// Yönetim paneli ayrı bir sayfada açılır.
function openAdmin() {
  window.location.assign("/admin");
}
if (getElement("#products"))
  getElement("#products").innerHTML =
    '<p class="empty">Koleksiyon yükleniyor / Loading collection…</p>';
updateCount();

// One passive scroll listener, coalesced to one update per animation frame.
// 7. MENÜ VE KAYDIRMA: Açılış başlığını küçülten animasyon.
function toggleMenu(force) {
  const nav = getElement("#main-nav");
  const open = typeof force === "boolean" ? force : !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  nav.inert = !open;
  getElement(".campaign-menu").setAttribute("aria-expanded", String(open));
  getElement(".campaign-header").classList.toggle("menu-open", open);
}
getElement("#main-nav").addEventListener("click", (event) => {
  if (event.target.closest("a")) toggleMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleMenu(false);
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest("header")) toggleMenu(false);
});
let campaignFrame = 0;
function updateCampaignHeader() {
  const y = Math.max(0, window.scrollY || 0),
    progress = Math.min(1, y / 180);
  document.documentElement.style.setProperty("--header-progress", String(progress));
  getElement(".campaign-header").classList.toggle("is-compact", progress > 0.48);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.style.setProperty(
    "--hero-shift",
    reduce ? "0px" : Math.min(y * 0.1, window.innerHeight * 0.04) + "px",
  );
  campaignFrame = 0;
}
window.addEventListener(
  "scroll",
  () => {
    if (!campaignFrame) campaignFrame = requestAnimationFrame(updateCampaignHeader);
  },
  { passive: true },
);
window.addEventListener("pageshow", updateCampaignHeader);
updateCampaignHeader();

// 8. CANLI KATALOG: Ürünleri /api/catalog üzerinden sunucudan alır.
let catalogLoading = false;
async function refreshCatalog() {
  if (catalogLoading) return;
  catalogLoading = true;
  try {
    const response = await fetch("/api/catalog", { cache: "no-store" });
    if (!response.ok) throw new Error("Catalog unavailable");
    const data = await response.json();
    products = data.products.map((product) => ({
      ...product,
      image: absoluteAssetUrl(product.image),
      images: (product.images || [product.image]).map(absoluteAssetUrl),
    }));
    catalogLoaded = true;
    reconcileCart();
    const hero = document.querySelector(".hero-image>img");
    if (hero && pageKind === "home")
      hero.src = absoluteAssetUrl(data.settings.heroImage || "/assets/hero.jpg");
    renderProducts();
    updateCount();
  } catch (error) {
    if (!products.length && getElement("#products"))
      getElement("#products").innerHTML =
        '<div class="empty">Koleksiyon yüklenemedi. / Collection unavailable.<br><button class="link-button" onclick="refreshCatalog()">Tekrar dene / Retry</button></div>';
  } finally {
    catalogLoading = false;
  }
}
try {
  const updates = new BroadcastChannel("kibele-catalog");
  updates.onmessage = () => refreshCatalog();
} catch {}
window.addEventListener("storage", (event) => {
  if (event.key === "kibele-catalog-updated") refreshCatalog();
});
window.addEventListener("focus", refreshCatalog);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refreshCatalog();
});
setInterval(() => {
  if (!document.hidden) refreshCatalog();
}, 60000);
refreshCatalog();

// 9. SAYFA / URL DURUMU: Filtreler adres çubuğunda tutulur; geri tuşu doğal çalışır.
function absoluteAssetUrl(url) {
  return typeof url === "string" && url.startsWith("assets/") ? "/" + url : url;
}
function syncFiltersToUrl() {
  if (!window.history?.replaceState || !getElement("#metal")) return;
  const url = new URL(window.location.href);
  const values = {
    material: getElement("#metal").value === defaultMaterial ? "" : getElement("#metal").value,
    sort: getElement("#sort").value === "featured" ? "" : getElement("#sort").value,
    q: getElement("#search").value.trim(),
    favorites: favoritesOnly ? "1" : "",
  };
  for (const [name, value] of Object.entries(values))
    value ? url.searchParams.set(name, value) : url.searchParams.delete(name);
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}
function initializePageFilters() {
  const material = getElement("#metal");
  if (!material) {
    applyLanguage();
    return;
  }
  const params = new URLSearchParams(window.location.search || "");
  const chosenMaterial = params.get("material");
  material.value =
    defaultMaterial !== "All"
      ? defaultMaterial
      : ["All", "Gold", "Silver", "Gemstone"].includes(chosenMaterial)
        ? chosenMaterial
        : "All";
  material.disabled = defaultMaterial !== "All";
  if (["low", "high"].includes(params.get("sort"))) getElement("#sort").value = params.get("sort");
  getElement("#search").value = params.get("q") || "";
  favoritesOnly = params.get("favorites") === "1";
  if (params.has("search") || params.has("q")) getElement("#search-bar").hidden = false;
  applyLanguage();
}
initializePageFilters();
