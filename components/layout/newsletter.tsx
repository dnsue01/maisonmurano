"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpinningStar } from "@/components/loader/spinning-star";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Drop alerts. Presentational in the proposal: wired to Shopify customers once the brand gives API access. */
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
    <section id="newsletter" className="scroll-mt-24 border-y border-cream/20 bg-olive px-4 py-16 text-cream md:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <SpinningStar className="mb-6 h-12 w-12 text-cream" />
        <h2 className="font-display text-4xl md:text-6xl">{t("title")}</h2>
        <p className="mt-3 max-w-md text-sm text-cream/80">{t("subtitle")}</p>

        {done ? (
          <p className="font-script mt-8 text-2xl text-khaki" role="status">{t("success")}</p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-8 flex w-full max-w-md flex-wrap justify-center gap-2">
            <Input
              type="email"
              name="email"
              required
              autoComplete="email"
              aria-label="Email"
              aria-invalid={error}
              placeholder={t("placeholder")}
              className="h-12 flex-1 border-cream/40 bg-transparent text-cream placeholder:text-cream/50"
            />
            <Button type="submit" size="lg" className="h-12 bg-cream px-6 text-ink hover:bg-khaki">
              {t("cta")}
            </Button>
            {error && <p className="w-full text-xs text-khaki">{t("error")}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
