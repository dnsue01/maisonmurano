import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CartView } from "@/components/cart/cart-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cart");
  return { title: t("title") };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <CartView />
    </div>
  );
}
