"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";
import { formatMoney, type Product } from "@/lib/shopify";

/**
 * Price, description (children), variant picker and add button. They share
 * the selected variant: a gift card's price follows the chosen amount.
 */
export function AddToCart({
  product,
  sizeGuide,
  children,
}: {
  product: Product;
  sizeGuide?: string | null;
  children?: React.ReactNode;
}) {
  const t = useTranslations("product");
  const locale = useLocale();
  const addLine = useCart((s) => s.addLine);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const variant = product.variants.find((v) => v.id === selected);
  const { isGiftCard } = product;
  const price = variant?.price ?? product.price;
  const money = (amount: number) => formatMoney(amount, price.currencyCode, locale);

  return (
    <>
      <div className="mt-4 flex items-baseline gap-3">
        {product.compareAtPrice && (
          <span className="tabular text-lg text-smoke line-through">
            {money(product.compareAtPrice.amount)}
          </span>
        )}
        <span className="tabular text-3xl font-semibold text-mustard">
          {isGiftCard && !variant
            ? t("from", { price: money(price.amount) })
            : money(price.amount)}
        </span>
      </div>

      {children}

      <div className="mt-8 flex flex-col gap-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-label text-[13px]">
              {isGiftCard ? t("amount") : t("size")}
            </span>
            {!isGiftCard && sizeGuide && (
              <Dialog>
                <DialogTrigger className="text-[13px] text-smoke underline underline-offset-4 hover:text-paper">
                  {t("sizeGuide")}
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                  <DialogTitle className="font-display text-4xl">
                    {t("sizeGuide")}
                  </DialogTitle>
                  <div className="shopify-rte" dangerouslySetInnerHTML={{ __html: sizeGuide }} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                disabled={!v.available}
                onClick={() => {
                  setSelected(v.id);
                  setError(false);
                }}
                className={cn(
                  "font-label h-11 min-w-12 border px-3 text-[13px] transition-colors",
                  selected === v.id
                    ? "border-mustard bg-mustard text-ink"
                    : "border-paper/35 hover:border-paper",
                  !v.available &&
                    "cursor-not-allowed border-paper/10 text-paper/30 line-through hover:border-paper/10"
                )}
              >
                {v.title}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-[13px] text-mustard" role="alert">
              {isGiftCard ? t("selectAmount") : t("selectSize")}
            </p>
          )}
        </div>

        <Button
          size="lg"
          disabled={!product.available}
          className="font-label h-14 w-full rounded-none bg-flash text-[15px] text-paper hover:bg-paper hover:text-ink"
          onClick={() => {
            if (!variant) {
              setError(true);
              return;
            }
            addLine(product, variant);
          }}
        >
          {product.available ? t("addToCart") : t("soldOut")}
        </Button>
      </div>
    </>
  );
}
