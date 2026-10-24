"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isCutout, type ProductImage } from "@/lib/shopify";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 md:flex-row">
      {/* Thumbnails scroll instead of widening the page (Shopify products carry ~9 photos). */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:max-h-[min(80vh,720px)] md:flex-col md:gap-3 md:overflow-x-visible md:overflow-y-auto md:px-0 md:pb-0">
        {images.map((img, i) => (
          <button
            key={img.url}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-12 shrink-0 overflow-hidden md:h-20 md:w-16 bg-secondary transition-opacity",
              active === i ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100"
            )}
            aria-label={img.altText}
          >
            <Image src={img.url} alt={img.altText} fill sizes="64px" className={isCutout(img.url) ? "object-contain p-1" : "object-cover"} />
          </button>
        ))}
      </div>
      {/* On phones cap the photo at ~60% of the screen height so title and price stay in view. */}
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[48svh] overflow-hidden bg-secondary md:max-w-none md:flex-1">
        {images[active] && (
          <Image
            src={images[active].url}
            alt={images[active].altText}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={isCutout(images[active].url) ? "object-contain p-[8%]" : "object-cover"}
          />
        )}
      </div>
    </div>
  );
}
