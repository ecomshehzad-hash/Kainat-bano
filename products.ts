import { Product, Category, Review } from "./types";

/**
 * PLACEHOLDER CATALOG
 * ---------------------------------------------------------------
 * This file ships with sample products so the site is fully
 * functional out of the box. Replace `RAW_PRODUCTS` below with
 * your real catalog (e.g. generated from your product Excel/CSV)
 * and everything else — Shop, Categories, Product pages, search,
 * filters, related products — will pick it up automatically.
 *
 * To import from your Excel file:
 *   1. Export it as CSV (Name, Price, Category, Description,
 *      Sizes, Colors, Image URLs, InStock).
 *   2. Run it through a small Node script (see /scripts/README.md
 *      you can add) that maps each row to this Product shape.
 *   3. Replace RAW_PRODUCTS with the generated array, or fetch
 *      from a database / CMS at build time instead.
 * ---------------------------------------------------------------
 */

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=1000&q=80&auto=format&fit=crop`;

const POOL = [
  "photo-1490481651871-ab68de25d43d",
  "photo-1591047139829-d91aecb6caea",
  "photo-1509631179647-0177331693ae",
  "photo-1487222477894-8943e31ef7b6",
  "photo-1594633312681-425c7b97ccd1",
  "photo-1551028719-00167b16eac5",
  "photo-1516762689617-e1cffcef479d",
  "photo-1524758631624-e2822e304c36",
  "photo-1445205170230-053b83016050",
  "photo-1515886657613-9f3515b0c78f",
  "photo-1483985988355-763728e1935b",
  "photo-1590874103328-eac38a683ce7",
  "photo-1544022613-e87ca75a784a",
  "photo-1521572163474-6864f9cf17ab",
  "photo-1490114538077-0a7f8cb49891",
  "photo-1434389677669-e08b4cac3105",
];

interface RawProduct {
  name: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  colors: string[];
  sizes: string[];
  imgIndex: [number, number];
  description: string;
  details: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

const RAW_PRODUCTS: RawProduct[] = [
  // Abayas
  { name: "Noor Silk Kaftan Abaya", category: "Abayas", price: 185, compareAtPrice: 230, colors: ["Black", "Charcoal"], sizes: ["S", "M", "L", "XL"], imgIndex: [0, 1], description: "A fluid open-front abaya in mulberry silk, finished with a hand-stitched gold trim along the placket.", details: ["100% mulberry silk", "Hand-finished gold trim", "Dry clean only", "Made in Pakistan"], isFeatured: true },
  { name: "Zahra Embroidered Abaya", category: "Abayas", price: 240, colors: ["Black", "Emerald"], sizes: ["S", "M", "L", "XL"], imgIndex: [2, 3], description: "Nida fabric abaya with hand-embroidered gold thread detailing across the sleeves and hem.", details: ["Premium Nida fabric", "Hand embroidery", "Full length, relaxed fit"], isNew: true },
  { name: "Layla Butterfly Abaya", category: "Abayas", price: 165, colors: ["Black"], sizes: ["S", "M", "L", "XL", "XXL"], imgIndex: [4, 5], description: "A structured butterfly-cut abaya with a matching inner slip and gold-tipped belt.", details: ["Includes matching belt", "Wide butterfly sleeves", "Machine washable"] },
  { name: "Amara Crepe Abaya", category: "Abayas", price: 210, colors: ["Black", "Bone"], sizes: ["S", "M", "L"], imgIndex: [6, 7], description: "Minimal, structured crepe abaya with a clean front seam and no embellishment — for everyday elegance.", details: ["Premium crepe fabric", "Structured silhouette", "Pairs with any hijab"] },

  // Dresses
  { name: "Aster Wrap Dress", category: "Dresses", price: 340, colors: ["Moss", "Ink"], sizes: ["XS", "S", "M", "L"], imgIndex: [8, 9], description: "A crepe wrap dress that moves the way the body does, finished with a concealed interior tie.", details: ["100% silk crepe", "Interior tie closure", "Midi length"], isFeatured: true },
  { name: "Halcyon Midi Skirt Set", category: "Dresses", price: 280, colors: ["Bone", "Ink"], sizes: ["XS", "S", "M", "L"], imgIndex: [10, 11], description: "A structured A-line skirt in matte wool-blend, paired with a coordinating fitted top.", details: ["Wool-blend fabric", "Hand-finished seams", "Two-piece set"] },
  { name: "Selene Evening Gown", category: "Dresses", price: 520, compareAtPrice: 610, colors: ["Emerald", "Black"], sizes: ["XS", "S", "M", "L", "XL"], imgIndex: [12, 13], description: "A floor-length column gown in duchess satin with a hand-draped bodice.", details: ["Duchess satin", "Fully lined", "Hidden back zip"], isNew: true },
  { name: "Marielle Day Dress", category: "Dresses", price: 195, colors: ["Bone", "Charcoal"], sizes: ["XS", "S", "M", "L"], imgIndex: [14, 15], description: "An easy, unlined shift dress in washed linen for warm-weather days.", details: ["100% linen", "Relaxed fit", "Machine washable"] },

  // Formal Wear
  { name: "Zarqash Embellished Formal Dress", category: "Formal Wear", price: 1250, colors: ["Emerald", "Ink", "Gold"], sizes: ["XS", "S", "M", "L", "XL"], imgIndex: [13, 14], description: "Hand-embellished pure silk chiffon formal dress with zardozi and dabka embroidery across the bodice and dupatta. Roughly forty hours of hand work per piece.", details: ["Pure silk chiffon", "Hand zardozi & dabka embroidery", "Matching dupatta & inner slip included", "Made to order"], isFeatured: true },
  { name: "Rowan Wool Blazer Set", category: "Formal Wear", price: 520, colors: ["Moss", "Ink"], sizes: ["XS", "S", "M", "L", "XL"], imgIndex: [5, 0], description: "A single-button blazer with a soft, unpadded shoulder — boardroom-structured, evening-soft.", details: ["Fine wool", "Unpadded shoulder", "Fully lined chest panel"] },
  { name: "Imaan Sequined Gown", category: "Formal Wear", price: 890, colors: ["Gold", "Black"], sizes: ["S", "M", "L"], imgIndex: [9, 12], description: "An all-over hand-sequined gown with a fitted bodice and dramatic floor-sweep hem.", details: ["Hand-applied sequins", "Boned bodice", "Made to order, 2-3 weeks"], isNew: true },
  { name: "Sable Tailored Suit", category: "Formal Wear", price: 380, colors: ["Ink", "Stone"], sizes: ["XS", "S", "M", "L"], imgIndex: [7, 2], description: "A two-piece tailored trouser suit cut from Italian wool, built for formal occasions that call for restraint.", details: ["Italian wool", "Fully lined jacket", "Straight-leg trouser"] },

  // Casual Wear
  { name: "Linden Silk Blouse", category: "Casual Wear", price: 210, colors: ["Bone", "Gold"], sizes: ["XS", "S", "M", "L"], imgIndex: [6, 8], description: "A weighted silk twill blouse, heavy enough to drape instead of cling.", details: ["Silk twill", "Adjustable collar", "Dry clean recommended"] },
  { name: "Marlowe Cashmere Sweater", category: "Casual Wear", price: 390, colors: ["Stone", "Moss"], sizes: ["XS", "S", "M", "L", "XL"], imgIndex: [8, 9], description: "Two-ply cashmere knit with a dropped shoulder for easy layering.", details: ["100% two-ply cashmere", "Dropped shoulder", "Hand wash cold"] },
  { name: "Everyday Wide-Leg Trouser", category: "Casual Wear", price: 165, colors: ["Ink", "Bone"], sizes: ["XS", "S", "M", "L", "XL"], imgIndex: [2, 4], description: "A relaxed wide-leg trouser in brushed cotton twill — the everyday essential.", details: ["Cotton twill", "Elasticated back waist", "Machine washable"] },
  { name: "Soft Knit Loungeset", category: "Casual Wear", price: 145, colors: ["Bone", "Charcoal"], sizes: ["S", "M", "L"], imgIndex: [9, 8], description: "A ribbed knit two-piece for at-home days that still feel put together.", details: ["Ribbed knit", "Relaxed fit", "Two-piece set"], isNew: true },

  // Hijabs
  { name: "Noor Chiffon Hijab", category: "Hijabs", price: 35, colors: ["Black", "Bone", "Emerald"], sizes: ["One Size"], imgIndex: [3, 6], description: "A lightweight, opaque chiffon hijab that drapes without slipping.", details: ["Premium chiffon", "Non-slip finish", "175cm x 75cm"], isFeatured: true },
  { name: "Modal Jersey Hijab", category: "Hijabs", price: 28, colors: ["Black", "Stone", "Ink"], sizes: ["One Size"], imgIndex: [1, 3], description: "Soft modal jersey with natural stretch for an easy, no-pin wrap.", details: ["95% modal, 5% elastane", "No-pin wrap", "Machine washable"] },
  { name: "Gold-Edge Silk Hijab", category: "Hijabs", price: 65, colors: ["Black", "Emerald"], sizes: ["One Size"], imgIndex: [11, 13], description: "Pure silk hijab finished with a hand-rolled gold-thread edge.", details: ["100% silk", "Hand-rolled edge", "180cm x 80cm"] },
  { name: "Everyday Cotton Hijab Set", category: "Hijabs", price: 45, colors: ["Bone", "Charcoal", "Black"], sizes: ["One Size"], imgIndex: [6, 1], description: "A set of three breathable cotton hijabs for daily wear.", details: ["100% cotton", "Set of 3", "Machine washable"] },

  // Accessories
  { name: "Corvina Leather Belt", category: "Accessories", price: 145, colors: ["Ink", "Gold"], sizes: ["S/M", "L/XL"], imgIndex: [10, 11], description: "Full-grain leather over a solid brass buckle that darkens beautifully with wear.", details: ["Full-grain leather", "Solid brass buckle", "5 hand-punched holes"] },
  { name: "Gold Thread Clutch", category: "Accessories", price: 210, colors: ["Black", "Gold"], sizes: ["One Size"], imgIndex: [15, 10], description: "A structured evening clutch hand-embroidered with fine gold thread.", details: ["Hand embroidery", "Detachable chain strap", "Satin lining"], isNew: true },
  { name: "Pearl Drop Earrings", category: "Accessories", price: 95, colors: ["Gold"], sizes: ["One Size"], imgIndex: [11, 15], description: "Freshwater pearl drops set in gold-plated sterling silver.", details: ["Gold-plated sterling silver", "Freshwater pearl", "Hypoallergenic"] },
  { name: "Silk Scarf, Signature Print", category: "Accessories", price: 85, colors: ["Emerald", "Ink"], sizes: ["One Size"], imgIndex: [3, 15], description: "A hand-rolled silk scarf in our signature archive print.", details: ["100% silk twill", "Hand-rolled edge", "90cm x 90cm"], isFeatured: true },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const SAMPLE_REVIEWS: Review[] = [
  { id: "r1", author: "Sana R.", rating: 5, comment: "The fabric quality is exceptional — better than the photos even suggest.", date: "2026-06-14" },
  { id: "r2", author: "Ayesha K.", rating: 4, comment: "Fits true to size, arrived beautifully packaged.", date: "2026-05-30" },
  { id: "r3", author: "Hira M.", rating: 5, comment: "Ordered for a wedding and got so many compliments. Worth every rupee.", date: "2026-05-02" },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p, i) => ({
  id: String(i + 1),
  slug: slugify(p.name),
  name: p.name,
  category: p.category,
  price: p.price,
  compareAtPrice: p.compareAtPrice,
  colors: p.colors,
  sizes: p.sizes,
  images: [img(POOL[p.imgIndex[0]]), img(POOL[p.imgIndex[1]])],
  description: p.description,
  details: p.details,
  rating: 4.3 + ((i % 5) * 0.1),
  reviewCount: 8 + (i % 6) * 5,
  reviews: SAMPLE_REVIEWS.slice(0, 1 + (i % 3)),
  inStock: i % 11 !== 0,
  isNew: p.isNew,
  isFeatured: p.isFeatured,
}));

export const CATEGORIES: Category[] = [
  "Abayas",
  "Dresses",
  "Formal Wear",
  "Casual Wear",
  "Hijabs",
  "Accessories",
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, count);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getNewArrivals() {
  return PRODUCTS.filter((p) => p.isNew);
}

export function searchProducts(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
