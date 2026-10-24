import { SHOPIFY_DOMAIN, SHOPIFY_ORIGIN } from "./client";

/**
 * Legal policies and the size guide live in the Shopify admin. They are read
 * from the store's public storefront (policies have no JSON endpoint, so the
 * policy HTML is extracted from the rendered page) and cached REVALIDATE
 * seconds, so edits in Shopify show up on their own. Always the Spanish
 * originals: the store's /en copies are Shopify's generic template, not a
 * translation of TIER CLUB's own texts.
 */

const REVALIDATE = 300;
const SIZE_GUIDE_HANDLE = "guia-de-tallas";

async function fetchStore(path: string): Promise<Response | null> {
  if (!SHOPIFY_DOMAIN) throw new Error("SHOPIFY_STORE_DOMAIN is not set.");
  const res = await fetch(`${SHOPIFY_ORIGIN}${path}`, { next: { revalidate: REVALIDATE } }).catch(() => null);
  if (!res) return null;
  return res.ok ? res : null;
}

/** Shopify's editor writes fixed widths/heights inline; our CSS owns the layout. */
const stripInlineStyles = (html: string) => html.replace(/\s+style="[^"]*"/gi, "");

export async function getPolicy(
  handle: string
): Promise<{ title: string; html: string } | null> {
  const res = await fetchStore(`/policies/${handle}`);
  if (!res) return null;
  const page = await res.text();
  const title = page.match(/<div class="shopify-policy__title">\s*<h1>([\s\S]*?)<\/h1>/)?.[1];
  const html = page.match(
    /<div class="shopify-policy__body">\s*<div class="rte">([\s\S]*)<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/
  )?.[1];
  return title && html ? { title: title.trim(), html } : null;
}

export async function getSizeGuide(): Promise<string | null> {
  const res = await fetchStore("/pages.json");
  if (!res) return null;
  const { pages } = (await res.json()) as { pages: { handle: string; body_html: string | null }[] };
  const body = pages.find((p) => p.handle === SIZE_GUIDE_HANDLE)?.body_html;
  return body ? stripInlineStyles(body) : null;
}
