import type { Money, ProductImage } from "@/lib/shopify";

export type SearchItem = {
  handle: string;
  title: string;
  price: Money;
  image?: ProductImage;
  tags: string[];
};

export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function matchesQuery(text: string, query: string) {
  const haystack = normalize(text);
  return normalize(query)
    .split(/\s+/)
    .every((w) => haystack.includes(w));
}
