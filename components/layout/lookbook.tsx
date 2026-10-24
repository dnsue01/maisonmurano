"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Photo } from "@/lib/photos";

/** Real on-model photos from the store; each links to the piece worn in it. */
export function Lookbook({ title, prevLabel, nextLabel, photos }: { title: string; prevLabel: string; nextLabel: string; photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  if (photos.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow =
    "flex h-11 w-11 items-center justify-center border border-ink bg-cream transition-colors hover:bg-ink hover:text-cream";

  return (
    <section className="border-t border-ink/15 py-16 md:py-24">
      <div className="mb-8 flex items-end justify-between px-4 md:px-6">
        <h2 className="font-display text-5xl uppercase md:text-7xl">{title}</h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => scroll(-1)} className={arrow} aria-label={prevLabel}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => scroll(1)} className={arrow} aria-label={nextLabel}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={track} className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 md:scroll-px-6 md:px-6">
        {photos.map(({ src, alt, handle, title }, i) => (
          <Link
            key={src}
            href={`/productos/${handle}`}
            aria-label={title}
            className="group relative aspect-[2/3] w-[70vw] shrink-0 snap-start overflow-hidden border border-ink sm:w-[40vw] md:w-[22vw]"
          >
            <Image
              src={src}
              alt={alt}
              priority={i < 2}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 768px) 40vw, 22vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
