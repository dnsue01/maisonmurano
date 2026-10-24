"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isCutout, type ProductImage } from "@/lib/shopify";

export function ProductGallery({ images, label }: { images: ProductImage[]; label?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 md:flex-row">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:max-h-[min(80vh,760px)] md:flex-col md:gap-2.5 md:overflow-x-visible md:overflow-y-auto md:px-0 md:pb-0">
        {images.map((img, i) => (
          <button
            key={img.url}
            onClick={() => setActive(i)}
            className={cn(
              "flash-paper relative h-16 w-12 shrink-0 overflow-hidden transition-opacity md:h-20 md:w-16",
              active === i ? "ring-2 ring-mustard" : "opacity-55 hover:opacity-100"
            )}
            aria-label={img.altText}
            aria-current={active === i}
          >
            <Image
              src={img.url}
              alt=""
              fill
              sizes="64px"
              className={isCutout(img.url) ? "object-contain p-1 mix-blend-multiply" : "object-cover"}
            />
          </button>
        ))}
      </div>
      <div className="flash-paper flash-frame relative mx-auto aspect-[4/5] w-full max-w-[52svh] overflow-hidden md:max-w-none md:flex-1">
        {current && (
          <Image
            src={current.url}
            alt={current.altText}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={isCutout(current.url) ? "object-contain p-[10%] mix-blend-multiply" : "object-cover p-[9px]"}
          />
        )}
        {label}
      </div>
    </div>
  );
}
