"use client";

import { useId, useMemo, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { formatMoney } from "@/lib/shopify";
import { matchesQuery, type SearchItem } from "@/lib/search";

const MAX_RESULTS = 6;

export function Search({ items }: { items: SearchItem[] }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label={t("search")} className="transition-colors hover:text-tc-red">
        <SearchIcon className="h-5 w-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-ink/60 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Popup
          initialFocus={inputRef}
          className="fixed inset-x-0 top-0 z-[60] max-h-dvh overflow-y-auto border-b-2 border-ink bg-background text-ink outline-none transition-transform duration-300 ease-out data-starting-style:-translate-y-full data-ending-style:-translate-y-full motion-reduce:transition-none"
        >
          <Dialog.Title className="sr-only">{t("search")}</Dialog.Title>
          <SearchPanel items={items} inputRef={inputRef} onNavigate={() => setOpen(false)} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SearchPanel({
  items,
  inputRef,
  onNavigate,
}: {
  items: SearchItem[];
  inputRef: RefObject<HTMLInputElement | null>;
  onNavigate: () => void;
}) {
  const t = useTranslations("search");
  const tp = useTranslations("products");
  const locale = useLocale();
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);

  const q = query.trim();
  const matches = useMemo(
    () => (q ? items.filter((i) => matchesQuery(`${i.title} ${i.tags.join(" ")}`, q)) : []),
    [items, q]
  );
  const shown = matches.slice(0, MAX_RESULTS);
  const allResults = { pathname: "/productos", query: { q } };

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!shown.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % shown.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? shown.length : a) - 1);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <form
        role="search"
        className="flex items-end gap-4 pb-6 pt-5 md:gap-8 md:pb-10 md:pt-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (!q) return;
          onNavigate();
          router.push(active >= 0 ? `/productos/${shown[active].handle}` : allResults);
        }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-label={t("placeholder")}
          aria-autocomplete="list"
          aria-expanded={shown.length > 0}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          placeholder={t("placeholder")}
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-none border-0 border-b-4 border-ink bg-transparent pb-1 font-display text-4xl uppercase leading-tight caret-tc-red outline-none placeholder:text-ink/25 md:text-7xl"
        />
        <Dialog.Close className="flex h-10 shrink-0 items-center gap-2 border-2 border-ink px-3 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          <X className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">{t("close")}</span>
        </Dialog.Close>
      </form>

      <p aria-live="polite" className="sr-only">
        {q ? tp("results", { count: matches.length }) : ""}
      </p>

      {q && shown.length > 0 && (
        <div className="pb-8 md:pb-12">
          <ul id={listId} role="listbox" aria-label={t("placeholder")} className="md:grid md:grid-cols-6 md:gap-4">
            {shown.map((item, i) => (
              <li key={item.handle} role="presentation">
                <Link
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  tabIndex={-1}
                  href={`/productos/${item.handle}`}
                  onClick={onNavigate}
                  className="group flex items-center gap-4 border-b border-ink/15 py-3 md:block md:border-0 md:py-0"
                >
                  <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden border border-ink bg-secondary outline-offset-2 group-hover:outline-2 group-hover:outline-ink group-aria-selected:outline-2 group-aria-selected:outline-tc-red md:w-full">
                    {item.image && (
                      <Image
                        src={item.image.url}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 64px, 16vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 md:mt-3">
                    <p className="truncate text-sm font-semibold uppercase group-hover:text-tc-red group-aria-selected:text-tc-red">
                      {item.title}
                    </p>
                    <p className="text-sm">
                      {formatMoney(item.price.amount, item.price.currencyCode, locale)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={allResults}
            onClick={onNavigate}
            className="mt-6 inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-sm font-semibold uppercase transition-colors hover:border-tc-red hover:text-tc-red md:mt-8"
          >
            {t("viewAll", { count: matches.length })}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {q && shown.length === 0 && (
        <div className="pb-8 md:pb-12">
          <p className="break-words font-display text-2xl uppercase md:text-4xl">{t.rich("empty", { query: q, q: (chunks) => <span className="text-tc-red">{chunks}</span> })}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("emptyHint")}</p>
          <Link
            href="/productos"
            onClick={onNavigate}
            className="mt-6 inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-sm font-semibold uppercase transition-colors hover:border-tc-red hover:text-tc-red"
          >
            {t("browseAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
