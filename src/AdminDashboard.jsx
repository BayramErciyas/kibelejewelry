import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

const STONE_OPTIONS = [
  { value: "aquamarine", label: "Akuamarin Taşı" },
  { value: "zultanite", label: "Diaspor (Zultanite)" },
  { value: "diamond", label: "Elmas" },
  { value: "opal", label: "Opal" },
  { value: "sapphire", label: "Safir" },
  { value: "citrine", label: "Sitrin" },
  { value: "tanzanite", label: "Tanzanit" },
  { value: "topaz", label: "Topaz" },
  { value: "tourmaline", label: "Turmalin" },
  { value: "ruby", label: "Yakut" },
  { value: "zircon", label: "Zirkon" },
  { value: "emerald", label: "Zümrüt" },
  { value: "paraiba", label: "Turmalin Paraiba" },
  { value: "moissanite", label: "Mozanit" },
  { value: "pink-quartz", label: "Pink Quartz" },
];

const STONE_LABELS = Object.fromEntries(
  STONE_OPTIONS.map(({ value, label }) => [value, label])
);

const SERIES_OPTIONS = [
  { value: "", label: "Seri yok / Genel Takılar" },
  { value: "balloon", label: "Kapadokya — Balon" },
  { value: "nazar", label: "Kapadokya — Nazar" },
];

