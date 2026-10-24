import { designNumbers, type Product } from "@/lib/shopify";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  catalog,
  quickAdd = false,
}: {
  products: Product[];
  /** Full catalogue, so every design keeps its Nº wherever it is shown. */
  catalog?: Product[];
  quickAdd?: boolean;
}) {
  const numbers = designNumbers(catalog ?? products);
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} n={numbers[product.handle]} quickAdd={quickAdd} priority={i < 2} />
      ))}
    </div>
  );
}
