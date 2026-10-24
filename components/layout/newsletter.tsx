"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Cross } from "@/components/brand/cross";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Drop alerts sign-up. Presentational in the proposal: wired to Shopify customers once the brand gives API access. */
export function Newsletter() {
  const t = useTranslations("newsletter");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!EMAIL_RE.test(email)) return setError(true);
    setError(false);
    setDone(true);
  }

  return (
    <section id="newsletter" className="scroll-mt-24 border-t border-paper/10 bg-bottle px-4 py-20 text-paper md:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Cross className="mb-6 h-12 w-9 text-mustard" />
        <h2 className="font-display text-[clamp(3.25rem,9vw,6rem)]">{t("title")}</h2>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-paper/85">{t("subtitle")}</p>

        {done ? (
          <p className="font-label mt-9 text-[15px] text-mustard" role="status">{t("success")}</p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-9 flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">Email</label>
            <input
              id="nl-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={t("placeholder")}
              aria-invalid={error}
              className="h-13 flex-1 border-2 border-paper/50 bg-transparent px-4 text-[16px] text-paper placeholder:text-paper/55 focus:border-mustard focus:outline-none"
            />
            <button
              type="submit"
              className="font-label h-13 border-2 border-paper bg-paper px-7 text-[13px] text-ink transition-colors hover:border-mustard hover:bg-mustard"
            >
              {t("cta")}
            </button>
            {error && <p className="w-full text-left text-[13px] text-mustard sm:order-last">{t("error")}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
