import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, Heart, ShoppingBag, User, Menu, X, Star, ChevronDown, ChevronRight,
  ChevronLeft, Plus, Minus, Trash2, Truck, ShieldCheck, RotateCcw, Sparkles,
  Instagram, Facebook, Mail, MapPin, Phone, Check, ArrowRight, Package,
  CreditCard, Landmark, Wallet, Filter, SlidersHorizontal, Upload, FileSpreadsheet,
  RefreshCw, AlertCircle, Settings
} from "lucide-react";
import Papa from "papaparse";

/* ============================= DESIGN TOKENS =============================
   Ink: #0B0B0C (near-black)   Cream: #FAF7F1   Gold: #C6A664 / #E8CE8F
   Display: Cormorant Garamond  Body: Jost
   Signature motif: a hand-drawn "constellation" line — three stars joined
   by thin gold threads — standing for "Kainat" (universe) and for the
   clear, star-dense night skies over Parachinar in Kurram District.
=========================================================================== */

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');";

/* ---------------------------- DATA GENERATION ---------------------------- */

const CATEGORIES = [
  { key: "lawn", label: "Unstitched Lawn" },
  { key: "rtw", label: "Ready to Wear" },
  { key: "formal", label: "Formal & Party Wear" },
  { key: "bridal", label: "Bridal Couture" },
  { key: "winter", label: "Winter Shawls" },
  { key: "casual", label: "Casual Kurtas" },
];

const FIRST = ["Noor","Zarish","Meherbano","Anaya","Sana","Alina","Rania","Mahira","Zoya","Iman",
  "Areeba","Hania","Laiba","Amal","Kainat","Farah","Nimra","Wardah","Sabahat","Zunaira",
  "Mariam","Dua","Eshaal","Rameen","Sarah"];

const TYPE_BY_CAT = {
  lawn: ["Embroidered Lawn 3-Piece","Digital Print Lawn Suit","Printed Lawn Kurta Set","Embroidered Lawn Shirt with Trouser"],
  rtw: ["Jacquard Kurti","Cotton Karandi Suit","A-Line Kurta Set","Straight Shirt with Sharara"],
  formal: ["Chiffon Party Gown","Organza Formal Frock","Net Embellished Maxi","Silk Formal Shirt & Palazzo"],
  bridal: ["Bridal Maxi with Dupatta","Heavy Embellished Gharara Set","Zardozi Bridal Gown","Sequinned Walima Lehenga"],
  winter: ["Pashmina Shawl Set","Velvet Winter Suit","Embroidered Khaddar Shawl","Quilted Velvet Kurta"],
  casual: ["Chikankari Cotton Kurta","Everyday Lawn Kurti","Printed Cotton Co-ord Set","Linen Casual Shirt"],
};

const COLORS = [
  { name: "Ivory", hex: "#F1ECDF" }, { name: "Onyx", hex: "#1B1B1B" }, { name: "Antique Gold", hex: "#C6A664" },
  { name: "Emerald", hex: "#1F5C4E" }, { name: "Maroon", hex: "#6E1F2A" }, { name: "Rose Dust", hex: "#C79E9E" },
  { name: "Midnight Blue", hex: "#1B2A4A" }, { name: "Sand", hex: "#D8C3A0" },
];

const SIZES = ["XS","S","M","L","XL"];

function seededRand(seed) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function buildProducts() {
  const list = [];
  for (let i = 0; i < 50; i++) {
    const cat = CATEGORIES[i % CATEGORIES.length];
    const types = TYPE_BY_CAT[cat.key];
    const type = types[Math.floor(seededRand(i + 1) * types.length)];
    const name = `${FIRST[i % FIRST.length]} ${type}`;
    const base = 5900 + (i % 9) * 2100 + Math.floor(seededRand(i + 50) * 1500);
    const onSale = i % 5 === 0;
    const price = onSale ? Math.round((base * 0.75) / 10) * 10 : base;
    const oldPrice = onSale ? base : null;
    const rating = Math.round((4.1 + seededRand(i + 3) * 0.9) * 10) / 10;
    const reviewsCount = 8 + Math.floor(seededRand(i + 7) * 240);
    const colorPicks = [0, 1, 2].map(k => COLORS[(i + k * 3) % COLORS.length]);
    const isNew = i % 4 === 1;
    const isBestSeller = i % 6 === 2;
    const id = `KB-${String(i + 1).padStart(3, "0")}`;
    list.push({
      id, name, category: cat.key, categoryLabel: cat.label,
      price, oldPrice, rating, reviewsCount,
      colors: colorPicks, sizes: SIZES,
      images: [
        `https://loremflickr.com/560/720/pakistani,fashion,women,dress?lock=${i * 7 + 1}`,
        `https://loremflickr.com/560/720/embroidery,textile,fashion?lock=${i * 7 + 2}`,
      ],
      description: `The ${name} is crafted for the woman who carries her heritage with quiet confidence. Cut from premium ${cat.key === "winter" ? "pashmina and velvet" : cat.key === "bridal" ? "silk and net" : "lawn and karandi"}, finished with hand-detailed embellishment and a silhouette designed to move with you — from Kainat Bano's Parachinar ateliers to your wardrobe.`,
      details: [
        "Fabric: " + (cat.key === "winter" ? "Pashmina / Velvet blend" : cat.key === "bridal" ? "Silk, Net, hand embellishment" : cat.key === "lawn" ? "Pure Lawn" : "Karandi / Cotton blend"),
        "Stitching: " + (cat.key === "lawn" ? "Unstitched (3-piece)" : "Ready to wear"),
        "Wash care: Dry clean recommended",
        "Made in Pakistan — Kainat Bano Atelier, Parachinar",
      ],
      isNew, isBestSeller, isSale: onSale,
      stock: 3 + Math.floor(seededRand(i + 11) * 20),
    });
  }
  return list;
}

/* ======================= CATALOG IMPORT / EXPORT LAYER =======================
   The entire storefront reads products from ONE array, passed around as
   `nav.products`. To load a real catalog, replace that array via the
   in-app "Manage Catalog" importer (footer link) using a CSV exported
   from Excel/Google Sheets — no design code needs to change.

   Required CSV columns (case-insensitive, any column order):
     name, category, price
   Optional CSV columns:
     oldPrice, sizes, colorNames, colorHex, description, image1, image2,
     rating, reviewsCount, isNew, isBestSeller, isSale, stock, sku

   - sizes / colorNames / colorHex are semicolon-separated, e.g. "S;M;L"
   - isNew / isBestSeller / isSale accept TRUE/FALSE, yes/no, or 1/0
   - image1 / image2 are direct image URLs (leave blank to auto-fill a
     placeholder so the layout never breaks on a missing photo)
================================================================================ */

const CSV_SPEC = [
  { col: "sku", required: false, note: "Unique ID. Auto-generated if blank." },
  { col: "name", required: true, note: "Product title." },
  { col: "category", required: true, note: "e.g. Unstitched Lawn, Bridal Couture." },
  { col: "price", required: true, note: "Current selling price (numbers only)." },
  { col: "oldPrice", required: false, note: "Original price, for a Sale badge." },
  { col: "sizes", required: false, note: "Semicolon-separated, e.g. S;M;L;XL." },
  { col: "colorNames", required: false, note: "Semicolon-separated, e.g. Ivory;Onyx." },
  { col: "colorHex", required: false, note: "Semicolon-separated hex, matching colorNames order." },
  { col: "description", required: false, note: "Product story / details." },
  { col: "image1", required: false, note: "Main image URL." },
  { col: "image2", required: false, note: "Secondary / hover image URL." },
  { col: "rating", required: false, note: "0–5. Defaults to 4.5 if blank." },
  { col: "reviewsCount", required: false, note: "Number of reviews. Defaults to 0." },
  { col: "isNew", required: false, note: "TRUE/FALSE." },
  { col: "isBestSeller", required: false, note: "TRUE/FALSE." },
  { col: "isSale", required: false, note: "TRUE/FALSE (auto TRUE if oldPrice > price)." },
  { col: "stock", required: false, note: "Units available. Defaults to 10." },
];

