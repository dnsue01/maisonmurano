import { ajaxClient } from "./ajax";
import { hasPrivateToken } from "./client";
import { storefrontClient } from "./storefront";
import type { Product, SortKey } from "./types";

export * from "./types";

/**
 * The single source of product data for the whole app, always the real
 * Shopify store (SHOPIFY_STORE_DOMAIN):
 *  - with a Storefront private token → Storefront API (storefront.ts)
 *  - without one → public products.json endpoints (ajax.ts), unlocked with
 *    SHOPIFY_STOREFRONT_PASSWORD while the store is password-protected.
 */
export const shopify = hasPrivateToken ? storefrontClient : ajaxClient;

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case "bestSelling":
      return copy.sort((a, b) => a.bestSellerRank - b.bestSellerRank);
    case "az":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "za":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "priceAsc":
      return copy.sort((a, b) => a.price.amount - b.price.amount);
    case "priceDesc":
      return copy.sort((a, b) => b.price.amount - a.price.amount);
    case "newest":
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "relevance":
    default:
      return copy;
  }
}

export function formatMoney(amount: number, currencyCode = "EUR", locale = "es") {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-IE", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Flash numbering: each design's Nº is its place in the brand's release
 * history (oldest product = Nº 01), so the number carries real information.
 */
export function designNumbers(products: Product[]): Record<string, number> {
  const ordered = [...products].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return Object.fromEntries(ordered.map((p, i) => [p.handle, i + 1]));
}

export const pad = (n: number) => String(n).padStart(2, "0");

/** Cut-out product shots (transparent PNGs) sit on the paper; photos fill the frame. */
export const isCutout = (url: string) => /\.png(\?|$)/i.test(url);
