"use client";

import { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/products";

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

interface FiltersProps {
  selectedCategories: Category[];
  onToggleCategory: (c: Category) => void;
  maxPrice: number;
  priceLimit: number;
  onPriceChange: (v: number) => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  inStockOnly: boolean;
  onInStockChange: (v: boolean) => void;
}

export default function Filters({
  selectedCategories,
  onToggleCategory,
  maxPrice,
  priceLimit,
  onPriceChange,
  sort,
  onSortChange,
  inStockOnly,
  onInStockChange,
}: FiltersProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-10">
      <div>
        <div className="eyebrow mb-4">Sort By</div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full bg-charcoal border border-gold/20 text-sm px-3 py-2.5 outline-none focus:border-gold"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div>
        <div className="eyebrow mb-4">Category</div>
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-3 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c)}
                onChange={() => onToggleCategory(c)}
                className="accent-gold w-4 h-4"
              />
              <span className={selectedCategories.includes(c) ? "text-gold" : "text-bone/80"}>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="eyebrow mb-4">Max Price: ${priceLimit}</div>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={10}
          value={priceLimit}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-gold"
        />
      </div>

      <div>
        <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="accent-gold w-4 h-4"
          />
          <span className="text-bone/80">In stock only</span>
        </label>
      </div>
    </aside>
  );
}
