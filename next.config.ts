import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Local preview only: lets a test browser load the store images directly.
    unoptimized: process.env.MM_UNOPTIMIZED === "1",
    // Shopify originals are up to 3600px PNGs: serve resized AVIF/WebP instead.
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    imageSizes: [64, 96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "maisonmurano.es" },
    ],
  },
};

export default withNextIntl(nextConfig);
