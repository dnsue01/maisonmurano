import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { shopify } from "@/lib/shopify";
import { getSizeGuide } from "@/lib/shopify/content";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGrid } from "@/components/product/product-grid";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateStaticParams() {
  const products = await shopify.getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await shopify.getProduct(handle);
  return { title: product?.title ?? "Producto" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("product");
  const product = await shopify.getProduct(handle);
  if (!product) notFound();

  const all = await shopify.getProducts();
  const others = all.filter((p) => p.handle !== handle);
  const related = [...others.filter((p) => p.available), ...others.filter((p) => !p.available)].slice(0, 4);
  const onSale = !!product.compareAtPrice;
  const sizeGuide = product.isGiftCard ? null : await getSizeGuide();
  const description = locale === "es" ? product.descriptionEs : product.description;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <ProductGallery images={product.images} />

        <div className="min-w-0 md:pt-6">
          {onSale && (
            <Badge className="mb-3 rounded-none bg-tc-red text-cream">SALE</Badge>
          )}
          <h1 className="font-display text-4xl uppercase md:text-6xl">
            {product.title}
          </h1>

          <AddToCart product={product} sizeGuide={sizeGuide}>
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </AddToCart>

          <Accordion multiple={false} className="mt-8">
            <AccordionItem value="details">
              <AccordionTrigger>{t("details")}</AccordionTrigger>
              <AccordionContent className="whitespace-pre-line">{description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>{t("shipping")}</AccordionTrigger>
              <AccordionContent>{t("shippingText")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="mb-8 font-display text-3xl uppercase md:text-5xl">
          {t("youMayLike")}
        </h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
