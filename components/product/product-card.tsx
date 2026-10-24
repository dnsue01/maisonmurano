"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";
import { formatMoney, isCutout, pad, type Product } from "@/lib/shopify";

/**
 * A garment as a tattoo flash design: numbered, drawn on paper, framed.
 * With `quickAdd`, the available sizes sit under the design so a piece can be
 * picked straight off the sheet.
 */
export function ProductCard({
  product,
  n,
  quickAdd = false,
  priority = false,
  tone = "wall",
}: {
  product: Product;
  n?: number;
  quickAdd?: boolean;
  priority?: boolean;
  /** "paper" when the card sits on a flash sheet instead of the dark wall. */
  tone?: "wall" | "paper";
}) {
  const onPaper = tone === "paper";
  const locale = useLocale();
  const t = useTranslations("product");
  const addLine = useCart((s) => s.addLine);
  const [stamp, setStamp] = useState(0);
  const [first, second] = product.images;
  const soldOut = !product.available;
  const cutout = first ? isCutout(first.url) : false;
  const sizes = product.variants.filter((v) => v.title !== "Default Title");

  return (
    <article className="group relative">
      <Link
        href={`/productos/${product.handle}`}
        className="flash-paper flash-frame relative block aspect-[4/5] overflow-hidden"
      >
        {first && (
          <Image
            src={first.url}
            alt={first.altText}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "transition-[opacity,transform] duration-500 ease-out",
              cutout ? "object-contain p-[12%] mix-blend-multiply" : "object-cover p-[9px]",
              second && "group-hover:opacity-0",
              soldOut && "grayscale-[0.6]"
            )}
          />
        )}
        {second && (
          <Image
            src={second.url}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="scale-[1.04] object-cover p-[9px] opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
        )}

        {n !== undefined && (
          <span className="font-label tabular absolute left-2.5 top-2.5 z-10 bg-paper px-1.5 py-0.5 text-[12px] text-flash">
            {t("number", { n: pad(n) })}
          </span>
        )}

        {soldOut && (
          <span className="font-label pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-[3px] border-flash px-3 py-1 text-xl tracking-[0.12em] text-flash/90 mix-blend-multiply">
            {t("soldOut")}
          </span>
        )}

        {stamp > 0 && (
          <span
            key={stamp}
            className="animate-stamp font-label pointer-events-none absolute left-1/2 top-1/2 z-20 border-[3px] border-bottle bg-paper/70 px-4 py-1 text-2xl tracking-[0.12em] text-bottle"
          >
            {t("added")}
          </span>
        )}
      </Link>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="min-w-0 text-[15px] font-semibold leading-tight">
          <Link href={`/productos/${product.handle}`} className={onPaper ? "hover:text-flash" : "hover:text-mustard"}>
            {product.title}
          </Link>
        </h3>
        <span className={cn("tabular shrink-0 text-[15px] font-semibold", soldOut ? "text-smoke line-through" : onPaper ? "text-flash" : "text-mustard")}>
          {formatMoney(product.price.amount, product.price.currencyCode, locale)}
        </span>
      </div>

      {quickAdd && !soldOut && (
        <div className="mt-2.5 grid grid-cols-4 gap-1">
          {(sizes.length > 0 ? sizes : product.variants.slice(0, 1)).map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={!v.available}
              aria-label={sizes.length > 0 ? t("quickAdd", { size: v.title }) : t("addToCart")}
              onClick={() => {
                addLine(product, v);
                setStamp((s) => s + 1);
              }}
              className={cn(
                "font-label h-9 min-w-0 border px-1 text-[12px] transition-colors",
                sizes.length === 0 && "col-span-4",
                onPaper
                  ? v.available
                    ? "border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-paper"
                    : "cursor-not-allowed border-ink/10 text-ink/30 line-through"
                  : v.available
                    ? "border-paper/35 text-paper hover:border-mustard hover:bg-mustard hover:text-ink"
                    : "cursor-not-allowed border-paper/10 text-paper/30 line-through"
              )}
            >
              {sizes.length > 0 ? v.title : t("addToCart")}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
