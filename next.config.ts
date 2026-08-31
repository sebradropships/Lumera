import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Product photography is the whole pitch on a single-product page, so it is
    // served well above the default 75. 75 stays available for anything
    // incidental.
    qualities: [75, 92],
    // Shopify CDN is allowed so product imagery can be served straight from the store.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default nextConfig;
