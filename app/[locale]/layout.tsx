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

const narrow = localFont({
  variable: "--font-archivo-narrow",
  display: "swap",
  src: [
    { path: "../fonts/archivo-narrow-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/archivo-narrow-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/archivo-narrow-latin-700-normal.woff2", weight: "700" },
  ],
});

const blackletter = localFont({
  variable: "--font-blackletter",
  display: "swap",
  src: [{ path: "../fonts/pirata-one-latin-400-normal.woff2", weight: "400" }],
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
      className={`${archivo.variable} ${narrow.variable} ${blackletter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-wall text-paper" suppressHydrationWarning>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
