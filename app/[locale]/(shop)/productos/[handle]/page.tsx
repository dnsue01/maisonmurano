import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { designNumbers, pad, shopify } from "@/lib/shopify";
import { getSizeGuide } from "@/lib/shopify/content";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGrid } from "@/components/product/product-grid";
import { Cross } from "@/components/brand/cross";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateStaticParams() {
  const products = await shopify.getProducts().catch(() => []);
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await shopify.getProduct(handle).catch(() => null);
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
  const all = await shopify.getProducts();
  const product = all.find((p) => p.handle === handle);
  if (!product) notFound();

  const n = designNumbers(all)[handle];
  const related = [...all.filter((p) => p.handle !== handle && p.available), ...all.filter((p) => p.handle !== handle && !p.available)].slice(0, 4);
  const sizeGuide = product.isGiftCard ? null : await getSizeGuide().catch(() => null);
  const description = locale === "es" ? product.descriptionEs : product.description;
  const soldOut = !product.available;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="grid gap-9 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <ProductGallery
          images={product.images}
          label={
            soldOut ? (
              <span className="font-label pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-flash px-5 py-2 text-3xl tracking-[0.14em] text-flash/90 mix-blend-multiply">
                {t("soldOut")}
              </span>
            ) : null
          }
        />

        <div className="min-w-0 md:pt-4">
          <p className="font-label tabular flex items-center gap-2 text-[13px] text-flash">
            <Cross className="h-4 w-3" />
            {t("number", { n: pad(n) })}
          </p>
          <h1 className="font-display mt-3 text-[clamp(3rem,7vw,5.5rem)]">{product.title}</h1>

          <AddToCart product={product} sizeGuide={sizeGuide}>
            <p className="mt-6 max-w-[62ch] whitespace-pre-line text-[16px] leading-relaxed text-paper/85">{description}</p>
          </AddToCart>

          <Accordion multiple={false} className="mt-9">
            <AccordionItem value="shipping">
              <AccordionTrigger className="font-label text-[13px]">{t("shipping")}</AccordionTrigger>
              <AccordionContent className="text-[15px] text-smoke">{t("shippingText")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 md:mt-32">
          <h2 className="font-display mb-9 text-5xl md:text-7xl">{t("youMayLike")}</h2>
          <ProductGrid products={related} catalog={all} />
        </section>
      )}
    </div>
  );
}