const SERIES_LABELS = Object.fromEntries(
  SERIES_OPTIONS.map(({ value, label }) => [value, label])
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productNameEn, setProductNameEn] = useState("");
  const [productDescriptionEn, setProductDescriptionEn] = useState("");
  const [productNameEs, setProductNameEs] = useState("");
  const [productDescriptionEs, setProductDescriptionEs] = useState("");
  const [productNameZh, setProductNameZh] = useState("");
  const [productDescriptionZh, setProductDescriptionZh] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("rings");
  const [stone, setStone] = useState("zultanite");
  const [series, setSeries] = useState("");
  const [metal, setMetal] = useState("silver");
  const [inStock, setInStock] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");

  const [activeSection, setActiveSection] = useState("new");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin");
        return;
      }

      const { data: adminMembership, error: adminCheckError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (adminCheckError || !adminMembership) {
        console.error("Admin yetkisi doğrulanamadı:", adminCheckError);
        navigate("/account", { replace: true });
        return;
      }

      setSession(session);
      setLoadingSession(false);
    };

    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!imageFile) {
      setMessage("Lütfen bir ürün fotoğrafı seçin.");
      return;
    }

    try {
      setPublishing(true);

      const fileExtension =
        imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase
        .from("products")
        .insert({
          name: productName,
          description: productDescription.trim() || null,
          name_en: productNameEn.trim() || null,
          description_en: productDescriptionEn.trim() || null,
          name_es: productNameEs.trim() || null,
          description_es: productDescriptionEs.trim() || null,
          name_zh: productNameZh.trim() || null,
          description_zh: productDescriptionZh.trim() || null,
          price: Number(price),
          category,
          stone,
          series: series || null,
          metal,
          in_stock: inStock,
          image_url: imageUrl,
          image_path: filePath,
        });

      if (insertError) {
        await supabase.storage
          .from("product-images")
          .remove([filePath]);

        throw insertError;
      }

      setMessage("Ürün başarıyla yayınlandı.");

      setProductName("");
      setProductDescription("");
      setProductNameEn("");
      setProductDescriptionEn("");
      setProductNameEs("");
      setProductDescriptionEs("");
      setProductNameZh("");
      setProductDescriptionZh("");
      setPrice("");
      setCategory("rings");
      setStone("zultanite");
      setSeries("");
      setMetal("silver");
      setInStock(true);
      setImageFile(null);

      if (activeSection === "products" || activeSection === "stock") {
        await loadProducts();
      }

    } catch (error) {
      console.error("Ürün yayınlama hatası:", error);

      setMessage(
        error?.message ||
        "Ürün yayınlanırken bir hata oluştu."
      );
    } finally {
      setPublishing(false);
    }
  };


  const loadProducts = async () => {
    setProductsLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ürün listeleme hatası:", error);
      setMessage(error.message || "Ürünler yüklenemedi.");
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setProductsLoading(false);
  };

  const openSection = async (section) => {
    setActiveSection(section);
    setMessage("");
    setEditingProduct(null);
    setEditImageFile(null);

    if (section === "products" || section === "stock") {
      await loadProducts();
    }
  };

  const handleToggleStock = async (product) => {
    const { error } = await supabase
      .from("products")
      .update({ in_stock: !product.in_stock })
      .eq("id", product.id);

    if (error) {
      setMessage(error.message || "Stok durumu değiştirilemedi.");
      return;
    }

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, in_stock: !item.in_stock }
          : item
      )
    );
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `"${product.name}" ürününü kalıcı olarak silmek istediğinize emin misiniz?`
    );

    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (deleteError) {
      setMessage(deleteError.message || "Ürün silinemedi.");
      return;
    }

    if (product.image_path) {
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove([product.image_path]);

      if (storageError) {
        console.warn("Eski ürün fotoğrafı silinemedi:", storageError);
      }
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    );

    setMessage("Ürün başarıyla silindi.");
  };

  const startEditing = (product) => {
    setEditingProduct({ ...product });
    setEditImageFile(null);
    setMessage("");
  };

  const handleEditChange = (field, value) => {
    setEditingProduct((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    setSavingEdit(true);
    setMessage("");

    let newImagePath = editingProduct.image_path;
    let newImageUrl = editingProduct.image_url;
    let uploadedNewImage = false;

    try {
      if (editImageFile) {
        const fileExtension =
          editImageFile.name.split(".").pop()?.toLowerCase() || "jpg";

        newImagePath =
          `products/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(newImagePath, editImageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        uploadedNewImage = true;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(newImagePath);

        newImageUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          description: editingProduct.description?.trim() || null,
          name_en: editingProduct.name_en?.trim() || null,
          description_en: editingProduct.description_en?.trim() || null,
          name_es: editingProduct.name_es?.trim() || null,
          description_es: editingProduct.description_es?.trim() || null,
          name_zh: editingProduct.name_zh?.trim() || null,
          description_zh: editingProduct.description_zh?.trim() || null,
          price: Number(editingProduct.price),
          category: editingProduct.category,
          stone: editingProduct.stone,
          series: editingProduct.series || null,
          metal: editingProduct.metal,
          in_stock: Boolean(editingProduct.in_stock),
          image_url: newImageUrl,
          image_path: newImagePath,
        })
        .eq("id", editingProduct.id);

      if (updateError) {
        if (uploadedNewImage) {
          await supabase.storage
            .from("product-images")
            .remove([newImagePath]);
        }
        throw updateError;
      }

      if (
        uploadedNewImage &&
        editingProduct.image_path &&
        editingProduct.image_path !== newImagePath
      ) {
        await supabase.storage
          .from("product-images")
          .remove([editingProduct.image_path]);
      }

      setEditingProduct(null);
      setEditImageFile(null);
      setMessage("Ürün başarıyla güncellendi.");
      await loadProducts();
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error);
      setMessage(error?.message || "Ürün güncellenirken hata oluştu.");
    } finally {
      setSavingEdit(false);
    }
  };

  if (loadingSession) {
    return <div style={{ padding: 40 }}>Yükleniyor...</div>;
  }

  const visibleProducts =
    activeSection === "stock"
      ? products.filter((product) => product.in_stock)
      : products;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo-small">KIBELE</div>
          <div className="admin-logo-main">JEWELRY</div>
          <div className="admin-logo-location">CAPPADOCIA</div>

          <nav className="admin-nav">
            <button
              className={activeSection === "new" ? "active" : ""}
              onClick={() => openSection("new")}
            >
              Yeni Ürün
            </button>

            <button
              className={activeSection === "products" ? "active" : ""}
              onClick={() => openSection("products")}
            >
              Ürünler
            </button>

            <button
              className={activeSection === "stock" ? "active" : ""}
              onClick={() => openSection("stock")}
            >
              Stok
            </button>

            <button
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => openSection("settings")}
            >
              Ayarlar
            </button>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          ÇIKIŞ YAP
        </button>
      </aside>

      <main className="admin-content">
        <div className="admin-topbar">
          <div>
            <span className="admin-kicker">KIBELE MANAGEMENT</span>
            <h1>
              {activeSection === "new" && "Yeni Ürün Ekle"}
              {activeSection === "products" && "Ürün Yönetimi"}
              {activeSection === "stock" && "Stok Yönetimi"}
              {activeSection === "settings" && "Ayarlar"}
            </h1>
          </div>

          <div className="admin-user">
            {session?.user?.email}
          </div>
        </div>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        {activeSection === "new" && (
          <form className="product-form" onSubmit={handleSubmit}>
            <section className="form-card">
              <h2>Ürün Bilgileri</h2>

              <div className="form-grid">
                <div className="form-field full">
                  <label>ÜRÜN ADI — TÜRKÇE</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Örn: Natural Zultanite Ring"
                    required
                  />
                </div>

                <div className="form-field full">
                  <label>ÜRÜN AÇIKLAMASI — TÜRKÇE</label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Örn: El yapımı Markazit Yüzük."
                    rows={4}
                    maxLength={500}
                  />
                  <span className="field-counter">
                    {productDescription.length}/500
                  </span>
                </div>

                <div className="language-divider full">
                  İNGİLİZCE İÇERİK
                </div>

                <div className="form-field full">
                  <label>PRODUCT NAME — ENGLISH</label>
                  <input
                    type="text"
                    value={productNameEn}
                    onChange={(e) => setProductNameEn(e.target.value)}
                    placeholder="Example: Handmade Zultanite Ring"
                  />
                </div>

                <div className="form-field full">
                  <label>PRODUCT DESCRIPTION — ENGLISH</label>
                  <textarea
                    value={productDescriptionEn}
                    onChange={(e) => setProductDescriptionEn(e.target.value)}
                    placeholder="Example: Handmade marcasite ring."
                    rows={4}
                    maxLength={500}
                  />
                  <span className="field-counter">
                    {productDescriptionEn.length}/500
                  </span>
                </div>

                <div className="language-divider full">
                  İSPANYOLCA İÇERİK
                </div>

                <div className="form-field full">
                  <label>NOMBRE DEL PRODUCTO — ESPAÑOL</label>
                  <input
                    type="text"
                    value={productNameEs}
                    onChange={(e) => setProductNameEs(e.target.value)}
                    placeholder="Ejemplo: Anillo de Zultanita hecho a mano"
                  />
                </div>

                <div className="form-field full">
                  <label>DESCRIPCIÓN DEL PRODUCTO — ESPAÑOL</label>
                  <textarea
                    value={productDescriptionEs}
                    onChange={(e) => setProductDescriptionEs(e.target.value)}
                    placeholder="Ejemplo: Anillo de marcasita hecho a mano."
                    rows={4}
                    maxLength={500}
                  />
                  <span className="field-counter">
                    {productDescriptionEs.length}/500
                  </span>
                </div>

                <div className="language-divider full">
                  ÇİNCE İÇERİK
                </div>

                <div className="form-field full">
                  <label>产品名称 — 中文</label>
                  <input
                    type="text"
                    value={productNameZh}
                    onChange={(e) => setProductNameZh(e.target.value)}
                    placeholder="例如：手工苏丹石戒指"
                  />
                </div>

                <div className="form-field full">
                  <label>产品描述 — 中文</label>
                  <textarea
                    value={productDescriptionZh}
                    onChange={(e) => setProductDescriptionZh(e.target.value)}
                    placeholder="例如：手工制作的马克赛特戒指。"
                    rows={4}
                    maxLength={500}
                  />
                  <span className="field-counter">
                    {productDescriptionZh.length}/500
                  </span>
                </div>

                <div className="form-field">
                  <label>FİYAT</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>KATEGORİ</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="rings">Yüzükler</option>
                    <option value="necklaces">Kolyeler</option>
                    <option value="earrings">Küpeler</option>
                    <option value="bracelets">Bileklikler</option>
                    <option value="charms">Charmlar</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>TAŞ</label>
                  <select
                    value={stone}
                    onChange={(e) => setStone(e.target.value)}
                  >
                    {STONE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>SERİ</label>
                  <select
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                  >
                    {SERIES_OPTIONS.map((option) => (
                      <option key={option.value || "general"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>METAL</label>
                  <select
                    value={metal}
                    onChange={(e) => setMetal(e.target.value)}
                  >
                    <option value="silver">925 Gümüş</option>
                    <option value="gold">14K Altın</option>
                    <option value="white-gold">Beyaz Altın</option>
                  </select>
                </div>

                <div className="form-field full">
                  <label>ÜRÜN FOTOĞRAFI</label>

                  <label className="upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />

                    {imageFile ? (
                      <span>{imageFile.name}</span>
                    ) : (
                      <>
                        <strong>Fotoğraf yükle</strong>
                        <span>JPG, PNG veya WEBP</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="form-field full">
                  <label className="stock-toggle">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                    />
                    <span>Ürün stokta</span>
                  </label>
                </div>
              </div>
            </section>

            <button
              className="publish-btn"
              type="submit"
              disabled={publishing}
            >
              {publishing ? "YAYINLANIYOR..." : "ÜRÜNÜ YAYINLA"}
            </button>
          </form>
        )}

        {(activeSection === "products" || activeSection === "stock") && (
          <section>
            <div className="management-toolbar">
              <div>
                <strong>
                  {productsLoading
                    ? "Ürünler yükleniyor..."
                    : `${visibleProducts.length} ürün`}
                </strong>
                <span>
                  {activeSection === "stock"
                    ? "Şu anda satışta olan ürünler"
                    : "Tüm ürünleri buradan yönetin"}
                </span>
              </div>

              <button onClick={loadProducts} disabled={productsLoading}>
                YENİLE
              </button>
            </div>

            {!productsLoading && visibleProducts.length === 0 && (
              <div className="empty-products">
                Henüz gösterilecek ürün bulunmuyor.
              </div>
            )}

            <div className="admin-products-grid">
              {visibleProducts.map((product) => (
                <article className="admin-product-card" key={product.id}>
                  <div className="admin-product-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <span>FOTOĞRAF YOK</span>
                    )}

                    <div
                      className={`stock-badge ${
                        product.in_stock ? "is-in-stock" : "is-out-stock"
                      }`}
                    >
                      {product.in_stock ? "STOKTA" : "STOK DIŞI"}
                    </div>
                  </div>

                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <div className="admin-product-price">
                      {Number(product.price || 0).toLocaleString("tr-TR")} TL
                    </div>

                    <div className="product-meta">
                      <span>{product.category || "-"}</span>
                      <span>{STONE_LABELS[product.stone] || product.stone || "-"}</span>
                      <span>{SERIES_LABELS[product.series || ""] || product.series || "Genel"}</span>
                      <span>{product.metal || "-"}</span>
                    </div>

                    <div className="product-actions">
                      <button onClick={() => startEditing(product)}>
                        DÜZENLE
                      </button>

                      <button onClick={() => handleToggleStock(product)}>
                        {product.in_stock
                          ? "STOKTAN KALDIR"
                          : "STOĞA AL"}
                      </button>

                      <button
                        className="danger-action"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        SİL
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === "settings" && (
          <section className="form-card">
            <h2>Ayarlar</h2>
            <p className="settings-note">
              Mağaza ayarlarını sonraki aşamada buradan yöneteceğiz.
            </p>
          </section>
        )}

        {editingProduct && (
          <div className="edit-overlay" onClick={() => setEditingProduct(null)}>
            <form
              className="edit-modal"
              onSubmit={handleSaveEdit}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="edit-modal-header">
                <div>
                  <span className="admin-kicker">ÜRÜN DÜZENLE</span>
                  <h2>{editingProduct.name}</h2>
                </div>

                <button
                  type="button"
                  className="close-edit"
                  onClick={() => setEditingProduct(null)}
                >
                  ×
                </button>
              </div>

              <div className="form-grid">
                <div className="form-field full">
                  <label>ÜRÜN ADI — TÜRKÇE</label>
                  <input
                    value={editingProduct.name || ""}
                    onChange={(e) =>
                      handleEditChange("name", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-field full">
                  <label>ÜRÜN AÇIKLAMASI — TÜRKÇE</label>
                  <textarea
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      handleEditChange("description", e.target.value)
                    }
                    placeholder="Örn: El yapımı Markazit Yüzük."
                    rows={4}
                    maxLength={500}
                  />
                  <span className="field-counter">
                    {(editingProduct.description || "").length}/500
                  </span>
                </div>

                <div className="language-divider full">
                  İNGİLİZCE İÇERİK
                </div>

                <div className="form-field full">
                  <label>PRODUCT NAME — ENGLISH</label>
                  <input
                    value={editingProduct.name_en || ""}
                    onChange={(e) =>
                      handleEditChange("name_en", e.target.value)
                    }
                    placeholder="Example: Handmade Zultanite Ring"
                  />
                </div>

                <div className="form-field full">
                  <label>PRODUCT DESCRIPTION — ENGLISH</label>
                  <textarea
                    value={editingProduct.description_en || ""}
                    onChange={(e) =>
                      handleEditChange("description_en", e.target.value)
                    }
                    placeholder="Example: Handmade marcasite ring."
                    rows={4}
                    maxLength={500}
                  />
                  <span className="field-counter">
                    {(editingProduct.description_en || "").length}/500
                  </span>
                </div>

                <div className="language-divider full">
                  İSPANYOLCA İÇERİK
                </div>

                <div className="form-field full">
                  <label>NOMBRE DEL PRODUCTO — ESPAÑOL</label>
                  <input
                    value={editingProduct.name_es || ""}
                    onChange={(e) =>
                      handleEditChange("name_es", e.target.value)
                    }
                    placeholder="Ejemplo: Anillo de Zultanita hecho a mano"
                  />
                </div>

                <div className="form-field full">
                  <label>DESCRIPCIÓN DEL PRODUCTO — ESPAÑOL</label>
                  <textarea
                    value={editingProduct.description_es || ""}
                    onChange={(e) =>
                      handleEditChange("description_es", e.target.value)
                    }
                    placeholder="Ejemplo: Anillo de marcasita hecho a mano."
                    rows={4}
                    maxLength={500}
                  />
                  <span className="field-counter">
                    {(editingProduct.description_es || "").length}/500
                  </span>
                </div>

                <div className="language-divider full">
                  ÇİNCE İÇERİK
                </div>

                <div className="form-field full">
                  <label>产品名称 — 中文</label>
                  <input
                    value={editingProduct.name_zh || ""}
                    onChange={(e) =>
                      handleEditChange("name_zh", e.target.value)
                    }
                    placeholder="例如：手工苏丹石戒指"
                  />
                </div>

                <div className="form-field full">
                  <label>产品描述 — 中文</label>
                  <textarea
                    value={editingProduct.description_zh || ""}
                    onChange={(e) =>
                      handleEditChange("description_zh", e.target.value)
                    }
                    placeholder="例如：手工制作的马克赛特戒指。"
                    rows={4}
                    maxLength={500}
                  />
                  <span className="field-counter">
                    {(editingProduct.description_zh || "").length}/500
                  </span>
                </div>

                <div className="form-field">
                  <label>FİYAT</label>
                  <input
                    type="number"
                    value={editingProduct.price ?? ""}
                    onChange={(e) =>
                      handleEditChange("price", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>KATEGORİ</label>
                  <select
                    value={editingProduct.category || "rings"}
                    onChange={(e) =>
                      handleEditChange("category", e.target.value)
                    }
                  >
                    <option value="rings">Yüzükler</option>
                    <option value="necklaces">Kolyeler</option>
                    <option value="earrings">Küpeler</option>
                    <option value="bracelets">Bileklikler</option>
                    <option value="charms">Charmlar</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>TAŞ</label>
                  <select
                    value={editingProduct.stone || "zultanite"}
                    onChange={(e) =>
                      handleEditChange("stone", e.target.value)
                    }
                  >
                    {STONE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>SERİ</label>
                  <select
                    value={editingProduct.series || ""}
                    onChange={(e) =>
                      handleEditChange("series", e.target.value)
                    }
                  >
                    {SERIES_OPTIONS.map((option) => (
                      <option key={option.value || "general"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>METAL</label>
                  <select
                    value={editingProduct.metal || "silver"}
                    onChange={(e) =>
                      handleEditChange("metal", e.target.value)
                    }
                  >
                    <option value="silver">925 Gümüş</option>
                    <option value="gold">14K Altın</option>
                    <option value="white-gold">Beyaz Altın</option>
                  </select>
                </div>

                <div className="form-field full">
                  <label>YENİ FOTOĞRAF — İSTEĞE BAĞLI</label>

                  {editingProduct.image_url && (
                    <img
                      className="current-edit-image"
                      src={editingProduct.image_url}
                      alt={editingProduct.name}
                    />
                  )}

                  <label className="upload-box edit-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditImageFile(e.target.files?.[0] || null)
                      }
                    />

                    <strong>
                      {editImageFile
                        ? editImageFile.name
                        : "Fotoğrafı değiştirmek için seç"}
                    </strong>
                  </label>
                </div>

                <div className="form-field full">
                  <label className="stock-toggle">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.in_stock)}
                      onChange={(e) =>
                        handleEditChange("in_stock", e.target.checked)
                      }
                    />
                    <span>Ürün stokta</span>
                  </label>
                </div>
              </div>

              <button
                className="publish-btn"
                type="submit"
                disabled={savingEdit}
              >
                {savingEdit ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}
              </button>
            </form>
          </div>
        )}

      </main>

      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 250px 1fr;
          background: #f5f4f1;
          font-family: Arial, Helvetica, sans-serif;
        }

        .admin-sidebar {
          background: #111;
          color: #fff;
          padding: 35px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .admin-logo-small {
          font-size: 8px;
          letter-spacing: 5px;
          color: #fff !important;
        }

        .admin-logo-main {
          font-family: Georgia, serif;
          font-size: 24px;
          letter-spacing: 5px;
          margin: 5px 0;
          color: #fff !important;
        }

        .admin-logo-location {
          font-size: 7px;
          letter-spacing: 4px;
          opacity: 0.55;
          color: #fff !important;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 60px;
        }

        .admin-nav button {
          border: 0;
          background: transparent;
          color: rgba(255,255,255,.6) !important;
          text-align: left;
          padding: 13px 0;
          font-size: 10px;
          letter-spacing: 1.4px;
          cursor: pointer;
        }

        .admin-nav button.active,
        .admin-nav button:hover {
          color: #fff !important;
        }

        .logout-btn {
          border: 1px solid rgba(255,255,255,.25);
          background: transparent;
          color: #fff !important;
          padding: 12px;
          font-size: 9px;
          letter-spacing: 1.5px;
          cursor: pointer;
        }

        .admin-content {
          padding: 45px 55px 80px;
        }

        .admin-topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 35px;
        }

        .admin-kicker {
          font-size: 8px;
          letter-spacing: 3px;
          opacity: .45;
        }

        .admin-topbar h1 {
          margin: 8px 0 0;
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 32px;
        }

        .admin-user {
          font-size: 10px;
          opacity: .5;
        }

        .form-card {
          background: #fff;
          padding: 35px;
          border: 1px solid #ece9e4;
        }

        .form-card h2 {
          margin: 0 0 28px;
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 21px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 22px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .language-divider {
          grid-column: 1 / -1;
          margin-top: 4px;
          padding: 12px 0 9px;
          border-bottom: 1px solid #e7e3dc;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.8px;
          color: #6f665b;
        }

        .form-field label {
          font-size: 8px;
          letter-spacing: 1.7px;
          font-weight: 700;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          min-height: 48px;
          border: 1px solid #ddd;
          background: #fff;
          padding: 0 13px;
          font-size: 12px;
          font-family: inherit;
          outline: none;
        }

        .form-field textarea {
          min-height: 112px;
          padding: 13px;
          line-height: 1.6;
          resize: vertical;
        }

        .field-counter {
          align-self: flex-end;
          margin-top: -3px;
          font-size: 8px;
          letter-spacing: .7px;
          opacity: .45;
        }

        .upload-box {
          min-height: 150px;
          border: 1px dashed #bbb;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          background: #faf9f7;
        }

        .upload-box input {
          display: none;
        }

        .upload-box strong {
          font-size: 11px;
        }

        .upload-box span {
          font-size: 9px;
          opacity: .55;
        }

        .stock-toggle {
          display: flex !important;
          flex-direction: row !important;
          align-items: center;
          gap: 10px !important;
          cursor: pointer;
        }

        .stock-toggle input {
          width: auto;
          min-height: auto;
        }

        .publish-btn {
          margin-top: 20px;
          width: 100%;
          min-height: 52px;
          border: 1px solid #111;
          background: #111;
          color: #fff !important;
          font-size: 10px;
          letter-spacing: 2px;
          cursor: pointer;
        }

        .admin-message {
          margin-top: 20px;
          padding: 14px 16px;
          background: #f5f3ee;
          border: 1px solid #ddd8cf;
          font-size: 11px;
          line-height: 1.6;
          text-align: center;
        }

        .publish-btn:disabled {
          opacity: 0.55;
          cursor: wait;
        }


        .management-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
          background: #fff;
          border: 1px solid #ece9e4;
          padding: 20px 24px;
        }

        .management-toolbar > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .management-toolbar strong {
          font-family: Georgia, serif;
          font-size: 18px;
          font-weight: 400;
        }

        .management-toolbar span {
          font-size: 9px;
          letter-spacing: .7px;
          color: #777;
        }

        .management-toolbar button {
          border: 1px solid #111;
          background: #fff;
          padding: 11px 16px;
          font-size: 9px;
          letter-spacing: 1.4px;
          cursor: pointer;
        }

        .admin-products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .admin-product-card {
          background: #fff;
          border: 1px solid #ece9e4;
          min-width: 0;
        }

        .admin-product-image {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #f7f6f3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .admin-product-image > span {
          font-size: 9px;
          letter-spacing: 1px;
          color: #999;
        }

        .stock-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 7px 9px;
          font-size: 7px;
          letter-spacing: 1px;
          background: rgba(255,255,255,.92);
        }

        .is-out-stock {
          color: #8d3c3c;
        }

        .admin-product-info {
          padding: 18px;
        }

        .admin-product-info h3 {
          margin: 0 0 10px;
          font-family: Georgia, serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.35;
        }

        .admin-product-price {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .product-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 18px;
        }

        .product-meta span {
          background: #f5f4f1;
          padding: 6px 8px;
          font-size: 7px;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .product-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .product-actions button {
          min-height: 36px;
          border: 1px solid #ddd;
          background: #fff;
          font-size: 7px;
          letter-spacing: .8px;
          cursor: pointer;
        }

        .product-actions .danger-action {
          grid-column: 1 / -1;
          color: #9a3636;
          border-color: #ead4d4;
        }

        .empty-products {
          background: #fff;
          border: 1px solid #ece9e4;
          padding: 50px 20px;
          text-align: center;
          font-size: 10px;
          letter-spacing: 1px;
          color: #777;
        }

        .edit-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0,0,0,.42);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 25px;
          overflow-y: auto;
        }

        .edit-modal {
          width: min(760px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          background: #fff;
          padding: 32px;
          box-shadow: 0 30px 80px rgba(0,0,0,.18);
        }

        .edit-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 28px;
        }

        .edit-modal-header h2 {
          margin: 7px 0 0;
          font-family: Georgia, serif;
          font-size: 24px;
          font-weight: 400;
        }

        .close-edit {
          border: 0;
          background: transparent;
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
        }

        .current-edit-image {
          width: 130px;
          height: 130px;
          object-fit: cover;
          margin-bottom: 10px;
          border: 1px solid #eee;
        }

        .edit-upload {
          min-height: 90px;
        }

        .settings-note {
          margin: 0;
          font-size: 12px;
          color: #777;
          line-height: 1.7;
        }

        @media (max-width: 850px) {
          .admin-dashboard {
            grid-template-columns: 1fr;
          }

          .admin-sidebar {
            padding: 22px;
          }

          .admin-nav {
            flex-direction: row;
            flex-wrap: wrap;
            margin-top: 25px;
          }

          .logout-btn {
            margin-top: 25px;
          }

          .admin-content {
            padding: 30px 18px 60px;
          }

          .admin-products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full {
            grid-column: auto;
          }

          .admin-topbar {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .management-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .admin-products-grid {
            grid-template-columns: 1fr;
          }

          .edit-overlay {
            padding: 10px;
          }

          .edit-modal {
            padding: 22px 16px;
          }
        }
      `}</style>
    </div>
  );
}