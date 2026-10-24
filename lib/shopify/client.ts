/**
 * Low-level Storefront API transport shared by the catalog client
 * (storefront.ts) and the checkout server action (checkout.ts).
 *
 * Two modes, picked automatically from the environment:
 *
 *  - Private token (SHOPIFY_STOREFRONT_PRIVATE_TOKEN set) — recommended.
 *    Token from the Shopify "Headless" sales channel. Works while the online
 *    store is still password-protected and unlocks product tags, metafields
 *    and customer features. Server-side only: never expose it to the browser.
 *
 *  - Tokenless (only SHOPIFY_STORE_DOMAIN set). Products, collections and
 *    cart work, but Shopify rejects every request with "Online Store channel
 *    is locked" while the store has its "Coming soon" password enabled.
 */

export const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
/** Full store origin; SHOPIFY_STORE_ORIGIN only overrides it for local mock testing. */
export const SHOPIFY_ORIGIN = process.env.SHOPIFY_STORE_ORIGIN ?? `https://${SHOPIFY_DOMAIN}`;
const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
export const API_VERSION = "2026-01";

export const hasPrivateToken = Boolean(PRIVATE_TOKEN);

type FetchOptions = {
  /** Buyer's IP — required by Shopify for buyer-initiated private-token requests (e.g. checkout). */
  buyerIp?: string | null;
  /** Next.js cache revalidation in seconds; omit for no-store. */
  revalidate?: number;
};

export async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  { buyerIp, revalidate }: FetchOptions = {}
): Promise<T> {
  if (!SHOPIFY_DOMAIN) {
    throw new Error("SHOPIFY_STORE_DOMAIN is not set.");
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (PRIVATE_TOKEN) {
    headers["Shopify-Storefront-Private-Token"] = PRIVATE_TOKEN;
    if (buyerIp) headers["Shopify-Storefront-Buyer-IP"] = buyerIp;
  }

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" as const }),
  });

  const json = (await res.json()) as { data: T; errors?: unknown };
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}
