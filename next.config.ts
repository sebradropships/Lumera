import type { NextConfig } from "next";

/**
 * Meta's catalog syncs from Shopify, so Instagram Shop hands shoppers Shopify's
 * own URL shape -- /products/<handle>, /collections/<handle> -- and "View on
 * website" dropped them on a 404, because this storefront is one page at the
 * root and has no such routes.
 *
 * 307 rather than 308: nothing at those paths is indexed or in the sitemap, and
 * a permanent redirect is cached by the browser for as long as it pleases, which
 * would fight us the day a real /products/<handle> route exists. A temporary one
 * costs nothing here and stays reversible.
 *
 * Query strings survive the hop. Next merges the incoming request's query into
 * the destination whenever the destination declares none of its own, so
 * ?fbclid=, ?utm_* and ?variant= all reach / intact -- which the inline pixel
 * and /api/capi both depend on, since fbc is built from the fbclid on the
 * landing URL and a stripped one would break click attribution.
 */
const CATALOG_PATHS = ["/products", "/collections"];

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
  async redirects() {
    /* :path* is zero-or-more, so one rule per prefix covers the bare
       /collections as well as /collections/anything/deeper. */
    return CATALOG_PATHS.map((base) => ({
      source: `${base}/:path*`,
      destination: "/",
      permanent: false,
    }));
  },
};

export default nextConfig;
