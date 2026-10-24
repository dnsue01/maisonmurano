"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { LogoMark } from "@/components/brand/logo-mark";
import { LocaleSwitcher } from "./locale-switcher";
import { Search } from "./search";
import { useCart, cartCount } from "@/lib/cart/store";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { SearchItem } from "@/lib/search";

export function Header({ searchItems }: { searchItems: SearchItem[] }) {
  const t = useTranslations("nav");
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const count = cartCount(lines);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore the persisted cart after mount (skipHydration in the store)
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  const links = [
    { href: "/", label: t("shop") },
    { href: "/productos", label: t("products") },
    { href: "/nosotros", label: t("about") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/15 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: mobile menu + nav */}
        <div className="flex items-center gap-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden" aria-label={t("menu")}>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="bg-cream">
              <SheetHeader>
                <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6 px-6">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-3xl uppercase"
                  >
                    {l.label}
                  </Link>
                ))}
                <LocaleSwitcher className="mt-4" />
              </nav>
            </SheetContent>
          </Sheet>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold uppercase tracking-wide transition-colors hover:text-tc-red"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2"
          aria-label="Maison Murano"
        >
          <LogoMark className="h-7 w-7 text-ink" />
          <Wordmark className="hidden text-xl text-ink sm:inline" />
        </Link>

        {/* Right: locale, search, cart */}
        <div className="flex items-center gap-4">
          <LocaleSwitcher className="hidden sm:flex" />
          <Search items={searchItems} />
          <button
            aria-label={t("cart")}
            onClick={openCart}
            className="relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span
                className={cn(
                  "absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center",
                  "rounded-full bg-tc-red px-1 text-[10px] font-bold text-cream"
                )}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
