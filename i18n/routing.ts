import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  // Spanish unless the visitor picks English; no Accept-Language redirect.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