function slugify(str) {
  return String(str || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "general";
}

function toBool(v) {
  if (v === true || v === false) return v;
  const s = String(v || "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1";
}

function toNum(v, fallback = 0) {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function findKey(row, name) {
  const keys = Object.keys(row);
  const hit = keys.find(k => k.trim().toLowerCase() === name.toLowerCase());
  return hit ? row[hit] : undefined;
}

// Converts parsed CSV/Excel rows into the product shape the storefront renders.
// Rows missing a name or price are skipped and reported back to the importer.
function rowsToProducts(rows) {
  const products = [];
  const warnings = [];
  rows.forEach((row, idx) => {
    const name = (findKey(row, "name") || "").trim();
    const priceRaw = findKey(row, "price");
    if (!name || priceRaw === undefined || priceRaw === "") {
      warnings.push(`Row ${idx + 2}: skipped (missing "name" or "price").`);
      return;
    }
    const categoryLabel = (findKey(row, "category") || "Uncategorized").trim();
    const price = toNum(priceRaw);
    const oldPriceRaw = findKey(row, "oldPrice");
    const oldPrice = oldPriceRaw ? toNum(oldPriceRaw) : null;
    const sizes = (findKey(row, "sizes") || "S;M;L;XL").split(";").map(s => s.trim()).filter(Boolean);
    const colorNames = (findKey(row, "colorNames") || "Ivory;Onyx;Antique Gold").split(";").map(s => s.trim()).filter(Boolean);
    const colorHexList = (findKey(row, "colorHex") || "").split(";").map(s => s.trim()).filter(Boolean);
    const colors = colorNames.map((cn, i) => ({ name: cn, hex: colorHexList[i] || COLORS[i % COLORS.length].hex }));
    const sku = (findKey(row, "sku") || `KB-${String(idx + 1).padStart(3, "0")}`).trim();
    const img1 = (findKey(row, "image1") || "").trim();
    const img2 = (findKey(row, "image2") || "").trim();
    const fallbackLock = idx * 7;
    products.push({
      id: sku,
      name,
      category: slugify(categoryLabel),
      categoryLabel,
      price, oldPrice,
      rating: toNum(findKey(row, "rating"), 4.5),
      reviewsCount: Math.round(toNum(findKey(row, "reviewsCount"), 0)),
      colors, sizes,
      images: [
        img1 || `https://loremflickr.com/560/720/pakistani,fashion,women,dress?lock=${fallbackLock + 1}`,
        img2 || img1 || `https://loremflickr.com/560/720/embroidery,textile,fashion?lock=${fallbackLock + 2}`,
      ],
      description: (findKey(row, "description") || `${name} from the Kainat Bano ${categoryLabel} line — handcrafted in Parachinar, Kurram District.`).trim(),
      details: [
        "Category: " + categoryLabel,
        "Wash care: Dry clean recommended",
        "Made in Pakistan — Kainat Bano Atelier, Parachinar",
      ],
      isNew: findKey(row, "isNew") !== undefined ? toBool(findKey(row, "isNew")) : idx % 5 === 0,
      isBestSeller: findKey(row, "isBestSeller") !== undefined ? toBool(findKey(row, "isBestSeller")) : idx % 7 === 0,
      isSale: findKey(row, "isSale") !== undefined ? toBool(findKey(row, "isSale")) : !!(oldPrice && oldPrice > price),
      stock: Math.round(toNum(findKey(row, "stock"), 10)),
    });
  });
  return { products, warnings };
}

function parseCSVText(text) {
  const parsed = Papa.parse(text.trim(), { header: true, skipEmptyLines: true });
  return rowsToProducts(parsed.data);
}

// Builds a CSV template (with the current catalog as example rows) that the
// merchant can open in Excel, edit, and re-import through Manage Catalog.
function productsToCSV(products) {
  const header = ["sku","name","category","price","oldPrice","sizes","colorNames","colorHex","description","image1","image2","rating","reviewsCount","isNew","isBestSeller","isSale","stock"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [header.join(",")];
  products.forEach(p => {
    lines.push([
      p.id, p.name, p.categoryLabel, p.price, p.oldPrice ?? "",
      p.sizes.join(";"), p.colors.map(c => c.name).join(";"), p.colors.map(c => c.hex).join(";"),
      p.description, p.images[0] || "", p.images[1] || "",
      p.rating, p.reviewsCount, p.isNew ? "TRUE" : "FALSE", p.isBestSeller ? "TRUE" : "FALSE",
      p.isSale ? "TRUE" : "FALSE", p.stock,
    ].map(esc).join(","));
  });
  return lines.join("\n");
}

function downloadCSV(text, filename) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const REVIEWS = [
  { name: "Ayesha K.", city: "Lahore", rating: 5, text: "The fabric quality feels genuinely premium and the embroidery is so much finer in person. Kainat Bano has become my go-to for occasion wear." },
  { name: "Hafsa M.", city: "Islamabad", rating: 5, text: "Ordered a formal set for a wedding and got compliments all night. Delivery was fast even though I'm across the country from Parachinar." },
  { name: "Sidra A.", city: "Peshawar", rating: 4, text: "Beautiful stitching and true-to-size fit. Wish they had a few more colour options on the bridal line, but overall excellent." },
  { name: "Mehak R.", city: "Karachi", rating: 5, text: "This brand carries something the big names don't — you can feel the craft behind every piece. Already planning my next order." },
];

const INSTAGRAM_SEEDS = [1,2,3,4,5,6,7,8];

const FAQS = [
  { q: "How long does delivery take?", a: "Orders within Pakistan are delivered in 3–5 working days. Remote areas including parts of Kurram District may take up to 7 working days. International shipping takes 8–14 working days." },
  { q: "Can I return or exchange an item?", a: "Yes — unstitched and unworn items can be returned within 7 days of delivery for a refund or exchange. Custom-stitched bridal pieces are made to order and are exchange-only for sizing issues." },
  { q: "Do you offer custom stitching?", a: "Select ready-to-wear pieces can be tailored to your measurements at checkout for a small additional fee. Note this on your order or contact us before placing it." },
  { q: "What payment methods are accepted?", a: "We accept Cash on Delivery across Pakistan, direct bank transfer, and major debit/credit cards through our secure payment gateway." },
  { q: "How do I track my order?", a: "Use the Order Tracking page with the order number sent to your email or SMS after checkout." },
  { q: "Is Cash on Delivery available in Parachinar and Kurram District?", a: "Yes, COD is available across Kurram District, with select remote routes served via our regional courier partner." },
];

/* ------------------------------ HELPERS ------------------------------ */

const fmt = (n) => "Rs. " + n.toLocaleString("en-PK");

function Stars({ value, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} strokeWidth={1.4}
          fill={i <= Math.round(value) ? "#C6A664" : "none"}
          color="#C6A664" />
      ))}
    </span>
  );
}

function ConstellationMark({ size = 34, color = "#C6A664" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="8" cy="30" r="1.6" fill={color} />
      <circle cx="20" cy="10" r="2.1" fill={color} />
      <circle cx="33" cy="24" r="1.6" fill={color} />
      <path d="M8 30 L20 10 L33 24 L8 30" stroke={color} strokeWidth="0.7" opacity="0.8" />
    </svg>
  );
}

function ConstellationDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "18px 0" }}>
      <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, #C6A664)" }} />
      <ConstellationMark size={20} />
      <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, #C6A664, transparent)" }} />
    </div>
  );
}

function ProductImage({ src, alt, className, style }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? `https://picsum.photos/seed/${encodeURIComponent(alt)}/560/720` : src}
      onError={() => setErr(true)}
      alt={alt}
      className={className}
      style={{ objectFit: "cover", ...style }}
    />
  );
}

/* ============================ MAIN APP ============================ */

