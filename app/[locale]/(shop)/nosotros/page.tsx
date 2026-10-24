import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { shopify } from "@/lib/shopify";
import { editorialPhotos } from "@/lib/photos";
import { LogoMark } from "@/components/brand/logo-mark";
import { Newsletter } from "@/components/layout/newsletter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("metaTitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const products = await shopify.getProducts().catch(() => []);
  const photos = editorialPhotos(products, 3).slice(3, 9);

  const chapters = [
    { title: t("visionTitle"), text: t("vision") },
    { title: t("designTitle"), text: t("design") },
    { title: t("missionTitle"), text: t("mission") },
  ];

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 md:px-6 md:pb-24 md:pt-24">
        <LogoMark className="mb-8 h-16 w-16 text-olive" />
        <h1 className="font-display text-[clamp(3.25rem,9vw,6rem)]">{t("title")}</h1>
      </section>

      {/* Origin on a pinned sheet */}
      <section className="mx-auto max-w-5xl px-3 md:px-6">
        <div className="grid gap-8 border border-ink bg-secondary p-6 md:grid-cols-[auto_1fr] md:gap-12 md:p-12">
          <h2 className="font-display text-5xl text-olive md:text-6xl">{t("originTitle")}</h2>
          <div className="max-w-[62ch] space-y-5 text-[17px] leading-relaxed md:text-lg">
            <p>{t("origin1")}</p>
            <p>{t("origin2")}</p>
          </div>
        </div>
      </section>

      {photos.length >= 3 && (
        <section className="mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-3 px-4 md:mt-28 md:grid-cols-3 md:px-6">
          {photos.map((p, i) => (
            <Link
              key={p.src}
              href={`/productos/${p.handle}`}
              className={`relative overflow-hidden border border-ink bg-secondary ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[3/4]"}`}
            >
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
            </Link>
          ))}
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <div className="divide-y divide-ink/15 border-y border-ink/15">
          {chapters.map((c) => (
            <div key={c.title} className="grid gap-4 py-10 md:grid-cols-[18rem_1fr] md:gap-12">
              <h2 className="font-display text-3xl text-olive md:text-4xl">{c.title}</h2>
              <p className="max-w-[60ch] text-lg leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="font-script mt-16 text-center text-4xl text-olive md:text-5xl">{t("close")}</p>
        <div className="mt-10 text-center">
          <Link
            href="/productos"
            className="inline-flex h-12 items-center bg-ink px-8 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-olive"
          >
            {t("cta")}
          </Link>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
