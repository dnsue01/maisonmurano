"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatMoney, isCutout, type Product } from "@/lib/shopify";

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const onSale = !!product.compareAtPrice;

  return (
    <Link href={`/productos/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden border border-ink bg-secondary">
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].altText}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`transition-opacity duration-300 ${product.images[1] ? "group-hover:opacity-0" : ""} ${isCutout(product.images[0].url) ? "object-contain p-[10%]" : "object-cover"}`}
          />
        )}
        {product.images[1] && (
          <Image
            src={product.images[1].url}
            alt={product.images[1].altText}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="scale-105 object-cover opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {onSale && (
            <Badge className="rounded-none bg-tc-red text-cream">SALE</Badge>
          )}
          {!product.available && (
            <Badge className="rounded-none bg-ink text-cream">SOLD OUT</Badge>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase">{product.title}</h3>
        <div className="flex items-baseline gap-2 whitespace-nowrap">
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatMoney(
                product.compareAtPrice!.amount,
                product.price.currencyCode,
                locale
              )}
            </span>
          )}
          <span className="text-sm font-semibold">
            {formatMoney(product.price.amount, product.price.currencyCode, locale)}
          </span>
        </div>
      </div>
    </Link>
  );
}
