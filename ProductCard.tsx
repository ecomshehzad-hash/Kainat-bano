"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-charcoal card-hairline">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
          />
          <Image
            src={product.images[1] ?? product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100"
          />

          {product.isNew && (
            <span className="absolute top-3 left-3 bg-gold text-ink text-[10px] tracking-widest2 uppercase px-2.5 py-1">
              New
            </span>
          )}
          {product.compareAtPrice && (
            <span className="absolute top-3 left-3 bg-bone text-ink text-[10px] tracking-widest2 uppercase px-2.5 py-1" style={{ marginTop: product.isNew ? 28 : 0 }}>
              Sale
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
              <span className="text-[11px] tracking-widest2 uppercase text-bone border border-bone/40 px-3 py-1.5">
                Sold Out
              </span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ink/60 backdrop-blur flex items-center justify-center hover:bg-ink transition-colors"
          >
            <Heart size={15} className={wished ? "fill-gold text-gold" : "text-bone"} />
          </button>
        </div>

        <div className="pt-4">
          <div className="text-[10px] tracking-widest2 uppercase text-smoke mb-1">{product.category}</div>
          <div className="font-display text-[16px] leading-snug mb-1.5 group-hover:text-gold transition-colors">
            {product.name}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>${product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-smoke line-through text-xs">${product.compareAtPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
