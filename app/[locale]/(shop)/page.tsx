import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { designNumbers, shopify } from "@/lib/shopify";
import { editorialPhotos } from "@/lib/photos";
import { REVIEWS, REVIEW_COUNT } from "@/lib/reviews";
import { ProductCard } from "@/components/product/product-card";
import { Newsletter } from "@/components/layout/newsletter";
import { BrandBreak } from "@/components/layout/video-break";
import { Lookbook } from "@/components/layout/lookbook";
import { Wordmark } from "@/components/brand/wordmark";
import { Ribbon } from "@/components/brand/ribbon";
import { Tack } from "@/components/brand/tack";
import { Cross } from "@/components/brand/cross";

// Campaign banner uploaded to the brand's Shopify files.
const HERO = "https://maisonmurano.es/cdn/shop/files/banner_shopi_camis.jpg?v=1790958902";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tp = await getTranslations("product");
  const products = await shopify.getProducts().catch(() => []);
  const numbers = designNumbers(products);
  const available = products.filter((p) => p.available);
  const archive = products.filter((p) => !p.available);
  const photos = editorialPhotos(products);
  const collage = photos.slice(0, 3);

  return (
    <>
      {/* HERO — campaign photo, tattoo-lettered wordmark */}
      <section className="relative overflow-hidden bg-wall">
        <div className="relative h-[60svh] min-h-[420px] md:h-[74svh]">
          <Image src={HERO} alt={t("heroAlt")} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-wall/30 via-wall/20 to-wall" />
          <div className="absolute inset-x-0 bottom-24 flex flex-col items-center px-4 text-center md:bottom-40">
            <h1>
              <Wordmark className="text-[clamp(4rem,15vw,11.5rem)] text-paper drop-shadow-[0_6px_28px_rgba(0,0,0,0.7)]" />
            </h1>
            <Ribbon className="mt-3 -rotate-1">{t("motto")}</Ribbon>
          </div>
        </div>

        {/* THE FLASH SHEET — the drop, pinned to the wall */}
        <div id="drop" className="relative z-10 mx-auto -mt-16 max-w-6xl scroll-mt-24 px-3 pb-20 md:-mt-28 md:px-6 md:pb-28">
          <div className="animate-pin flash-paper sheet-shadow relative px-4 pb-8 pt-10 [--tilt:-0.5deg] md:px-10 md:pb-12 md:pt-14">
            <Tack className="absolute left-4 top-3 md:left-6" />
            <Tack className="absolute right-4 top-3 md:right-6" />

            <div className="mb-8 flex flex-col gap-3 border-b-2 border-ink pb-5 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-[clamp(3rem,8vw,5.5rem)] text-ink">{t("sheetTitle")}</h2>
                <p className="mt-1 max-w-md text-[15px] text-ink/75">{t("sheetNote")}</p>
              </div>
              <p className="font-label tabular flex items-center gap-2 text-[13px] text-flash">
                <Cross className="h-4 w-3" />
                {tp("pieces", { count: available.length })}
              </p>
            </div>

            {available.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-6">
                {available.map((p, i) => (
                  <ProductCard key={p.id} product={p} n={numbers[p.handle]} quickAdd tone="paper" priority={i < 2} />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-ink/75">{t("sheetEmpty")}</p>
            )}

            <div className="mt-10 text-center">
              <Link
                href="/productos"
                className="font-label inline-flex h-12 items-center border-2 border-ink px-7 text-[13px] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {t("viewAll")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK — their own on-model photography */}
      <Lookbook title={t("lookbookTitle")} photos={photos} />

      {/* ARCHIVE — sold-out designs as proof of scarcity */}
      {archive.length > 0 && (
        <section className="border-y border-paper/10 bg-wall-2 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <h2 className="font-display text-6xl md:text-8xl">{t("archiveTitle")}</h2>
              <p className="max-w-sm text-[15px] text-smoke">{t("archiveText")}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-6">
              {archive.map((p) => (
                <ProductCard key={p.id} product={p} n={numbers[p.handle]} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BrandBreak line1={t("breakLine1")} line2={t("breakLine2")} cta={t("breakCta")} />

      {/* REVIEWS — real Judge.me reviews */}
      <section className="py-20 md:py-28">
        <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-6 px-4 md:px-6">
          <h2 className="font-display text-6xl md:text-8xl">{t("reviewsTitle")}</h2>
          <p className="font-label tabular shrink-0 text-[13px] text-mustard">{t("reviewsCount", { count: REVIEW_COUNT })}</p>
        </div>
        <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 md:scroll-px-6 md:px-6">
          {REVIEWS.map((r) => (
            <figure
              key={r.author + r.quote}
              className="flash-paper flex w-[78vw] shrink-0 snap-start flex-col justify-between p-6 sm:w-[46vw] lg:w-[25vw]"
            >
              <div>
                <div className="flex gap-1 text-flash" aria-label="5/5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Cross key={i} className="h-4 w-3" />
                  ))}
                </div>
                <blockquote className="mt-4 text-[clamp(1.25rem,1.8vw,1.5rem)] font-semibold leading-snug text-ink">
                  {r.quote}
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-baseline justify-between gap-3 border-t border-ink/20 pt-3">
                <span className="font-label text-[13px] text-ink">{r.author}</span>
                <span className="text-[13px] text-ink/65">{r.product}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ABOUT teaser */}
      <section className="border-t border-paper/10 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
          {collage.length === 3 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 aspect-[16/10] overflow-hidden bg-wall-2">
                <Image src={collage[0].src} alt={collage[0].alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
              {collage.slice(1).map((c) => (
                <div key={c.src} className="relative aspect-[3/4] overflow-hidden bg-wall-2">
                  <Image src={c.src} alt={c.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="max-w-xl">
            <Cross className="mb-7 h-14 w-10 text-flash" />
            <h2 className="font-display text-6xl md:text-7xl">{t("aboutTitle")}</h2>
            <p className="mt-7 text-xl leading-relaxed text-paper/90 md:text-2xl">{t("aboutText")}</p>
            <p className="mt-4 text-lg leading-relaxed text-smoke">{t("aboutLore")}</p>
            <p className="font-display mt-7 text-4xl text-mustard">{t("aboutClose")}</p>
            <Link
              href="/nosotros"
              className="font-label mt-9 inline-flex h-12 items-center border-2 border-paper/40 px-7 text-[13px] transition-colors hover:border-mustard hover:bg-mustard hover:text-ink"
            >
              {t("aboutCta")}
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
