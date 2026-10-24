import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPolicy } from "@/lib/shopify/content";

const POLICY_HANDLES: Record<string, string> = {
  privacidad: "privacy-policy",
  terminos: "terms-of-service",
  envios: "shipping-policy",
  reembolsos: "refund-policy",
  contacto: "contact-information",
  "aviso-legal": "legal-notice",
};

export async function generateStaticParams() {
  return Object.keys(POLICY_HANDLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICY_HANDLES[slug] && (await getPolicy(POLICY_HANDLES[slug]));
  return { title: policy ? policy.title : slug };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const policy = POLICY_HANDLES[slug] && (await getPolicy(POLICY_HANDLES[slug]));
  if (!policy) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="mb-8 font-display text-4xl uppercase md:text-6xl">{policy.title}</h1>
      <div className="shopify-rte" dangerouslySetInnerHTML={{ __html: policy.html }} />
    </div>
  );
}
