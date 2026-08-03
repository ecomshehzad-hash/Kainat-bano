# Kainat Bano — Luxury E-Commerce

A production-ready storefront built with Next.js 14 (App Router), React, TypeScript and Tailwind CSS, in a black / white / gold luxury theme.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project Structure

```
app/
  page.tsx                Home
  shop/                    Shop All (search, filters, sort)
  categories/              Category index + [slug] category pages
  product/[slug]/          Product detail (zoom, reviews, related)
  wishlist/                Wishlist
  cart/                    Shopping cart
  checkout/                Checkout flow
  login/ register/         Auth UI (not yet wired to a backend)
  track-order/             Order tracking
  contact/ about/          Content pages
  privacy-policy/ terms/   Legal pages
  admin/                   Admin dashboard (demo data)
  sitemap.ts robots.ts     SEO
components/                Reusable UI (Header, Footer, ProductCard, Filters, etc.)
context/                   Cart & Wishlist state (persisted to localStorage)
lib/                       Product data, types, coupon logic
```

## Replacing the Placeholder Catalog

All product data lives in `lib/products.ts` in a `RAW_PRODUCTS` array. Replace
it with your real catalog — from a CSV/Excel export, a headless CMS, or a
database query — and every page (Shop, Categories, Product, search, filters,
related products) updates automatically since they all read from this one
source. See the comment at the top of that file for a suggested Excel → JSON
workflow.

## What's Wired Up vs. What Needs a Backend

**Fully functional (client-side):**
- Cart & wishlist (persisted per-browser via localStorage)
- Search, category/price/stock filters, sorting
- Product image zoom, size/color selection
- Coupon codes (`WELCOME10`, `KAINAT20`, `FREESHIP` — see `lib/coupons.ts`)
- Reviews (add a review, stored in memory for the session)
- Order tracking UI with a mock progress timeline

**UI built, needs a real backend before launch:**
- Checkout payment (wire to Stripe, or your PSP of choice)
- Login / Register (wire to NextAuth, Clerk, Firebase Auth, etc.)
- Admin Dashboard (currently reads local mock data — connect to your
  database and put it behind real authentication; it's not access-controlled
  in this scaffold)
- Newsletter and Contact forms (wire to your email provider / API route)
- Order tracking (currently reads the order ID from the URL — connect it to
  your real order-management system)

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

Or push this repo to GitHub and import it at vercel.com/new — it will
detect Next.js automatically. Set `NEXT_PUBLIC_SITE_URL` (and any backend
keys you add) in your Vercel project's Environment Variables.
