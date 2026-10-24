export type Money = {
  amount: number;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string;
};

export type ProductVariant = {
  id: string;
  title: string; // e.g. size: "M"
  available: boolean;
  price: Money;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionEs: string;
  tags: string[];
  price: Money;
  compareAtPrice?: Money; // sale strikethrough
  images: ProductImage[];
  variants: ProductVariant[];
  available: boolean;
  isGiftCard: boolean;
  bestSellerRank: number; // lower = better seller
  createdAt: string; // ISO
};

export type Collection = {
  handle: string;
  title: string;
  products: Product[];
};

export type CartLine = {
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  image: ProductImage;
  price: Money;
  quantity: number;
  isGiftCard?: boolean;
};

export type Cart = {
  lines: CartLine[];
  subtotal: Money;
  checkoutUrl: string;
};

export type SortKey =
  | "relevance"
  | "bestSelling"
  | "az"
  | "za"
  | "priceAsc"
  | "priceDesc"
  | "newest";

/**
 * Data source contract, implemented by `storefront.ts` (Storefront API) and
 * `ajax.ts` (public products.json). Components only
 * ever import from `lib/shopify` (index), so swapping the backend touches
 * nothing else.
 */
export interface ShopifyClient {
  getProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  getCollection(handle: string): Promise<Collection | null>;
}
