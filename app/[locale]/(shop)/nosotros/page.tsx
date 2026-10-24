import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { shopify } from "@/lib/shopify";
import { editorialPhotos } from "@/lib/photos";
import { Cross } from "@/components/brand/cross";
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
        <Cross className="mb-8 h-16 w-11 text-flash" />
        <h1 className="font-display text-[clamp(3.25rem,9vw,6rem)]">{t("title")}</h1>
      </section>

      {/* Origin on a pinned sheet */}
      <section className="mx-auto max-w-5xl px-3 md:px-6">
        <div className="animate-pin flash-paper sheet-shadow grid gap-8 p-6 [--tilt:0.4deg] md:grid-cols-[auto_1fr] md:gap-12 md:p-12">
          <h2 className="font-display text-5xl text-flash md:text-6xl">{t("originTitle")}</h2>
          <div className="max-w-[62ch] space-y-5 text-[17px] leading-relaxed text-ink md:text-lg">
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
              className={`relative overflow-hidden bg-wall-2 ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[3/4]"}`}
            >
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
            </Link>
          ))}
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <div className="divide-y divide-paper/15 border-y border-paper/15">
          {chapters.map((c) => (
            <div key={c.title} className="grid gap-4 py-10 md:grid-cols-[18rem_1fr] md:gap-12">
              <h2 className="font-display text-4xl text-mustard md:text-5xl">{c.title}</h2>
              <p className="max-w-[60ch] text-lg leading-relaxed text-paper/90">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="font-display mt-16 text-center text-[clamp(2.5rem,6vw,4.5rem)]">{t("close")}</p>
        <div className="mt-10 text-center">
          <Link
            href="/productos"
            className="font-label inline-flex h-13 items-center bg-flash px-8 text-[14px] text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            {t("cta")}
          </Link>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
