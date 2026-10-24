import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";
import "../globals.css";

const archivo = localFont({
  variable: "--font-archivo",
  display: "swap",
  src: [
    { path: "../fonts/archivo-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/archivo-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/archivo-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/archivo-latin-700-normal.woff2", weight: "700" },
    { path: "../fonts/archivo-latin-800-normal.woff2", weight: "800" },
  ],
});


// Varsity block lettering, matching the felt letters on the Tiger Camo hoodie.
const varsity = localFont({
  variable: "--font-varsity",
  display: "swap",
  src: [{ path: "../fonts/graduate-latin-400-normal.woff2", weight: "400" }],
});

export const metadata: Metadata = {
  title: {
    default: "Maison Murano — Streetwear",
    template: "%s · Maison Murano",
  },
  description:
    "Maison Murano: streetwear de edición limitada nacido en una habitación. Para los que sueñan despiertos.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${varsity.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink" suppressHydrationWarning>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
