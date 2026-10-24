"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SpinningCross } from "@/components/loader/spinning-cross";
import { useCart, cartSubtotal } from "@/lib/cart/store";
import { formatMoney, isCutout } from "@/lib/shopify";

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { lines, isOpen, close, setQuantity, removeLine } = useCart();
  const subtotal = cartSubtotal(lines);
  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent side="right" className="flex w-full flex-col border-paper/10 bg-wall text-paper sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-4xl text-paper">
            {t("title")}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
            <SpinningCross className="h-14 w-10 text-flash" />
            <p className="text-center text-[15px] text-smoke">{t("empty")}</p>
            <Button asChild variant="outline" onClick={close}>
              <Link href="/productos">{t("emptyCta")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-4">
                {lines.map((line) => (
                  <li key={line.variantId} className="flex gap-3">
                    <div className="flash-paper relative h-24 w-20 shrink-0 overflow-hidden">
                      {line.image && (
                        <Image
                          src={line.image.url}
                          alt={line.image.altText}
                          fill
                          sizes="80px"
                          className={isCutout(line.image.url) ? "object-contain p-1.5 mix-blend-multiply" : "object-cover"}
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[15px] font-semibold">{line.title}</p>
                          {!line.isGiftCard && (
                            <p className="text-[13px] text-smoke">
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
                            className="px-2.5 py-1.5"
                            aria-label={t("less")}
                            onClick={() =>
                              setQuantity(line.variantId, line.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center text-sm">
                            {line.quantity}
                          </span>
                          <button
                            className="px-2.5 py-1.5"
                            aria-label={t("more")}
                            onClick={() =>
                              setQuantity(line.variantId, line.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="tabular text-[15px] font-semibold text-mustard">
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
            </div>

            <SheetFooter className="border-t border-paper/10 px-6 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-label text-[13px]">
                  {t("subtotal")}
                </span>
                <span className="tabular text-xl font-semibold">
                  {formatMoney(subtotal, "EUR", locale)}
                </span>
              </div>
              <p className="mb-3 text-[13px] text-smoke">
                {t("shippingNote")}
              </p>
              <button
                type="button"
                disabled
                className="font-label h-13 w-full bg-flash text-[14px] text-paper opacity-60"
              >
                {t("checkout")}
              </button>
              <p className="mt-2 text-[12px] leading-snug text-smoke">{t("demoNote")}</p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
