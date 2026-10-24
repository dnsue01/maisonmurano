import type { Collection, Product, ShopifyClient } from "./types";
import { SHOPIFY_DOMAIN, SHOPIFY_ORIGIN } from "./client";

/**
 * Tokenless catalog client over the Online Store's public `products.json`
 * endpoints — the same approach as prendas-payas-web. Used when the store is
 * configured but there is no Storefront private token.
 *
 * While the store still has its "Coming soon" password, set
 * SHOPIFY_STOREFRONT_PASSWORD: we log in once through /password and send the
 * resulting session cookie. Once the store opens, the variable can go.
 *
 * Prices, stock, images and texts are read live from Shopify and cached for
 * REVALIDATE seconds, so edits in the Shopify admin show up on their own.
 */

const PASSWORD = process.env.SHOPIFY_STOREFRONT_PASSWORD;
const REVALIDATE = 300;
const EUR = "EUR";

type RawProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  tags: string[] | string;
  created_at: string;
  images: { src: string; alt: string | null }[];
  variants: {
    id: number;
    title: string;
    available: boolean;
    requires_shipping: boolean;
    price: string;
    compare_at_price: string | null;
  }[];
};

const base = () => SHOPIFY_ORIGIN;

let cookie: { value: string; expires: number } | null = null;

/** Session cookie that unlocks a password-protected storefront (cached for 1 h). */
async function passwordCookie(): Promise<string | undefined> {
  if (!PASSWORD) return undefined;
  if (cookie && cookie.expires > Date.now()) return cookie.value;
  const res = await fetch(`${base()}/password`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ form_type: "storefront_password", utf8: "✓", password: PASSWORD }),
    cache: "no-store",
  });
  const value = res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  cookie = { value, expires: Date.now() + 60 * 60 * 1000 };
  return value;
}

async function fetchProducts(path: string): Promise<RawProduct[]> {
  if (!SHOPIFY_DOMAIN) throw new Error("SHOPIFY_STORE_DOMAIN is not set.");
  const sessionCookie = await passwordCookie();
  // country=ES: without it Shopify answers for the caller's country, and from
  // a Vercel region outside Spain every size came back as sold out.
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${base()}${path}${sep}limit=250&country=ES`, {
    headers: sessionCookie ? { cookie: sessionCookie } : undefined,
    next: { revalidate: REVALIDATE },
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Shopify ${path} responded ${res.status}.`);
  const data = (await res.json()) as { products: RawProduct[] };
  return data.products;
}

/** Shopify description HTML → plain text, one line per list item / paragraph. */
function htmlToText(html: string | null): string {
  return (html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

function mapProduct(p: RawProduct, bestSellerRank: number, descriptionEn?: string): Product {
  const variants = p.variants.map((v) => ({
    id: `gid://shopify/ProductVariant/${v.id}`,
    title: v.title,
    available: v.available,
    price: { amount: Number(v.price), currencyCode: EUR },
  }));
  const cheapest = p.variants.reduce((a, b) => (Number(b.price) < Number(a.price) ? b : a));
  const compareAt = Number(cheapest.compare_at_price ?? 0);
  const descriptionEs = htmlToText(p.body_html);
  return {
    id: `gid://shopify/Product/${p.id}`,
    handle: p.handle,
    title: p.title,
    description: descriptionEn ?? descriptionEs,
    descriptionEs,
    tags: Array.isArray(p.tags) ? p.tags : p.tags.split(",").map((t) => t.trim()).filter(Boolean),
    price: { amount: Number(cheapest.price), currencyCode: EUR },
    compareAtPrice:
      compareAt > Number(cheapest.price) ? { amount: compareAt, currencyCode: EUR } : undefined,
    images: p.images.map((i) => ({ url: i.src, altText: i.alt ?? p.title })),
    variants,
    available: variants.some((v) => v.available),
    isGiftCard: !p.variants.some((v) => v.requires_shipping),
    bestSellerRank,
    createdAt: p.created_at,
  };
}

/** English descriptions keyed by handle. Non-fatal: falls back to Spanish. */
async function englishDescriptions(): Promise<Map<string, string>> {
  try {
    const products = await fetchProducts("/en/products.json");
    return new Map(products.map((p) => [p.handle, htmlToText(p.body_html)]));
  } catch {
    return new Map();
  }
}

async function collectionProducts(handle: string): Promise<Product[]> {
  const [products, en] = await Promise.all([
    fetchProducts(`/collections/${handle}/products.json?sort_by=best-selling`),
    englishDescriptions(),
  ]);
  return products.map((p, i) => mapProduct(p, i, en.get(p.handle)));
}

export const ajaxClient: ShopifyClient = {
  async getProducts() {
    return collectionProducts("all");
  },

  async getProduct(handle) {
    const products = await collectionProducts("all");
    return products.find((p) => p.handle === handle) ?? null;
  },

  async getCollection(handle): Promise<Collection | null> {
    const products = await collectionProducts(handle);
    if (products.length === 0 && handle !== "all") return null;
    return { handle, title: handle === "all" ? "Todos los productos" : handle, products };
  },
};

/**
 * Tokenless checkout: Shopify cart permalink (/cart/<variantId>:<qty>,...),
 * optionally with the buyer's email prefilled and a discount code applied.
 */
export function cartPermalink(
  lines: { variantId: string; quantity: number }[],
  { email, discount }: { email?: string | null; discount?: string | null } = {}
): string {
  const items = lines
    .map((l) => `${l.variantId.split("/").pop()}:${l.quantity}`)
    .join(",");
  const params = new URLSearchParams();
  if (email) params.set("checkout[email]", email);
  if (discount) params.set("discount", discount);
  const query = params.toString();
  return `${base()}/cart/${items}${query ? `?${query}` : ""}`;
}
