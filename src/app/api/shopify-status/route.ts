import { NextResponse } from "next/server";
import { fetchLiveProduct } from "@/lib/shopify-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Diagnostic for the Shopify connection. Visit /api/shopify-status to see
 * whether the live store is being used, and if not, why.
 *
 * Deliberately returns no secrets — no token, no customer or order data. Only
 * whether the two env vars are set, whether the product resolved, and counts
 * plus the first image URL so you can confirm it is really coming from
 * cdn.shopify.com.
 */
export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "") ?? "";
  const hasToken = Boolean(process.env.SHOPIFY_ADMIN_TOKEN?.trim());

  if (!domain || !hasToken) {
    return NextResponse.json({
      live: false,
      reason: "not_configured",
      detail: [
        !domain && "SHOPIFY_STORE_DOMAIN is not set",
        !hasToken && "SHOPIFY_ADMIN_TOKEN is not set",
      ]
        .filter(Boolean)
        .join("; "),
      storeDomain: domain || null,
    });
  }

  const product = await fetchLiveProduct();

  if (!product) {
    return NextResponse.json({
      live: false,
      reason: "product_not_resolved",
      detail:
        "Both env vars are set but no product came back. Check the deployment logs for a line " +
        "starting with [shopify] — 401 means the token is wrong or revoked, 403 means the app is " +
        "missing the read_products scope, and 'No product matched' usually means the product is " +
        "still a draft. Set SHOPIFY_PRODUCT_HANDLE to target one product exactly.",
      storeDomain: domain,
      productQuery: process.env.SHOPIFY_PRODUCT_HANDLE
        ? `handle:${process.env.SHOPIFY_PRODUCT_HANDLE}`
        : (process.env.SHOPIFY_PRODUCT_QUERY?.trim() || "status:active"),
    });
  }

  return NextResponse.json({
    live: true,
    storeDomain: domain,
    title: product.title,
    handle: product.handle,
    imageCount: product.images.length,
    firstImage: product.images[0]?.src ?? null,
    variants: product.variants.map((v) => ({
      title: v.title,
      price: v.price / 100,
      compareAtPrice: v.compareAtPrice ? v.compareAtPrice / 100 : null,
      hasCheckoutId: Boolean(v.shopifyVariantId),
    })),
  });
}
