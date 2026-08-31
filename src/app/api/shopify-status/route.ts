import { NextResponse } from "next/server";
import {
  adminConfigured,
  adminGraphQL,
  apiVersion,
  fetchLiveProduct,
  lastProductFailure,
  productQuery,
  storeDomain,
} from "@/lib/shopify-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Diagnostic for the Shopify connection. Visit /api/shopify-status.
 *
 * Runs three probes in order so the answer is specific rather than "it didn't
 * work": reach the shop, count the products, then run the real query. Each one
 * failing means something different and has a different fix.
 *
 * Returns no secrets — no token, no customer or order data. Only configuration
 * state and the product facts the page already renders publicly.
 */

type ShopData = { shop?: { name: string; myshopifyDomain: string; currencyCode?: string } };
type CountData = { productsCount?: { count: number } };

export async function GET() {
  const base = { storeDomain: storeDomain || null, apiVersion, productQuery };

  if (!adminConfigured) {
    return NextResponse.json({
      live: false,
      reason: "not_configured",
      detail:
        "SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN must both be set. On Vercel, add them for " +
        "the Production environment and then Redeploy — 'Promote to Production' reuses the old " +
        "build and will not pick them up.",
      ...base,
    });
  }

  // Probe 1 — can we reach the store and is the token valid at all?
  const shop = await adminGraphQL<ShopData>(
    `{ shop { name myshopifyDomain currencyCode } }`,
    {},
    0,
  );

  if (!shop.ok) {
    return NextResponse.json({
      live: false,
      reason: "cannot_reach_shop",
      detail: shop.error,
      hint:
        shop.status === 401
          ? "401 means the admin token is wrong, revoked, or belongs to a different store."
          : shop.status === 404
            ? `404 usually means API version ${apiVersion} is no longer supported. Set SHOPIFY_API_VERSION to a current one.`
            : "Check that the store domain is exactly <store>.myshopify.com.",
      ...base,
    });
  }

  // Probe 2 — does the token carry read_products, and are there any products?
  const count = await adminGraphQL<CountData>(`{ productsCount { count } }`, {}, 0);

  if (!count.ok) {
    return NextResponse.json({
      live: false,
      reason: "cannot_read_products",
      detail: count.error,
      hint:
        "The store is reachable but products are not. This is almost always a missing " +
        "read_products scope: Shopify admin → Settings → Apps and sales channels → Develop apps → " +
        "your app → Configuration → Admin API scopes → enable read_products, save, then reinstall " +
        "the app and use the NEW token.",
      shop: shop.data.shop?.name ?? null,
      ...base,
    });
  }

  // Probe 3 — the query the page actually runs.
  const product = await fetchLiveProduct();

  if (!product) {
    const failure = lastProductFailure();
    return NextResponse.json({
      live: false,
      reason: failure?.reason ?? "product_not_resolved",
      detail: failure?.detail ?? "The product query returned nothing.",
      hint:
        count.data.productsCount?.count === 0
          ? "The store has no products yet. Create one and publish it."
          : `The store has ${count.data.productsCount?.count} product(s) but none matched. If yours ` +
            "is a draft, publish it — or set SHOPIFY_PRODUCT_HANDLE to its exact handle to target " +
            "it regardless of status.",
      shop: shop.data.shop?.name ?? null,
      productCount: count.data.productsCount?.count ?? null,
      ...base,
    });
  }

  return NextResponse.json({
    live: true,
    shop: shop.data.shop?.name ?? null,
    productCount: count.data.productsCount?.count ?? null,
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
    ...base,
  });
}
