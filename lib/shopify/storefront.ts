import type { Collection, Product, ProductImage, ProductVariant, ShopifyClient } from "./types";
import { hasPrivateToken, storefrontFetch } from "./client";

/**
 * Real Shopify Storefront API client. Transport, auth and env vars live in
 * client.ts. Activated automatically from index.ts when SHOPIFY_STORE_DOMAIN
 * is set.
 *
 * Languages: the TIER CLUB store's primary language is Spanish with an
 * English translation, so the main query runs in English (`description`) and
 * a second lightweight query fetches the Spanish text (`descriptionEs`).
 * Shopify returns the source text when a translation is missing, so neither
 * field is ever empty.
 */

const PRODUCTS_LIMIT = 50;
const REVALIDATE = 300;
const MONEY = `amount currencyCode`;

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  isGiftCard
  createdAt
  ${hasPrivateToken ? "tags" : ""}
  priceRange { minVariantPrice { ${MONEY} } }
  compareAtPriceRange { minVariantPrice { ${MONEY} } }
  images(first: 10) { edges { node { url altText } } }
  variants(first: 100) {
    edges { node { id title availableForSale price { ${MONEY} } } }
  }
`;

type Money = { amount: string; currencyCode: string };
type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  isGiftCard: boolean;
  createdAt: string;
  tags?: string[];
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money } | null;
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: {
    edges: { node: { id: string; title: string; availableForSale: boolean; price: Money } }[];
  };
};

const mapImage = (img: { url: string; altText: string | null }): ProductImage => ({
  url: img.url,
  altText: img.altText ?? "",
});

const mapVariant = (v: RawProduct["variants"]["edges"][number]["node"]): ProductVariant => ({
  id: v.id,
  title: v.title,
  available: v.availableForSale,
  price: { amount: Number(v.price.amount), currencyCode: v.price.currencyCode },
});

/** `bestSellerRank` = position in a BEST_SELLING-sorted list (Shopify has no bare rank field). */
function mapProduct(p: RawProduct, bestSellerRank: number, descriptionEs?: string): Product {
  const price = p.priceRange.minVariantPrice;
  const compareAt = p.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount);
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionEs: descriptionEs ?? p.description,
    tags: p.tags ?? [],
    price: { amount: Number(price.amount), currencyCode: price.currencyCode },
    compareAtPrice: onSale
      ? { amount: Number(compareAt.amount), currencyCode: compareAt.currencyCode }
      : undefined,
    images: p.images.edges.map((e) => mapImage(e.node)),
    variants: p.variants.edges.map((e) => mapVariant(e.node)),
    available: p.availableForSale,
    isGiftCard: p.isGiftCard,
    bestSellerRank,
    createdAt: p.createdAt,
  };
}

/** Spanish descriptions keyed by handle. Non-fatal: falls back to the main description. */
async function spanishDescriptions(): Promise<Map<string, string>> {
  try {
    const data = await storefrontFetch<{
      products: { edges: { node: { handle: string; description: string } }[] };
    }>(
      `query SpanishDescriptions @inContext(language: ES) {
        products(first: ${PRODUCTS_LIMIT}) { edges { node { handle description } } }
      }`,
      {},
      { revalidate: REVALIDATE }
    );
    return new Map(data.products.edges.map(({ node }) => [node.handle, node.description]));
  } catch {
    return new Map();
  }
}

export const storefrontClient: ShopifyClient = {
  async getProducts() {
    const [data, es] = await Promise.all([
      storefrontFetch<{ products: { edges: { node: RawProduct }[] } }>(
        `query Products @inContext(language: EN) {
          products(first: ${PRODUCTS_LIMIT}, sortKey: BEST_SELLING) {
            edges { node { ${PRODUCT_FIELDS} } }
          }
        }`,
        {},
        { revalidate: REVALIDATE }
      ),
      spanishDescriptions(),
    ]);
    return data.products.edges.map(({ node }, i) => mapProduct(node, i, es.get(node.handle)));
  },

  async getProduct(handle) {
    const [data, es] = await Promise.all([
      storefrontFetch<{ product: RawProduct | null }>(
        `query Product($handle: String!) @inContext(language: EN) {
          product(handle: $handle) { ${PRODUCT_FIELDS} }
        }`,
        { handle },
        { revalidate: REVALIDATE }
      ),
      spanishDescriptions(),
    ]);
    return data.product ? mapProduct(data.product, 0, es.get(handle)) : null;
  },

  async getCollection(handle): Promise<Collection | null> {
    const [data, es] = await Promise.all([
      storefrontFetch<{
        collection: { title: string; products: { edges: { node: RawProduct }[] } } | null;
      }>(
        `query Collection($handle: String!) @inContext(language: EN) {
          collection(handle: $handle) {
            title
            products(first: ${PRODUCTS_LIMIT}, sortKey: BEST_SELLING) {
              edges { node { ${PRODUCT_FIELDS} } }
            }
          }
        }`,
        { handle },
        { revalidate: REVALIDATE }
      ),
      spanishDescriptions(),
    ]);
    if (!data.collection) return null;
    return {
      handle,
      title: data.collection.title,
      products: data.collection.products.edges.map(({ node }, i) =>
        mapProduct(node, i, es.get(node.handle))
      ),
    };
  },
};
