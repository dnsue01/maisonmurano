"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SpinningCross } from "@/components/loader/spinning-cross";
import { useCart, cartSubtotal } from "@/lib/cart/store";
import { formatMoney, isCutout } from "@/lib/shopify";

export function CartView() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { lines, setQuantity, removeLine } = useCart();
  const subtotal = cartSubtotal(lines);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <SpinningCross className="h-14 w-10 text-flash" />
        <h1 className="font-display text-4xl">{t("empty")}</h1>
        <Button asChild>
          <Link href="/productos">{t("emptyCta")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-8 font-display text-5xl md:text-7xl">
        {t("title")}
      </h1>
      <div className="grid gap-10 md:grid-cols-[1fr_320px]">
        <ul className="flex flex-col divide-y divide-paper/10 border-y border-paper/10">
          {lines.map((line) => (
            <li key={line.variantId} className="flex gap-4 py-4">
              <div className="flash-paper relative h-32 w-24 shrink-0 overflow-hidden">
                {line.image && (
                  <Image
                    src={line.image.url}
                    alt={line.image.altText}
                    fill
                    sizes="96px"
                    className={isCutout(line.image.url) ? "object-contain p-2 mix-blend-multiply" : "object-cover"}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/productos/${line.productHandle}`}
                      className="font-semibold hover:text-mustard"
                    >
                      {line.title}
                    </Link>
                    {!line.isGiftCard && (
                      <p className="text-sm text-muted-foreground">
                        {t("size")}: {line.variantTitle}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeLine(line.variantId)}
                    aria-label={t("remove")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-paper/25">
                    <button
                      className="px-2 py-1"
                      aria-label={t("less")}
                      onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-8 text-center text-sm">
                      {line.quantity}
                    </span>
                    <button
                      className="px-2 py-1"
                      aria-label={t("more")}
                      onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-semibold">
                    {formatMoney(
                      line.price.amount * line.quantity,
                      line.price.currencyCode,
                      locale
                    )}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-paper/15 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-label text-[13px]">{t("subtotal")}</span>
            <span className="tabular text-2xl font-semibold">
              {formatMoney(subtotal, "EUR", locale)}
            </span>
          </div>
          <p className="mb-6 text-[13px] text-smoke">{t("shippingNote")}</p>
          <button type="button" disabled className="font-label h-13 w-full bg-flash text-[14px] text-paper opacity-60">
            {t("checkout")}
          </button>
          <p className="mt-2 text-[12px] leading-snug text-smoke">{t("demoNote")}</p>
        </aside>
      </div>
    </>
  );
}
