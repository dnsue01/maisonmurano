"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pad } from "@/lib/shopify";
import type { Photo } from "@/lib/photos";

/** Real on-model photos from the store; each links to the piece worn in it. */
export function Lookbook({ title, photos }: { title: string; photos: Photo[] }) {
  const t = useTranslations("home");
  const tp = useTranslations("product");
  const track = useRef<HTMLDivElement>(null);
  if (photos.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const arrow =
    "flex h-11 w-11 items-center justify-center border border-paper/30 transition-colors hover:border-mustard hover:bg-mustard hover:text-ink";

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto mb-9 flex max-w-7xl items-end justify-between gap-6 px-4 md:px-6">
        <h2 className="font-display text-6xl md:text-8xl">{title}</h2>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => scroll(-1)} className={arrow} aria-label={t("lookbookPrev")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => scroll(1)} className={arrow} aria-label={t("lookbookNext")}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 md:scroll-px-6 md:px-6"
      >
        {photos.map((p, i) => (
          <Link
            key={p.src}
            href={`/productos/${p.handle}`}
            className="group relative aspect-[3/4] w-[72vw] shrink-0 snap-start overflow-hidden bg-wall-2 sm:w-[42vw] lg:w-[23vw]"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 42vw, 23vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              priority={i < 2}
            />
            <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 bg-gradient-to-t from-wall/90 to-transparent px-3.5 pb-3 pt-12">
              <span className="text-sm font-semibold">{p.title}</span>
              <span className="font-label tabular text-[12px] text-mustard">{tp("number", { n: pad(p.n) })}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
