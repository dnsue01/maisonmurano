import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { shopify } from "@/lib/shopify";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductsBrowser } from "@/components/product/products-browser";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("products");
  return { title: t("title") };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const products = await shopify.getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="mb-8 font-display text-6xl uppercase md:text-8xl">
        {t("title")}
      </h1>
      <Suspense fallback={<ProductGrid products={products} />}>
        <ProductsBrowser products={products} />
      </Suspense>
    </div>
  );
}
