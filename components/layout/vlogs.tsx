"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { VLOGS, CHANNEL_URL, embedUrl, thumb } from "@/lib/videos";

/**
 * "Desde la habitación": the founder's own YouTube vlogs. Thumbnails only
 * until clicked, so no player loads until someone wants to watch.
 */
export function Vlogs({ title, subtitle, cta }: { title: string; subtitle: string; cta: string }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [main, ...rest] = VLOGS;

  const Tile = ({ v, big = false }: { v: (typeof VLOGS)[number]; big?: boolean }) => (
    <div className={`relative aspect-video overflow-hidden border border-ink bg-ink ${big ? "md:row-span-2" : ""}`}>
      {playing === v.id ? (
        <iframe
          src={embedUrl(v.id)}
          title={v.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(v.id)} className="group absolute inset-0 text-left" aria-label={`Ver: ${v.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(v.id)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
          <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-cream">
            <span className={`font-semibold leading-tight ${big ? "text-xl md:text-2xl" : "text-base"}`}>{v.title}</span>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-cream/80">{v.duration}</span>
          </span>
        </button>
      )}
    </div>
  );

  return (
    <section className="border-t border-ink/15 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-5xl md:text-7xl">{title}</h2>
            <p className="font-script mt-2 text-2xl text-olive md:text-3xl">{subtitle}</p>
          </div>
          <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold uppercase underline underline-offset-4 hover:text-olive">
            {cta}
          </a>
        </div>
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr] md:grid-rows-2">
          <Tile v={main} big />
          {rest.map((v) => (
            <Tile key={v.id} v={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
