"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid } from "./product-grid";
import { sortProducts, type Product, type SortKey } from "@/lib/shopify";
import { matchesQuery } from "@/lib/search";

type Availability = "all" | "in" | "out";

export function ProductsBrowser({ products }: { products: Product[] }) {
  const t = useTranslations("products");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [availability, setAvailability] = useState<Availability>("all");

  const query = useSearchParams().get("q")?.trim() ?? "";

  const visible = useMemo(() => {
    let list = products;
    if (query) {
      list = list.filter((p) =>
        matchesQuery(`${p.title} ${p.tags.join(" ")} ${p.descriptionEs} ${p.description}`, query)
      );
    }
    if (availability === "in") list = list.filter((p) => p.available);
    if (availability === "out") list = list.filter((p) => !p.available);
    return sortProducts(list, sort);
  }, [products, query, sort, availability]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink/15 pb-4">
        <p className="text-sm text-muted-foreground">
          {query ? `${t("searchResults", { query })} · ` : ""}
          {t("results", { count: visible.length })}
          {query && (
            <>
              {" · "}
              <Link href="/productos" className="underline">
                {t("clearSearch")}
              </Link>
            </>
          )}
        </p>

        <div className="flex items-center gap-3">
          <Select
            value={availability}
            onValueChange={(v) => setAvailability(v as Availability)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("availability")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("availability")}</SelectItem>
              <SelectItem value="in">{t("inStock")}</SelectItem>
              <SelectItem value="out">{t("outStock")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">{t("sort.relevance")}</SelectItem>
              <SelectItem value="bestSelling">{t("sort.bestSelling")}</SelectItem>
              <SelectItem value="newest">{t("sort.newest")}</SelectItem>
              <SelectItem value="priceAsc">{t("sort.priceAsc")}</SelectItem>
              <SelectItem value="priceDesc">{t("sort.priceDesc")}</SelectItem>
              <SelectItem value="az">{t("sort.az")}</SelectItem>
              <SelectItem value="za">{t("sort.za")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <ProductGrid products={visible} />
      )}
    </div>
  );
}
