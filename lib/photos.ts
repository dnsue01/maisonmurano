import { designNumbers, isCutout, type Product } from "@/lib/shopify";

export type Photo = { src: string; alt: string; handle: string; title: string; n: number };

const NOT_EDITORIAL = /size.?chart|sizechart|caja|box/i;

/** On-model / lifestyle shots pulled from the Shopify product galleries. */
export function editorialPhotos(products: Product[], perProduct = 2): Photo[] {
  const numbers = designNumbers(products);
  const lanes = products.map((p) =>
    p.images
      .slice(1)
      .filter((img) => !isCutout(img.url) && !NOT_EDITORIAL.test(img.url))
      .slice(0, perProduct)
      .map((img) => ({ src: img.url, alt: img.altText || p.title, handle: p.handle, title: p.title, n: numbers[p.handle] }))
  );
  // Interleave so neighbouring photos show different pieces.
  const out: Photo[] = [];
  for (let i = 0; i < perProduct; i++) for (const lane of lanes) if (lane[i]) out.push(lane[i]);
  return out;
}
