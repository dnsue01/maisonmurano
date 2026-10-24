import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { shopify } from "@/lib/shopify";
import { editorialPhotos } from "@/lib/photos";
import { REVIEWS, REVIEW_COUNT } from "@/lib/reviews";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo-mark";
import { ArchedWordmark } from "@/components/brand/wordmark";
import { ProductGrid } from "@/components/product/product-grid";
import { Newsletter } from "@/components/layout/newsletter";
import { SpinningLogoSection } from "@/components/layout/video-break";
import { Lookbook } from "@/components/layout/lookbook";
import { HeroVideos } from "@/components/layout/hero-videos";
import { Vlogs } from "@/components/layout/vlogs";
import { Scrapworld } from "@/components/layout/scrapworld";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const products = await shopify.getProducts().catch(() => []);
  // Available pieces first, then the sold-out archive.
  const ordered = [...products.filter((p) => p.available), ...products.filter((p) => !p.available)];
  const featured = ordered.slice(0, 4);
  const photos = editorialPhotos(products);
  const collage = photos.slice(2, 5);

  return (
    <>
      {/* HERO — the brand's stand at ScrapWorld 2026, looping behind the varsity wordmark */}
      <section className="relative overflow-hidden border-b border-ink bg-ink text-cream">
        <HeroVideos />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink/70" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
          <a
            href="#scrapworld"
            className="mb-4 inline-flex items-center gap-2 border border-cream/50 bg-ink/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-ink"
          >
            <LogoMark className="h-3.5 w-3.5" />
            {t("heroBadge")}
          </a>
          <h1 className="w-full max-w-4xl">
            <ArchedWordmark className="text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]" />
          </h1>
          <LogoMark className="-mt-[6%] h-16 w-16 text-cream md:h-24 md:w-24" />
          <p className="font-script mt-6 text-3xl text-cream md:text-4xl">{t("heroSubtitle")}</p>
          <Button asChild size="lg" className="mt-9 h-12 bg-cream px-8 text-ink hover:bg-khaki">
            <Link href="/productos">{t("heroCta")}</Link>
          </Button>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-5xl md:text-7xl">{t("featuredTitle")}</h2>
            <p className="font-script mt-2 text-2xl text-olive md:text-3xl">{t("featuredSubtitle")}</p>
          </div>
          <Link href="/productos" className="hidden text-sm font-semibold uppercase underline underline-offset-4 hover:text-olive md:block">
            {t("viewAll")}
          </Link>
        </div>
        <ProductGrid products={featured} />
        <div className="mt-10 text-center md:hidden">
          <Button asChild variant="outline" className="h-11 px-6">
            <Link href="/productos">{t("viewAll")}</Link>
          </Button>
        </div>
      </section>

      <div id="scrapworld" className="scroll-mt-20">
        <Scrapworld />
      </div>

      <Lookbook title={t("lookbookTitle")} prevLabel={t("lookbookPrev")} nextLabel={t("lookbookNext")} photos={photos} />

      {/* Chrome cross break */}
      <SpinningLogoSection title={t("breakTitle")} cta={t("heroCta")} />

      {/* REVIEWS — real Judge.me reviews from maisonmurano.es */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-5xl md:text-7xl">{t("reviewsTitle")}</h2>
            <p className="font-script mt-2 text-2xl text-olive md:text-3xl">{t("reviewsCount", { count: REVIEW_COUNT })}</p>
          </div>
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 md:mx-0 md:px-0">
          {REVIEWS.map((r) => (
            <figure key={r.author + r.quote} className="flex w-[78vw] shrink-0 snap-start flex-col justify-between border border-ink bg-secondary p-6 sm:w-[46vw] lg:w-[calc(25%-9px)]">
              <div>
                <div className="flex gap-1 text-olive" aria-label="5/5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <LogoMark key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg font-semibold leading-snug">{r.quote}</blockquote>
              </div>
              <figcaption className="mt-8 flex items-baseline justify-between gap-3 border-t border-ink/15 pt-3 text-xs">
                <span className="font-bold uppercase tracking-wide">{r.author}</span>
                <span className="text-muted-foreground">{r.product}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* VLOGS — the founder's YouTube */}
      <Vlogs title={t("vlogsTitle")} subtitle={t("vlogsSubtitle")} cta={t("vlogsCta")} />

      {/* ABOUT teaser */}
      <section className="border-y border-ink/15 bg-secondary px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          {collage.length === 3 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 aspect-[16/10] overflow-hidden border border-ink">
                <Image src={collage[0].src} alt={collage[0].alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
              {collage.slice(1).map((c) => (
                <div key={c.src} className="relative aspect-[3/4] overflow-hidden border border-ink">
                  <Image src={c.src} alt={c.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
          <div>
            <LogoMark className="mb-6 h-12 w-12 text-olive" />
            <h2 className="font-display text-5xl md:text-7xl">{t("aboutTitle")}</h2>
            <p className="mt-6 text-xl font-semibold leading-snug md:text-2xl">{t("aboutText")}</p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("aboutLore")}</p>
            <p className="font-script mt-5 text-3xl text-olive">{t("aboutClose")}</p>
            <Button asChild variant="outline" className="mt-8 h-11 px-6">
              <Link href="/nosotros">{t("aboutCta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