export default function KainatBanoApp() {
  const [view, setView] = useState({ page: "home" });
  const [products, setProducts] = useState(() => buildProducts());
  const [catalogSource, setCatalogSource] = useState("placeholder");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toastTimer = useRef(null);

  // On load, check for a previously-imported catalog (this device only)
  // so a real product list survives a page refresh without touching code.
  useEffect(() => {
    (async () => {
      try {
        const stored = await window.storage?.get?.("kb-catalog-v1", false);
        if (stored?.value) {
          const parsed = JSON.parse(stored.value);
          if (Array.isArray(parsed) && parsed.length) {
            setProducts(parsed);
            setCatalogSource("imported");
          }
        }
      } catch (e) { /* no saved catalog yet — keep placeholder set */ }
    })();
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [view]);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }

  function goTo(page, params = {}) {
    setMobileNav(false);
    setView({ page, ...params });
  }

  function addToCart(product, size, color, qty = 1) {
    setCart(prev => {
      const idx = prev.findIndex(l => l.id === product.id && l.size === size && l.color === color);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { id: product.id, size, color, qty }];
    });
    showToast(`Added to bag — ${product.name}`);
  }

  function toggleWishlist(product) {
    setWishlist(prev => {
      const has = prev.includes(product.id);
      showToast(has ? "Removed from wishlist" : "Saved to wishlist");
      return has ? prev.filter(id => id !== product.id) : [...prev, product.id];
    });
  }

  function updateQty(lineIdx, delta) {
    setCart(prev => prev.map((l, i) => i === lineIdx ? { ...l, qty: Math.max(1, l.qty + delta) } : l));
  }
  function removeLine(lineIdx) {
    setCart(prev => prev.filter((_, i) => i !== lineIdx));
  }

  const cartLines = useMemo(() => cart.map(l => ({ ...l, product: products.find(p => p.id === l.id) })), [cart, products]);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cartLines.reduce((s, l) => s + (l.product?.price || 0) * l.qty, 0);

  async function importCatalog(newProducts) {
    setProducts(newProducts);
    setCatalogSource("imported");
    setCart([]);
    try { await window.storage?.set?.("kb-catalog-v1", JSON.stringify(newProducts), false); } catch (e) { /* storage unavailable */ }
    showToast(`Catalog updated — ${newProducts.length} products live`);
  }
  async function resetCatalog() {
    const fresh = buildProducts();
    setProducts(fresh);
    setCatalogSource("placeholder");
    setCart([]);
    try { await window.storage?.delete?.("kb-catalog-v1", false); } catch (e) { /* nothing stored */ }
    showToast("Restored the 50 sample placeholder products");
  }

  const nav = { goTo, addToCart, toggleWishlist, wishlist, cartCount, showToast, products, catalogSource, importCatalog, resetCatalog };

  return (
    <div style={{
      fontFamily: "'Jost', sans-serif", background: "#FAF7F1", color: "#161513",
      minHeight: "100%", width: "100%",
    }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        .kb-serif { font-family: 'Cormorant Garamond', serif; }
        .kb-tracked { letter-spacing: 0.18em; text-transform: uppercase; }
        .kb-btn-gold {
          background: #0B0B0C; color: #E8CE8F; border: 1px solid #0B0B0C;
          padding: 13px 30px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; transition: all .25s ease; font-family: 'Jost', sans-serif;
        }
        .kb-btn-gold:hover { background: #1c1b19; }
        .kb-btn-outline {
          background: transparent; color: #0B0B0C; border: 1px solid #0B0B0C;
          padding: 12px 28px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; transition: all .25s ease; font-family: 'Jost', sans-serif;
        }
        .kb-btn-outline:hover { background: #0B0B0C; color: #E8CE8F; }
        .kb-card { transition: transform .4s ease, box-shadow .4s ease; }
        .kb-fade-up { animation: kbFadeUp .7s ease both; }
        @keyframes kbFadeUp { from { opacity:0; transform: translateY(18px);} to {opacity:1; transform:none;} }
        a { text-decoration: none; color: inherit; }
        input, select, textarea { font-family: 'Jost', sans-serif; }
        ::selection { background: #C6A664; color: #0B0B0C; }
        .kb-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .kb-scroll::-webkit-scrollbar-thumb { background: #C6A664; }
      `}</style>

      <TopBar />
      <Header nav={nav} mobileNav={mobileNav} setMobileNav={setMobileNav}
        searchOpen={searchOpen} setSearchOpen={setSearchOpen}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm} view={view} />

      <main>
        {view.page === "home" && <HomePage nav={nav} />}
        {view.page === "shop" && <ShopPage nav={nav} initial={view} />}
        {view.page === "product" && <ProductPage nav={nav} id={view.id} />}
        {view.page === "about" && <AboutPage nav={nav} />}
        {view.page === "contact" && <ContactPage nav={nav} />}
        {view.page === "wishlist" && <WishlistPage nav={nav} wishlist={wishlist} />}
        {view.page === "cart" && (
          <CartPage nav={nav} lines={cartLines} updateQty={updateQty} removeLine={removeLine} total={cartTotal} />
        )}
        {view.page === "checkout" && (
          <CheckoutPage nav={nav} lines={cartLines} total={cartTotal} clearCart={() => setCart([])} />
        )}
        {view.page === "login" && <LoginPage nav={nav} />}
        {view.page === "tracking" && <TrackingPage nav={nav} />}
        {view.page === "faq" && <FaqPage nav={nav} />}
        {view.page === "manage-catalog" && <ManageCatalogPage nav={nav} />}
      </main>

      <Footer nav={nav} />

      {toast && (
        <div className="kb-fade-up" style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#0B0B0C", color: "#F1ECDF", padding: "13px 26px", fontSize: 13,
          letterSpacing: "0.04em", zIndex: 200, display: "flex", alignItems: "center", gap: 10,
          border: "1px solid #C6A664",
        }}>
          <Check size={15} color="#C6A664" /> {toast}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ TOP BAR ------------------------------ */

function TopBar() {
  return (
    <div style={{ background: "#0B0B0C", color: "#E8CE8F", textAlign: "center", padding: "9px 12px", fontSize: 12, letterSpacing: "0.08em" }}>
      Free delivery across Pakistan on orders over Rs. 6,000 &nbsp;•&nbsp; Handcrafted in Parachinar, Kurram District
    </div>
  );
}

/* ------------------------------ HEADER ------------------------------ */

function Header({ nav, mobileNav, setMobileNav, searchOpen, setSearchOpen, searchTerm, setSearchTerm, view }) {
  const links = [
    { label: "Home", page: "home" },
    { label: "Shop", page: "shop" },
    { label: "New Arrivals", page: "shop", cat: "new" },
    { label: "Sale", page: "shop", cat: "sale" },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,247,241,0.97)", borderBottom: "1px solid rgba(11,11,12,0.1)", backdropFilter: "blur(6px)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => nav.goTo("home")}>
          <ConstellationMark />
          <div>
            <div className="kb-serif" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1 }}>Kainat Bano</div>
            <div className="kb-tracked" style={{ fontSize: 9, color: "#8a7a55" }}>Parachinar Atelier</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 30 }} className="kb-desktop-nav">
          {links.map(l => (
            <span key={l.label} onClick={() => nav.goTo(l.page, l.cat ? { cat: l.cat } : {})}
              className="kb-tracked"
              style={{ fontSize: 12, cursor: "pointer", paddingBottom: 4,
                borderBottom: view.page === l.page ? "1px solid #C6A664" : "1px solid transparent" }}>
              {l.label}
            </span>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Search size={19} style={{ cursor: "pointer" }} onClick={() => setSearchOpen(s => !s)} />
          <User size={19} style={{ cursor: "pointer" }} onClick={() => nav.goTo("login")} />
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => nav.goTo("wishlist")}>
            <Heart size={19} fill={nav.wishlist.length ? "#C6A664" : "none"} color={nav.wishlist.length ? "#C6A664" : "#161513"} />
            {nav.wishlist.length > 0 && <CountBadge n={nav.wishlist.length} />}
          </div>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => nav.goTo("cart")}>
            <ShoppingBag size={19} />
            {nav.cartCount > 0 && <CountBadge n={nav.cartCount} />}
          </div>
          <Menu size={22} style={{ cursor: "pointer", display: "none" }} className="kb-mobile-toggle" onClick={() => setMobileNav(true)} />
        </div>
      </div>

      {searchOpen && (
        <div style={{ borderTop: "1px solid rgba(11,11,12,0.1)", padding: "14px 24px", display: "flex", justifyContent: "center" }}>
          <input autoFocus value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { nav.goTo("shop", { search: searchTerm }); setSearchOpen(false); } }}
            placeholder="Search for suits, shawls, colors…"
            style={{ width: "100%", maxWidth: 480, border: "none", borderBottom: "1px solid #0B0B0C", background: "transparent", padding: "8px 4px", fontSize: 15, outline: "none" }} />
        </div>
      )}

      <style>{`
        @media (max-width: 920px) {
          .kb-desktop-nav { display: none !important; }
          .kb-mobile-toggle { display: block !important; }
        }
      `}</style>

      {mobileNav && (
        <div style={{ position: "fixed", inset: 0, background: "#0B0B0C", color: "#F1ECDF", zIndex: 300, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <X size={26} style={{ cursor: "pointer" }} onClick={() => setMobileNav(false)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 40, alignItems: "center" }}>
            {links.map(l => (
              <span key={l.label} className="kb-serif" style={{ fontSize: 26, cursor: "pointer" }}
                onClick={() => nav.goTo(l.page, l.cat ? { cat: l.cat } : {})}>{l.label}</span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function CountBadge({ n }) {
  return (
    <span style={{
      position: "absolute", top: -8, right: -9, background: "#C6A664", color: "#0B0B0C",
      fontSize: 10, width: 16, height: 16, borderRadius: "50%", display: "flex",
      alignItems: "center", justifyContent: "center", fontWeight: 600,
    }}>{n}</span>
  );
}

/* ------------------------------ HOME PAGE ------------------------------ */

function HomePage({ nav }) {
  const products = nav.products;
  const newArrivals = products.filter(p => p.isNew).slice(0, 8);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);
  const saleItems = products.filter(p => p.isSale).slice(0, 8);
  const liveCategories = useMemo(() => {
    const map = new Map();
    products.forEach(p => { if (!map.has(p.category)) map.set(p.category, p.categoryLabel); });
    return Array.from(map, ([key, label]) => ({ key, label }));
  }, [products]);

  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", height: "88vh", minHeight: 560, overflow: "hidden", background: "#0B0B0C" }}>
        <ProductImage src="https://loremflickr.com/1600/1000/pakistani,bridal,fashion,elegant?lock=901" alt="Kainat Bano hero"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,11,12,0.35), rgba(11,11,12,0.85))" }} />
        <div className="kb-fade-up" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, color: "#F1ECDF" }}>
          <span className="kb-tracked" style={{ fontSize: 12, color: "#C6A664", marginBottom: 18 }}>The Autumn Collection · 2026</span>
          <h1 className="kb-serif" style={{ fontSize: "clamp(38px, 7vw, 84px)", fontWeight: 500, lineHeight: 1.05, maxWidth: 900, margin: 0 }}>
            Woven under the skies of Parachinar
          </h1>
          <p style={{ maxWidth: 560, marginTop: 20, fontSize: 16, color: "#D9D2C4", lineHeight: 1.7 }}>
            Kainat — the universe. Each piece from our Kurram District atelier carries the quiet grandeur of the mountains it was made among.
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 34, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="kb-btn-gold" style={{ background: "#C6A664", color: "#0B0B0C", border: "1px solid #C6A664" }} onClick={() => nav.goTo("shop")}>Shop the Collection</button>
            <button className="kb-btn-outline" style={{ color: "#F1ECDF", borderColor: "#F1ECDF" }} onClick={() => nav.goTo("about")}>Our Story</button>
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <section style={{ borderBottom: "1px solid rgba(11,11,12,0.1)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-around", padding: "26px 20px", gap: 18 }}>
          {[
            { icon: Truck, t: "Nationwide Delivery", s: "3–5 working days" },
            { icon: ShieldCheck, t: "Secure Checkout", s: "Encrypted payments" },
            { icon: RotateCcw, t: "7-Day Returns", s: "On unstitched pieces" },
            { icon: Sparkles, t: "Handcrafted Detail", s: "Made in Parachinar" },
          ].map(u => (
            <div key={u.t} style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
              <u.icon size={22} color="#C6A664" strokeWidth={1.3} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{u.t}</div>
                <div style={{ fontSize: 12, color: "#78716a" }}>{u.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <Section title="Featured Collections" subtitle="Curated by category">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {liveCategories.map((c, i) => (
            <div key={c.key} className="kb-card" onClick={() => nav.goTo("shop", { cat: c.key })}
              style={{ position: "relative", height: 340, cursor: "pointer", overflow: "hidden" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <ProductImage src={`https://loremflickr.com/420/560/pakistani,fashion,textile?lock=${i + 300}`} alt={c.label}
                style={{ width: "100%", height: "100%" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(11,11,12,0.75))" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, color: "#F1ECDF" }}>
                <div className="kb-serif" style={{ fontSize: 24 }}>{c.label}</div>
                <div className="kb-tracked" style={{ fontSize: 10, color: "#C6A664", marginTop: 6 }}>Shop Now →</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <ConstellationDivider />

      <Section title="New Arrivals" subtitle="Fresh from the atelier" action={{ label: "View All", onClick: () => nav.goTo("shop", { cat: "new" }) }}>
        <ProductRow products={newArrivals} nav={nav} />
      </Section>

      <Section title="Best Sellers" subtitle="Loved by our customers" action={{ label: "View All", onClick: () => nav.goTo("shop", { cat: "bestseller" }) }} dark>
        <ProductRow products={bestSellers} nav={nav} dark />
      </Section>

      <Section title="Season Sale" subtitle="Up to 25% off selected pieces" action={{ label: "Shop Sale", onClick: () => nav.goTo("shop", { cat: "sale" }) }}>
        <ProductRow products={saleItems} nav={nav} />
      </Section>

      <ConstellationDivider />

      {/* TESTIMONIALS */}
      <Section title="What Our Customers Say" subtitle="From wardrobes across Pakistan">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {REVIEWS.map(r => (
            <div key={r.name} style={{ border: "1px solid rgba(11,11,12,0.12)", padding: 26 }}>
              <Stars value={r.rating} />
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#3a362f", margin: "14px 0" }}>"{r.text}"</p>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "#8a7a55" }}>{r.city}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* INSTAGRAM */}
      <Section title="@kainatbano.pk" subtitle="Follow us for styling and new drops">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 6 }}>
          {INSTAGRAM_SEEDS.map(s => (
            <div key={s} style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", cursor: "pointer" }}>
              <ProductImage src={`https://loremflickr.com/300/300/fashion,pakistani,style?lock=${s + 500}`} alt="Instagram post" style={{ width: "100%", height: "100%" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(11,11,12,0)", transition: "background .3s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(11,11,12,0.45)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(11,11,12,0)"}>
                <Instagram size={20} color="#F1ECDF" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Newsletter />

      <Section title="Frequently Asked Questions" subtitle="Everything you need to know">
        <FaqAccordion items={FAQS.slice(0, 4)} />
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button className="kb-btn-outline" onClick={() => nav.goTo("faq")}>View All FAQs</button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children, action, dark }) {
  return (
    <section style={{ background: dark ? "#0B0B0C" : "transparent", color: dark ? "#F1ECDF" : "#161513", padding: "60px 24px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="kb-tracked" style={{ fontSize: 11, color: "#C6A664" }}>{subtitle}</div>
            <h2 className="kb-serif" style={{ fontSize: 34, fontWeight: 500, margin: "6px 0 0" }}>{title}</h2>
          </div>
          {action && (
            <span className="kb-tracked" style={{ fontSize: 11, cursor: "pointer", borderBottom: "1px solid " + (dark ? "#C6A664" : "#0B0B0C"), paddingBottom: 3 }} onClick={action.onClick}>
              {action.label}
            </span>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function ProductRow({ products, nav, dark }) {
  return (
    <div className="kb-scroll" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 22 }}>
      {products.map(p => <ProductCard key={p.id} p={p} nav={nav} dark={dark} />)}
    </div>
  );
}

function ProductCard({ p, nav, dark }) {
  const [hover, setHover] = useState(false);
  const wished = nav.wishlist.includes(p.id);
  return (
    <div className="kb-card" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}>
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#eee" }} onClick={() => nav.goTo("product", { id: p.id })}>
        <ProductImage src={hover ? p.images[1] : p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", transition: "transform .5s", transform: hover ? "scale(1.05)" : "scale(1)" }} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          {p.isNew && <Tag>New</Tag>}
          {p.isSale && <Tag gold>Sale</Tag>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); nav.toggleWishlist(p); }}
          style={{ position: "absolute", top: 10, right: 10, background: "rgba(250,247,241,0.9)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Heart size={15} fill={wished ? "#C6A664" : "none"} color={wished ? "#C6A664" : "#0B0B0C"} />
        </button>
        {hover && (
          <button onClick={(e) => { e.stopPropagation(); nav.addToCart(p, p.sizes[2], p.colors[0].name, 1); }}
            className="kb-fade-up" style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#0B0B0C", color: "#E8CE8F", border: "none", padding: "10px 0", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            Quick Add
          </button>
        )}
      </div>
      <div style={{ padding: "12px 2px", color: dark ? "#F1ECDF" : "#161513" }}>
        <div className="kb-tracked" style={{ fontSize: 9.5, color: "#C6A664" }}>{p.categoryLabel}</div>
        <div style={{ fontSize: 14.5, margin: "4px 0", fontWeight: 500 }}>{p.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{fmt(p.price)}</span>
          {p.oldPrice && <span style={{ fontSize: 12, color: "#8a7a55", textDecoration: "line-through" }}>{fmt(p.oldPrice)}</span>}
        </div>
        <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <Stars value={p.rating} size={11} />
          <span style={{ fontSize: 11, color: "#8a7a55" }}>({p.reviewsCount})</span>
        </div>
      </div>
    </div>
  );
}

function Tag({ children, gold }) {
  return (
    <span className="kb-tracked" style={{ fontSize: 9, padding: "4px 8px", background: gold ? "#C6A664" : "#0B0B0C", color: gold ? "#0B0B0C" : "#F1ECDF" }}>{children}</span>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section style={{ background: "#0B0B0C", color: "#F1ECDF", padding: "70px 24px", textAlign: "center" }}>
      <ConstellationMark />
      <h2 className="kb-serif" style={{ fontSize: 32, margin: "16px 0 8px" }}>Join the Kainat Bano Circle</h2>
      <p style={{ color: "#D9D2C4", maxWidth: 480, margin: "0 auto 26px", fontSize: 14 }}>
        Be first to know about new collections, private sales, and stories from our Parachinar atelier.
      </p>
      {sent ? (
        <div style={{ color: "#C6A664", fontSize: 14 }}>Thank you — you're on the list.</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (email) setSent(true); }} style={{ display: "flex", justifyContent: "center", gap: 0, maxWidth: 420, margin: "0 auto", flexWrap: "wrap" }}>
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address"
            style={{ flex: 1, minWidth: 220, padding: "13px 16px", background: "transparent", border: "1px solid #C6A664", color: "#F1ECDF", outline: "none", fontSize: 13 }} />
          <button type="submit" className="kb-btn-gold" style={{ background: "#C6A664", color: "#0B0B0C", border: "1px solid #C6A664" }}>Subscribe</button>
        </form>
      )}
    </section>
  );
}

/* ------------------------------ SHOP PAGE ------------------------------ */

function ShopPage({ nav, initial }) {
  const [category, setCategory] = useState(initial.cat || "all");
  const [sort, setSort] = useState("featured");
  const [priceMax, setPriceMax] = useState(30000);
  const [search, setSearch] = useState(initial.search || "");
  const [visible, setVisible] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setCategory(initial.cat || "all"); setSearch(initial.search || ""); setVisible(12); }, [initial.cat, initial.search]);

  const products = nav.products;
  const liveCategories = useMemo(() => {
    const map = new Map();
    products.forEach(p => { if (!map.has(p.category)) map.set(p.category, p.categoryLabel); });
    return Array.from(map, ([key, label]) => ({ key, label }));
  }, [products]);

  let filtered = products.filter(p => {
    if (category === "new" && !p.isNew) return false;
    if (category === "bestseller" && !p.isBestSeller) return false;
    if (category === "sale" && !p.isSale) return false;
    if (!["all", "new", "bestseller", "sale"].includes(category) && p.category !== category) return false;
    if (p.price > priceMax) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const label = category === "all" ? "All Products" : category === "new" ? "New Arrivals" : category === "bestseller" ? "Best Sellers" : category === "sale" ? "Season Sale" : liveCategories.find(c => c.key === category)?.label || "Products";

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Breadcrumb items={["Home", "Shop", label]} nav={nav} />
      <h1 className="kb-serif" style={{ fontSize: 40, margin: "10px 0 30px" }}>{label}</h1>

      <div style={{ display: "flex", gap: 40 }}>
        <aside style={{ width: 240, flexShrink: 0, display: showFilters ? "block" : undefined }} className="kb-shop-aside">
          <FilterBlock title="Category">
            {[{ key: "all", label: "All Products" }, ...liveCategories].map(c => (
              <div key={c.key} onClick={() => setCategory(c.key)} style={{ cursor: "pointer", padding: "6px 0", fontSize: 13.5, color: category === c.key ? "#C6A664" : "#161513", fontWeight: category === c.key ? 500 : 400 }}>
                {c.label}
              </div>
            ))}
          </FilterBlock>
          <FilterBlock title="Price">
            <input type="range" min={3000} max={30000} step={500} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ width: "100%", accentColor: "#C6A664" }} />
            <div style={{ fontSize: 12.5, color: "#78716a" }}>Up to {fmt(priceMax)}</div>
          </FilterBlock>
          <FilterBlock title="Quick Filters">
            {[["new", "New Arrivals"], ["bestseller", "Best Sellers"], ["sale", "On Sale"]].map(([k, l]) => (
              <div key={k} onClick={() => setCategory(k)} style={{ cursor: "pointer", padding: "6px 0", fontSize: 13.5, color: category === k ? "#C6A664" : "#161513" }}>{l}</div>
            ))}
          </FilterBlock>
        </aside>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#78716a" }}>{filtered.length} products</span>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <button onClick={() => setShowFilters(s => !s)} className="kb-mobile-filter-btn" style={{ display: "none", alignItems: "center", gap: 6, border: "1px solid #0B0B0C", background: "none", padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>
                <SlidersHorizontal size={14} /> Filters
              </button>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: "1px solid #0B0B0C", background: "transparent", padding: "8px 10px", fontSize: 12.5 }}>
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#78716a" }}>No products match these filters.</div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 22 }}>
                {filtered.slice(0, visible).map(p => <ProductCard key={p.id} p={p} nav={nav} />)}
              </div>
              {visible < filtered.length && (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <button className="kb-btn-outline" onClick={() => setVisible(v => v + 12)}>Load More</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 800px) { .kb-shop-aside { display: none !important; } .kb-mobile-filter-btn { display: flex !important; } }`}</style>
    </div>
  );
}

function FilterBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div className="kb-tracked" style={{ fontSize: 11, marginBottom: 12, color: "#0B0B0C" }}>{title}</div>
      {children}
    </div>
  );
}

function Breadcrumb({ items, nav }) {
  return (
    <div style={{ fontSize: 12, color: "#8a7a55", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <ChevronRight size={11} />}
          <span style={{ cursor: i === 0 ? "pointer" : "default" }} onClick={() => i === 0 && nav.goTo("home")}>{it}</span>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------ PRODUCT PAGE ------------------------------ */

function ProductPage({ nav, id }) {
  const p = nav.products.find(x => x.id === id) || nav.products[0];
  const [size, setSize] = useState(p.sizes[2]);
  const [color, setColor] = useState(p.colors[0].name);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [tab, setTab] = useState("desc");

  useEffect(() => { setSize(p.sizes[2]); setColor(p.colors[0].name); setQty(1); setImg(0); }, [id]);

  const related = nav.products.filter(r => r.category === p.category && r.id !== p.id).slice(0, 4);

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 24px 90px" }}>
      <Breadcrumb items={["Home", p.categoryLabel, p.name]} nav={nav} />

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 50, marginTop: 24 }} className="kb-pdp-grid">
        <div>
          <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "#eee" }}>
            <ProductImage src={p.images[img]} alt={p.name} style={{ width: "100%", height: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {p.images.map((im, i) => (
              <div key={i} onClick={() => setImg(i)} style={{ width: 70, height: 90, overflow: "hidden", cursor: "pointer", border: img === i ? "1px solid #C6A664" : "1px solid transparent" }}>
                <ProductImage src={im} alt={p.name} style={{ width: "100%", height: "100%" }} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="kb-tracked" style={{ fontSize: 11, color: "#C6A664" }}>{p.categoryLabel}</div>
          <h1 className="kb-serif" style={{ fontSize: 36, margin: "8px 0" }}>{p.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Stars value={p.rating} />
            <span style={{ fontSize: 12.5, color: "#78716a" }}>{p.rating} · {p.reviewsCount} reviews</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
            <span style={{ fontSize: 26 }}>{fmt(p.price)}</span>
            {p.oldPrice && <span style={{ fontSize: 16, textDecoration: "line-through", color: "#8a7a55" }}>{fmt(p.oldPrice)}</span>}
            {p.isSale && <Tag gold>Save {Math.round((1 - p.price / p.oldPrice) * 100)}%</Tag>}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#3a362f" }}>{p.description}</p>

          <div style={{ marginTop: 24 }}>
            <div className="kb-tracked" style={{ fontSize: 11, marginBottom: 10 }}>Color — {color}</div>
            <div style={{ display: "flex", gap: 10 }}>
              {p.colors.map(c => (
                <div key={c.name} onClick={() => setColor(c.name)} title={c.name}
                  style={{ width: 30, height: 30, borderRadius: "50%", background: c.hex, cursor: "pointer", border: color === c.name ? "2px solid #C6A664" : "2px solid transparent", outline: "1px solid rgba(0,0,0,0.1)" }} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <div className="kb-tracked" style={{ fontSize: 11, marginBottom: 10 }}>Size — {size}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {p.sizes.map(s => (
                <div key={s} onClick={() => setSize(s)} style={{ width: 42, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12.5, border: size === s ? "1px solid #0B0B0C" : "1px solid #d8d2c4", background: size === s ? "#0B0B0C" : "transparent", color: size === s ? "#E8CE8F" : "#161513" }}>{s}</div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 28, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #0B0B0C" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: "10px 14px", background: "none", border: "none", cursor: "pointer" }}><Minus size={13} /></button>
              <span style={{ padding: "0 14px", fontSize: 14 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ padding: "10px 14px", background: "none", border: "none", cursor: "pointer" }}><Plus size={13} /></button>
            </div>
            <button className="kb-btn-gold" style={{ flex: 1, minWidth: 180 }} onClick={() => nav.addToCart(p, size, color, qty)}>Add to Bag</button>
            <button onClick={() => nav.toggleWishlist(p)} style={{ width: 46, height: 46, border: "1px solid #0B0B0C", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={18} fill={nav.wishlist.includes(p.id) ? "#C6A664" : "none"} color={nav.wishlist.includes(p.id) ? "#C6A664" : "#0B0B0C"} />
            </button>
          </div>
          <div style={{ fontSize: 12, color: p.stock > 5 ? "#3f7d52" : "#a34b2a", marginTop: 14 }}>
            {p.stock > 5 ? "In stock, ready to ship" : `Only ${p.stock} left in stock`}
          </div>

          <div style={{ marginTop: 34, borderTop: "1px solid rgba(11,11,12,0.12)" }}>
            <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
              {[["desc","Description"],["details","Details & Care"],["reviews",`Reviews (${p.reviewsCount})`]].map(([k,l]) => (
                <span key={k} className="kb-tracked" onClick={() => setTab(k)} style={{ fontSize: 11.5, cursor: "pointer", paddingBottom: 8, borderBottom: tab === k ? "1px solid #C6A664" : "1px solid transparent", color: tab === k ? "#0B0B0C" : "#8a7a55" }}>{l}</span>
              ))}
            </div>
            <div style={{ padding: "20px 0", fontSize: 13.5, lineHeight: 1.9, color: "#3a362f" }}>
              {tab === "desc" && <p>{p.description}</p>}
              {tab === "details" && <ul style={{ paddingLeft: 18 }}>{p.details.map(d => <li key={d}>{d}</li>)}</ul>}
              {tab === "reviews" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {REVIEWS.slice(0, 3).map(r => (
                    <div key={r.name} style={{ borderBottom: "1px solid rgba(11,11,12,0.08)", paddingBottom: 14 }}>
                      <Stars value={r.rating} size={12} />
                      <div style={{ fontWeight: 500, marginTop: 6 }}>{r.name} <span style={{ color: "#8a7a55", fontWeight: 400 }}>· {r.city}</span></div>
                      <p style={{ marginTop: 4 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 70 }}>
          <h2 className="kb-serif" style={{ fontSize: 28, marginBottom: 24 }}>You May Also Like</h2>
          <ProductRow products={related} nav={nav} />
        </div>
      )}
      <style>{`@media (max-width: 820px) { .kb-pdp-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

/* ------------------------------ WISHLIST PAGE ------------------------------ */

function WishlistPage({ nav, wishlist }) {
  const items = nav.products.filter(p => wishlist.includes(p.id));
  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 24px 90px" }}>
      <Breadcrumb items={["Home", "Wishlist"]} nav={nav} />
      <h1 className="kb-serif" style={{ fontSize: 40, margin: "10px 0 30px" }}>Your Wishlist</h1>
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" text="Save pieces you love while you browse — they'll appear here." action={{ label: "Explore the Shop", onClick: () => nav.goTo("shop") }} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 22 }}>
          {items.map(p => <ProductCard key={p.id} p={p} nav={nav} />)}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div style={{ textAlign: "center", padding: "70px 20px", border: "1px dashed rgba(11,11,12,0.2)" }}>
      <Icon size={34} color="#C6A664" strokeWidth={1.2} />
      <h3 className="kb-serif" style={{ fontSize: 24, margin: "16px 0 8px" }}>{title}</h3>
      <p style={{ color: "#78716a", fontSize: 14, marginBottom: 22 }}>{text}</p>
      {action && <button className="kb-btn-gold" onClick={action.onClick}>{action.label}</button>}
    </div>
  );
}

/* ------------------------------ CART PAGE ------------------------------ */

function CartPage({ nav, lines, updateQty, removeLine, total }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 90px" }}>
      <Breadcrumb items={["Home", "Shopping Bag"]} nav={nav} />
      <h1 className="kb-serif" style={{ fontSize: 40, margin: "10px 0 30px" }}>Shopping Bag</h1>

      {lines.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Your bag is empty" text="Add pieces you love and they'll show up here, ready for checkout." action={{ label: "Continue Shopping", onClick: () => nav.goTo("shop") }} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 40 }} className="kb-cart-grid">
          <div>
            {lines.map((l, i) => l.product && (
              <div key={i} style={{ display: "flex", gap: 16, padding: "20px 0", borderBottom: "1px solid rgba(11,11,12,0.1)" }}>
                <div style={{ width: 90, height: 118, overflow: "hidden", flexShrink: 0, cursor: "pointer" }} onClick={() => nav.goTo("product", { id: l.product.id })}>
                  <ProductImage src={l.product.images[0]} alt={l.product.name} style={{ width: "100%", height: "100%" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{l.product.name}</div>
                      <div style={{ fontSize: 12.5, color: "#78716a", marginTop: 4 }}>Size {l.size} · {l.color}</div>
                    </div>
                    <Trash2 size={16} style={{ cursor: "pointer", color: "#8a7a55" }} onClick={() => removeLine(i)} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #0B0B0C" }}>
                      <button onClick={() => updateQty(i, -1)} style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer" }}><Minus size={12} /></button>
                      <span style={{ padding: "0 12px", fontSize: 13 }}>{l.qty}</span>
                      <button onClick={() => updateQty(i, 1)} style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer" }}><Plus size={12} /></button>
                    </div>
                    <span style={{ fontSize: 15 }}>{fmt(l.product.price * l.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#F1ECDF", padding: 26, height: "fit-content" }}>
            <h3 className="kb-serif" style={{ fontSize: 22, marginBottom: 18 }}>Order Summary</h3>
            <SummaryRow label="Subtotal" value={fmt(total)} />
            <SummaryRow label="Shipping" value={total > 6000 ? "Free" : fmt(250)} />
            <div style={{ borderTop: "1px solid rgba(11,11,12,0.15)", margin: "14px 0" }} />
            <SummaryRow label="Total" value={fmt(total > 6000 ? total : total + 250)} bold />
            <button className="kb-btn-gold" style={{ width: "100%", marginTop: 20 }} onClick={() => nav.goTo("checkout")}>Proceed to Checkout</button>
            <div onClick={() => nav.goTo("shop")} style={{ textAlign: "center", fontSize: 12.5, marginTop: 14, cursor: "pointer", color: "#8a7a55" }}>Continue Shopping</div>
          </div>
        </div>
      )}
      <style>{`@media (max-width: 760px) { .kb-cart-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: bold ? 16 : 13.5, fontWeight: bold ? 600 : 400 }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

/* ------------------------------ CHECKOUT PAGE ------------------------------ */

function CheckoutPage({ nav, lines, total, clearCart }) {
  const [step, setStep] = useState(lines.length === 0 ? "empty" : "form");
  const [payment, setPayment] = useState("cod");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", district: "", postal: "" });
  const [orderNo, setOrderNo] = useState("");

  function placeOrder(e) {
    e.preventDefault();
    const no = "KB" + Math.floor(100000 + Math.random() * 899999);
    setOrderNo(no);
    setStep("success");
    clearCart();
  }

  if (step === "empty") {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 90px" }}>
        <EmptyState icon={ShoppingBag} title="Nothing to check out" text="Your bag is empty — add something beautiful first." action={{ label: "Go to Shop", onClick: () => nav.goTo("shop") }} />
      </div>
    );
  }

  if (step === "success") {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <ConstellationMark size={44} />
        <h1 className="kb-serif" style={{ fontSize: 34, margin: "18px 0 10px" }}>Order Placed</h1>
        <p style={{ color: "#78716a", fontSize: 14 }}>Thank you, {form.name || "valued customer"}. A confirmation has been sent to {form.email || "your inbox"}.</p>
        <div style={{ background: "#F1ECDF", padding: 22, margin: "26px 0", display: "inline-block" }}>
          <div className="kb-tracked" style={{ fontSize: 11, color: "#8a7a55" }}>Order Number</div>
          <div className="kb-serif" style={{ fontSize: 28 }}>{orderNo}</div>
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="kb-btn-gold" onClick={() => nav.goTo("tracking")}>Track Order</button>
          <button className="kb-btn-outline" onClick={() => nav.goTo("shop")}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 90px" }}>
      <Breadcrumb items={["Home", "Bag", "Checkout"]} nav={nav} />
      <h1 className="kb-serif" style={{ fontSize: 40, margin: "10px 0 30px" }}>Secure Checkout</h1>
      <form onSubmit={placeOrder} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40 }} className="kb-cart-grid">
        <div>
          <h3 className="kb-tracked" style={{ fontSize: 12, marginBottom: 16 }}>Shipping Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <Field label="Phone Number" value={form.phone} onChange={v => setForm({ ...form, phone: v })} required />
          </div>
          <Field label="Email Address" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
          <Field label="Street Address" value={form.address} onChange={v => setForm({ ...form, address: v })} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <Field label="City" value={form.city} onChange={v => setForm({ ...form, city: v })} required />
            <Field label="District" value={form.district} onChange={v => setForm({ ...form, district: v })} />
            <Field label="Postal Code" value={form.postal} onChange={v => setForm({ ...form, postal: v })} />
          </div>

          <h3 className="kb-tracked" style={{ fontSize: 12, margin: "26px 0 16px" }}>Payment Method</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <PayOption icon={Wallet} label="Cash on Delivery" active={payment === "cod"} onClick={() => setPayment("cod")} />
            <PayOption icon={Landmark} label="Bank Transfer" active={payment === "bank"} onClick={() => setPayment("bank")} />
            <PayOption icon={CreditCard} label="Debit / Credit Card" active={payment === "card"} onClick={() => setPayment("card")} />
          </div>
          {payment === "card" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
              <Field label="Card Number" placeholder="4242 4242 4242 4242" />
              <Field label="Name on Card" />
              <Field label="Expiry" placeholder="MM/YY" />
              <Field label="CVV" placeholder="123" />
            </div>
          )}
          {payment === "bank" && (
            <p style={{ fontSize: 12.5, color: "#78716a", marginTop: 12 }}>Bank details will be shared by email after order confirmation.</p>
          )}
        </div>

        <div style={{ background: "#F1ECDF", padding: 26, height: "fit-content" }}>
          <h3 className="kb-serif" style={{ fontSize: 22, marginBottom: 18 }}>Order Summary</h3>
          {lines.map((l, i) => l.product && (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 0" }}>
              <span>{l.product.name} × {l.qty}</span><span>{fmt(l.product.price * l.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(11,11,12,0.15)", margin: "14px 0" }} />
          <SummaryRow label="Shipping" value={total > 6000 ? "Free" : fmt(250)} />
          <SummaryRow label="Total" value={fmt(total > 6000 ? total : total + 250)} bold />
          <button type="submit" className="kb-btn-gold" style={{ width: "100%", marginTop: 20 }}>Place Order</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 11.5, color: "#78716a" }}>
            <ShieldCheck size={14} color="#C6A664" /> Payments are encrypted and secure
          </div>
        </div>
      </form>
      <style>{`@media (max-width: 760px) { .kb-cart-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11.5, color: "#78716a", display: "block", marginBottom: 6 }} className="kb-tracked">{label}{required && " *"}</label>
      <input type={type} required={required} value={value} placeholder={placeholder}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ width: "100%", padding: "11px 12px", border: "1px solid rgba(11,11,12,0.25)", background: "#fff", fontSize: 13.5, outline: "none" }} />
    </div>
  );
}

function PayOption({ icon: Icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: active ? "1px solid #0B0B0C" : "1px solid rgba(11,11,12,0.2)", cursor: "pointer", background: active ? "#F1ECDF" : "transparent" }}>
      <Icon size={17} color={active ? "#C6A664" : "#78716a"} />
      <span style={{ fontSize: 13.5 }}>{label}</span>
      {active && <Check size={15} style={{ marginLeft: "auto" }} color="#C6A664" />}
    </div>
  );
}

/* ------------------------------ LOGIN PAGE ------------------------------ */

function LoginPage({ nav }) {
  const [mode, setMode] = useState("login");
  const [done, setDone] = useState(false);

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "60px 24px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <ConstellationMark size={36} />
        <h1 className="kb-serif" style={{ fontSize: 30, margin: "12px 0 4px" }}>{mode === "login" ? "Welcome Back" : "Create an Account"}</h1>
        <p style={{ fontSize: 13, color: "#78716a" }}>{mode === "login" ? "Sign in to view your orders and wishlist" : "Join Kainat Bano for a faster checkout"}</p>
      </div>

      <div style={{ display: "flex", marginBottom: 26, border: "1px solid #0B0B0C" }}>
        <button onClick={() => setMode("login")} style={{ flex: 1, padding: 12, border: "none", cursor: "pointer", background: mode === "login" ? "#0B0B0C" : "transparent", color: mode === "login" ? "#E8CE8F" : "#0B0B0C", fontSize: 12.5, letterSpacing: "0.08em" }}>Sign In</button>
        <button onClick={() => setMode("register")} style={{ flex: 1, padding: 12, border: "none", cursor: "pointer", background: mode === "register" ? "#0B0B0C" : "transparent", color: mode === "register" ? "#E8CE8F" : "#0B0B0C", fontSize: 12.5, letterSpacing: "0.08em" }}>Register</button>
      </div>

      {done ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <Check size={30} color="#C6A664" />
          <p style={{ marginTop: 12, fontSize: 14 }}>{mode === "login" ? "Signed in successfully." : "Account created successfully."}</p>
          <button className="kb-btn-outline" style={{ marginTop: 16 }} onClick={() => nav.goTo("home")}>Back to Home</button>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setDone(true); }}>
          {mode === "register" && <Field label="Full Name" required />}
          <Field label="Email Address" type="email" required />
          <Field label="Password" type="password" required />
          {mode === "register" && <Field label="Confirm Password" type="password" required />}
          {mode === "login" && <div style={{ textAlign: "right", fontSize: 12, color: "#8a7a55", cursor: "pointer", marginBottom: 16 }}>Forgot password?</div>}
          <button className="kb-btn-gold" style={{ width: "100%" }} type="submit">{mode === "login" ? "Sign In" : "Create Account"}</button>
        </form>
      )}
    </div>
  );
}

/* ------------------------------ ORDER TRACKING ------------------------------ */

function TrackingPage({ nav }) {
  const [orderNo, setOrderNo] = useState("");
  const [result, setResult] = useState(null);

  const STAGES = ["Order Confirmed", "Processing at Atelier", "Dispatched", "Out for Delivery", "Delivered"];

  function track(e) {
    e.preventDefault();
    if (!orderNo.trim()) return;
    const seed = orderNo.length % STAGES.length;
    setResult({ stage: Math.max(1, seed), no: orderNo.toUpperCase() });
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 34 }}>
        <Package size={30} color="#C6A664" strokeWidth={1.3} />
        <h1 className="kb-serif" style={{ fontSize: 32, margin: "12px 0 4px" }}>Track Your Order</h1>
        <p style={{ fontSize: 13, color: "#78716a" }}>Enter your order number to see its current status</p>
      </div>
      <form onSubmit={track} style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
        <input value={orderNo} onChange={e => setOrderNo(e.target.value)} placeholder="e.g. KB482913"
          style={{ flex: 1, minWidth: 200, padding: "13px 14px", border: "1px solid #0B0B0C", fontSize: 13.5, outline: "none" }} />
        <button className="kb-btn-gold" type="submit">Track</button>
      </form>

      {result && (
        <div>
          <div className="kb-tracked" style={{ fontSize: 11, color: "#8a7a55", marginBottom: 20, textAlign: "center" }}>Order {result.no}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STAGES.map((s, i) => (
              <div key={s} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: i <= result.stage ? "#0B0B0C" : "#e5ddc9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i <= result.stage && <Check size={12} color="#C6A664" />}
                  </div>
                  {i < STAGES.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 34, background: i < result.stage ? "#0B0B0C" : "#e5ddc9" }} />}
                </div>
                <div style={{ paddingBottom: 30 }}>
                  <div style={{ fontSize: 14.5, fontWeight: i <= result.stage ? 500 : 400, color: i <= result.stage ? "#161513" : "#a8a08c" }}>{s}</div>
                  {i === result.stage && <div style={{ fontSize: 12, color: "#8a7a55", marginTop: 2 }}>Current status</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ ABOUT PAGE ------------------------------ */

function AboutPage({ nav }) {
  return (
    <div>
      <div style={{ position: "relative", height: 420, overflow: "hidden" }}>
        <ProductImage src="https://loremflickr.com/1400/700/mountains,valley,pakistan?lock=777" alt="Parachinar valley" style={{ width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,11,12,0.55)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#F1ECDF", textAlign: "center", padding: 24 }}>
          <span className="kb-tracked" style={{ fontSize: 11, color: "#C6A664" }}>Our Story</span>
          <h1 className="kb-serif" style={{ fontSize: 44, margin: "10px 0 0" }}>From the Valleys of Kurram</h1>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "70px 24px" }}>
        <p className="kb-serif" style={{ fontSize: 24, lineHeight: 1.6, textAlign: "center", color: "#3a362f" }}>
          "Kainat" means universe. It's a name chosen for a woman who carries her own — her heritage, her home, her horizon — wherever she goes.
        </p>
        <ConstellationDivider />
        <div style={{ fontSize: 15, lineHeight: 2, color: "#3a362f" }}>
          <p>Kainat Bano began in Parachinar, the heart of Kurram District in Khyber Pakhtunkhwa — a region known for its dramatic mountains, its clear night skies, and a tradition of embroidery and textile craft passed down through generations of women.</p>
          <p>We started with a simple belief: that luxury fashion doesn't have to come only from the country's biggest cities. Every Kainat Bano piece is designed and finished by artisans working from our home region, using techniques of hand embellishment, karandi weaving and embroidery that are part of the everyday life of Kurram District.</p>
          <p>Today, Kainat Bano ships nationwide and internationally, but the atelier hasn't moved. Every unstitched lawn suit, every bridal gown, every winter shawl still begins the same way it always has — with a needle, a length of fabric, and the mountains outside the window.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 26, marginTop: 56, textAlign: "center" }}>
          {[
            { t: "2019", s: "Founded in Parachinar" },
            { t: "50+", s: "Artisans employed locally" },
            { t: "40k+", s: "Customers across Pakistan" },
            { t: "6", s: "Signature collections a year" },
          ].map(stat => (
            <div key={stat.t}>
              <div className="kb-serif" style={{ fontSize: 40, color: "#C6A664" }}>{stat.t}</div>
              <div style={{ fontSize: 12.5, color: "#78716a", marginTop: 4 }}>{stat.s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#0B0B0C", color: "#F1ECDF", padding: "60px 24px", textAlign: "center" }}>
        <h2 className="kb-serif" style={{ fontSize: 30, marginBottom: 14 }}>Discover the Collection</h2>
        <button className="kb-btn-gold" style={{ background: "#C6A664", color: "#0B0B0C", border: "1px solid #C6A664" }} onClick={() => nav.goTo("shop")}>Shop Now</button>
      </div>
    </div>
  );
}

/* ------------------------------ CONTACT PAGE ------------------------------ */

function ContactPage({ nav }) {
  const [sent, setSent] = useState(false);
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 90px" }}>
      <Breadcrumb items={["Home", "Contact"]} nav={nav} />
      <h1 className="kb-serif" style={{ fontSize: 40, margin: "10px 0 10px" }}>Get in Touch</h1>
      <p style={{ color: "#78716a", fontSize: 14, marginBottom: 40, maxWidth: 560 }}>We'd love to hear from you — whether it's about an order, a custom stitching request, or a partnership.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 50 }} className="kb-cart-grid">
        <div>
          <ContactRow icon={MapPin} label="Studio Address" value="Main Bazaar, Parachinar, Kurram District, Khyber Pakhtunkhwa, Pakistan" />
          <ContactRow icon={Phone} label="Phone" value="+92 300 1234567" />
          <ContactRow icon={Mail} label="Email" value="hello@kainatbano.pk" />
          <ContactRow icon={Instagram} label="Instagram" value="@kainatbano.pk" />
          <div style={{ marginTop: 30, height: 200, background: "#F1ECDF", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a7a55", fontSize: 12.5 }}>
            <MapPin size={16} style={{ marginRight: 6 }} /> Map — Parachinar, Kurram District
          </div>
        </div>
        <div>
          {sent ? (
            <div style={{ padding: 30, background: "#F1ECDF", textAlign: "center" }}>
              <Check size={26} color="#C6A664" />
              <p style={{ marginTop: 10, fontSize: 14 }}>Thank you — your message has been sent. We'll respond within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Your Name" required />
                <Field label="Email Address" type="email" required />
              </div>
              <Field label="Subject" required />
              <div style={{ marginBottom: 14 }}>
                <label className="kb-tracked" style={{ fontSize: 11.5, color: "#78716a", display: "block", marginBottom: 6 }}>Message *</label>
                <textarea required rows={6} style={{ width: "100%", padding: 12, border: "1px solid rgba(11,11,12,0.25)", fontSize: 13.5, outline: "none", resize: "vertical" }} />
              </div>
              <button className="kb-btn-gold" type="submit">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
      <Icon size={18} color="#C6A664" strokeWidth={1.4} style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <div className="kb-tracked" style={{ fontSize: 10.5, color: "#8a7a55" }}>{label}</div>
        <div style={{ fontSize: 14, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

/* ------------------------------ FAQ PAGE ------------------------------ */

function FaqPage({ nav }) {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "50px 24px 100px" }}>
      <Breadcrumb items={["Home", "FAQ"]} nav={nav} />
      <h1 className="kb-serif" style={{ fontSize: 40, margin: "10px 0 30px", textAlign: "center" }}>Frequently Asked Questions</h1>
      <FaqAccordion items={FAQS} />
    </div>
  );
}

function FaqAccordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {items.map((f, i) => (
        <div key={f.q} style={{ borderBottom: "1px solid rgba(11,11,12,0.12)" }}>
          <div onClick={() => setOpen(open === i ? -1 : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 4px", cursor: "pointer" }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{f.q}</span>
            <ChevronDown size={17} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform .3s", color: "#C6A664" }} />
          </div>
          {open === i && <p style={{ padding: "0 4px 20px", fontSize: 13.5, color: "#3a362f", lineHeight: 1.8 }}>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ MANAGE CATALOG (ADMIN) ------------------------------ */

function ManageCatalogPage({ nav }) {
  const [dragOver, setDragOver] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const { products, warnings } = parseCSVText(String(reader.result));
      setWarnings(warnings);
      if (products.length) nav.importCatalog(products);
      else nav.showToast("No valid rows found — check the column headers");
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px 100px" }}>
      <Breadcrumb items={["Home", "Manage Catalog"]} nav={nav} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
        <Settings size={22} color="#C6A664" />
        <h1 className="kb-serif" style={{ fontSize: 34, margin: 0 }}>Manage Product Catalog</h1>
      </div>
      <p style={{ color: "#78716a", fontSize: 13.5, marginTop: 8, marginBottom: 30, maxWidth: 620 }}>
        This storefront is currently showing <strong>{nav.products.length} products</strong> from
        {nav.catalogSource === "imported" ? " your imported catalog." : " the sample placeholder set."}
        Swap in your real products from Excel or Google Sheets by exporting a CSV and uploading it below —
        the design, layout and every page stay exactly the same.
      </p>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
        onClick={() => fileRef.current?.click()}
        style={{ border: `1.5px dashed ${dragOver ? "#C6A664" : "rgba(11,11,12,0.3)"}`, padding: "50px 20px", textAlign: "center", cursor: "pointer", background: dragOver ? "#F1ECDF" : "transparent" }}>
        <Upload size={26} color="#C6A664" strokeWidth={1.3} />
        <p style={{ margin: "12px 0 4px", fontSize: 14.5 }}>Drop your CSV file here, or click to browse</p>
        <p style={{ fontSize: 12, color: "#8a7a55" }}>{fileName || "Exported from Excel, Google Sheets, or Numbers as .csv"}</p>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => handleFile(e.target.files?.[0])} />
      </div>

      {warnings.length > 0 && (
        <div style={{ marginTop: 18, padding: 16, background: "#F1ECDF", fontSize: 12.5, color: "#6e5a2e" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, fontWeight: 500 }}>
            <AlertCircle size={15} /> {warnings.length} row(s) skipped
          </div>
          {warnings.slice(0, 6).map((w, i) => <div key={i}>{w}</div>)}
        </div>
      )}

      <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
        <button className="kb-btn-outline" onClick={() => downloadCSV(productsToCSV(nav.products), "kainat-bano-catalog-template.csv")}>
          Download Current Catalog as CSV
        </button>
        <button className="kb-btn-outline" style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={nav.resetCatalog}>
          <RefreshCw size={13} /> Restore Sample Placeholder Products
        </button>
      </div>

      <div style={{ marginTop: 46 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <FileSpreadsheet size={17} color="#C6A664" />
          <h3 className="kb-tracked" style={{ fontSize: 12, margin: 0 }}>CSV Column Reference</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#0B0B0C", color: "#E8CE8F" }}>
                <th style={{ textAlign: "left", padding: "9px 12px" }}>Column</th>
                <th style={{ textAlign: "left", padding: "9px 12px" }}>Required</th>
                <th style={{ textAlign: "left", padding: "9px 12px" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {CSV_SPEC.map(c => (
                <tr key={c.col} style={{ borderBottom: "1px solid rgba(11,11,12,0.08)" }}>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace" }}>{c.col}</td>
                  <td style={{ padding: "9px 12px", color: c.required ? "#a34b2a" : "#8a7a55" }}>{c.required ? "Required" : "Optional"}</td>
                  <td style={{ padding: "9px 12px", color: "#3a362f" }}>{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: "#8a7a55", marginTop: 14 }}>
          Tip: click "Download Current Catalog as CSV" above to get a ready-made template with the right headers —
          open it in Excel, replace the sample rows with your real products, save as CSV, and upload it here again.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ FOOTER ------------------------------ */

function Footer({ nav }) {
  return (
    <footer style={{ background: "#0B0B0C", color: "#D9D2C4", padding: "60px 24px 0" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 40 }} className="kb-footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ConstellationMark />
            <span className="kb-serif" style={{ fontSize: 24, color: "#F1ECDF" }}>Kainat Bano</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, marginTop: 14, maxWidth: 300 }}>
            Premium women's fashion, handcrafted in Parachinar, Kurram District, Khyber Pakhtunkhwa. Heritage, cut for the modern woman.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            {[Instagram, Facebook].map((I, i) => (
              <div key={i} style={{ width: 34, height: 34, border: "1px solid #C6A664", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <I size={15} color="#C6A664" />
              </div>
            ))}
          </div>
        </div>

        <FooterCol title="Shop" items={[
          ["All Products", () => nav.goTo("shop")],
          ["New Arrivals", () => nav.goTo("shop", { cat: "new" })],
          ["Best Sellers", () => nav.goTo("shop", { cat: "bestseller" })],
          ["Sale", () => nav.goTo("shop", { cat: "sale" })],
        ]} />

        <FooterCol title="Support" items={[
          ["Contact Us", () => nav.goTo("contact")],
          ["Track Order", () => nav.goTo("tracking")],
          ["FAQs", () => nav.goTo("faq")],
          ["Sign In", () => nav.goTo("login")],
        ]} />

        <div>
          <div className="kb-tracked" style={{ fontSize: 11, color: "#C6A664", marginBottom: 16 }}>Visit Our Studio</div>
          <div style={{ fontSize: 13, lineHeight: 2 }}>
            Main Bazaar, Parachinar<br />
            Kurram District, Khyber Pakhtunkhwa<br />
            Pakistan
            <div style={{ marginTop: 10 }}>+92 300 1234567</div>
            <div>hello@kainatbano.pk</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1320, margin: "40px auto 0", borderTop: "1px solid rgba(232,206,143,0.15)", padding: "20px 0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12, color: "#8a7a55" }}>
        <span>© 2026 Kainat Bano. All rights reserved.</span>
        <span style={{ display: "flex", gap: 18 }}>
          <span>Designed and stitched in Parachinar, Pakistan</span>
          <span onClick={() => nav.goTo("manage-catalog")} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#C6A664" }}>Manage Catalog</span>
        </span>
      </div>
      <style>{`@media (max-width: 820px) { .kb-footer-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="kb-tracked" style={{ fontSize: 11, color: "#C6A664", marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(([label, onClick]) => (
          <span key={label} onClick={onClick} style={{ fontSize: 13, cursor: "pointer" }}>{label}</span>
        ))}
      </div>
    </div>
  );
}
