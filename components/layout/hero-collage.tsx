import Image from "next/image";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * Hero collage: the brand's own on-model photos from Shopify, stacked in
 * columns that drift slowly in opposite directions behind the wordmark.
 * Only the first few photos load eagerly; the rest are lazy and resized.
 */
export function HeroCollage({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;
  const COLS = 4;
  const cols: Photo[][] = Array.from({ length: COLS }, () => []);
  photos.forEach((p, i) => cols[i % COLS].push(p));

  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-2 px-2 md:grid-cols-4 md:gap-3 md:px-3" aria-hidden="true">
      {cols.map((col, c) => {
        if (col.length === 0) return null;
        // Repeat the column so the vertical drift loops seamlessly.
        const loop = [...col, ...col, ...col].slice(0, Math.max(6, col.length * 2));
        return (
          <div key={c} className={cn("relative overflow-hidden", c >= 2 && "hidden md:block")}>
            <div
              className={cn(
                "animate-collage flex flex-col gap-2 md:gap-3",
                c % 2 === 1 && "[animation-direction:reverse]"
              )}
              style={{ ["--collage-duration" as string]: `${60 + c * 9}s` }}
            >
              {[...loop, ...loop].map((p, i) => (
                <div key={`${p.src}-${i}`} className="relative aspect-[3/4] w-full shrink-0 overflow-hidden border border-cream/10 bg-olive-deep">
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    quality={60}
                    priority={i === 0 && c < 2}
                    loading={i === 0 && c < 2 ? undefined : "lazy"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
