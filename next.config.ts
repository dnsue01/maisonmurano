import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Local preview only: lets a test browser load the store images directly.
    unoptimized: process.env.MM_UNOPTIMIZED === "1",
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "maisonmurano.es" },
    ],
  },
};

export default withNextIntl(nextConfig);
