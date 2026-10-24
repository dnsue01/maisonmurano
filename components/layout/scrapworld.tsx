"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { HERO_CLIP, BBVA_URL, embedUrl, thumb } from "@/lib/videos";
import { LogoMark } from "@/components/brand/logo-mark";

/**
 * La Base Awards BBVA × ScrapWorld 2026: Maison Murano was one of the three
 * winning projects and showed the collection at ScrapWorld (IFEMA Madrid).
 */
export function Scrapworld() {
  const t = useTranslations("scrapworld");
  const [play, setPlay] = useState(false);

  return (
    <section className="border-y border-ink bg-olive-deep px-4 py-16 text-cream md:px-6 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_1.2fr] md:gap-14">
        <div>
          <p className="inline-flex items-center gap-2 border border-cream/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
            <LogoMark className="h-3.5 w-3.5" />
            {t("badge")}
          </p>
          <h2 className="font-display mt-6 text-5xl md:text-7xl">{t("title")}</h2>
          <p className="font-script mt-3 text-2xl text-khaki md:text-3xl">{t("subtitle")}</p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/85">{t("text")}</p>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-cream/20 pt-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-cream/65">{t("statWinnersLabel")}</dt>
              <dd className="font-display mt-1 text-3xl">3</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-cream/65">{t("statProjectsLabel")}</dt>
              <dd className="font-display mt-1 text-3xl">130</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-cream/65">{t("statWhereLabel")}</dt>
              <dd className="font-display mt-1 text-3xl">IFEMA</dd>
            </div>
          </dl>
          <a
            href={BBVA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-sm font-semibold uppercase underline underline-offset-4 hover:text-khaki"
          >
            {t("link")}
          </a>
        </div>

        <div className="relative aspect-video overflow-hidden border border-cream/30 bg-ink">
          {play ? (
            <iframe
              src={`${embedUrl(HERO_CLIP.id)}&start=0`}
              title={t("videoTitle")}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={t("videoTitle")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb(HERO_CLIP.id)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100" />
              <span className="absolute inset-0 bg-ink/25" />
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-ink transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-1 h-6 w-6 fill-current" />
              </span>
              <span className="absolute inset-x-4 bottom-4 text-left text-sm font-semibold text-cream">{t("videoTitle")}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
