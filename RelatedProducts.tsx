import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="eyebrow mb-2">You May Also Like</div>
          <h2 className="font-display text-2xl md:text-3xl">Related Pieces</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
