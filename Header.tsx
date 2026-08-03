"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { CATEGORIES } from "@/lib/products";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { count } = useCart();
  const { ids } = useWishlist();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-gold/15">
      {/* Top announcement bar */}
      <div className="bg-gold text-ink text-center text-[11px] tracking-widest2 uppercase py-2 px-4">
        Complimentary shipping on orders over $250
      </div>

      <div className="container-lux flex items-center justify-between h-20">
        <button className="lg:hidden text-bone" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Link href="/" className="font-display text-2xl md:text-3xl tracking-wide select-none">
          KAINAT <span className="shimmer-text italic">BANO</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] tracking-widest2 uppercase text-bone/80 hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button aria-label="Search" onClick={() => setSearchOpen((s) => !s)} className="text-bone hover:text-gold transition-colors">
            <Search size={19} />
          </button>
          <Link href="/login" aria-label="Account" className="hidden sm:block text-bone hover:text-gold transition-colors">
            <User size={19} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative text-bone hover:text-gold transition-colors">
            <Heart size={19} />
            {ids.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {ids.length}
              </span>
            )}
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-bone hover:text-gold transition-colors">
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-gold/15 bg-charcoal">
          <form onSubmit={submitSearch} className="container-lux py-4 flex items-center gap-3">
            <Search size={17} className="text-gold" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search abayas, dresses, hijabs..."
              className="flex-1 bg-transparent outline-none text-bone placeholder:text-smoke text-sm py-1"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-smoke hover:text-gold">
              <X size={17} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-ink/98 backdrop-blur flex flex-col">
          <div className="container-lux flex items-center justify-between h-20 border-b border-gold/15">
            <span className="font-display text-2xl">KAINAT BANO</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <nav className="container-lux flex flex-col gap-6 pt-10">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="font-display text-3xl">
                {l.label}
              </Link>
            ))}
            <div className="gold-line my-4" />
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/categories/${c.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest2 uppercase text-smoke hover:text-gold"
              >
                {c}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
