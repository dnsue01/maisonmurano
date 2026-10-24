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
import { formatMoney, type Product, isOneSize } from "@/lib/shopify";

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
  const [selected, setSelected] = useState<string | null>(
    product.variants.length === 1 && product.variants[0].available ? product.variants[0].id : null
  );
  const [error, setError] = useState(false);

  const variant = product.variants.find((v) => v.id === selected);
  const { isGiftCard } = product;
  const price = variant?.price ?? product.price;
  const money = (amount: number) => formatMoney(amount, price.currencyCode, locale);

  return (
    <>
      <div className="mt-4 flex items-baseline gap-3">
        {product.compareAtPrice && (
          <span className="text-lg text-muted-foreground line-through">
            {money(product.compareAtPrice.amount)}
          </span>
        )}
        <span className="text-2xl font-semibold">
          {isGiftCard && !variant
            ? t("from", { price: money(price.amount) })
            : money(price.amount)}
        </span>
      </div>

      {children}

      <div className="mt-8 flex flex-col gap-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase">
              {isGiftCard ? t("amount") : t("size")}
            </span>
            {!isGiftCard && sizeGuide && (
              <Dialog>
                <DialogTrigger className="text-xs text-muted-foreground underline">
                  {t("sizeGuide")}
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                  <DialogTitle className="font-display text-3xl uppercase">
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
                  "min-w-12 border px-3 py-2 text-sm font-medium transition-colors",
                  selected === v.id
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/30 hover:border-ink",
                  !v.available &&
                    "cursor-not-allowed border-ink/10 text-ink/30 line-through hover:border-ink/10"
                )}
              >
                {isOneSize(v.title) ? t("oneSize") : v.title}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-xs text-tc-red">
              {isGiftCard ? t("selectAmount") : t("selectSize")}
            </p>
          )}
        </div>

        <Button
          size="lg"
          disabled={!product.available}
          onClick={() => {
            if (!variant) {
              setError(true);
              return;
            }
            addLine(product, variant);
          }}
          className="w-full"
        >
          {product.available ? t("addToCart") : t("soldOut")}
        </Button>
      </div>
    </>
  );
}
