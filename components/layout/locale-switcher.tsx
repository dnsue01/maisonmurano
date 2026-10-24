"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={cn("flex items-center gap-1 text-xs font-semibold", className)}>
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-paper/30">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            className={cn(
              "uppercase transition-opacity hover:opacity-100",
              locale === loc ? "opacity-100 underline" : "opacity-50"
            )}
            aria-current={locale === loc}
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  );
}
