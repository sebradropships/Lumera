import { cache } from "react";
import { gallery as localGallery, type ProductImage } from "@/data/media";
import { product as localProduct, type ProductVariant } from "@/data/product";
import { fetchLiveProduct } from "@/lib/shopify-admin";
import { storefrontConfigured } from "@/lib/shopify";

/**
 * The product as the page should render it: live Shopify data when the store is
 * connected, the local defaults otherwise.
 *
 * Shopify owns commerce facts — price, compare-at price, variants, checkout ids
 * and photography. Everything a shopper reads as brand voice stays in
 * src/data/product.ts, the product NAME included.
 *
 * That split matters for a dropshipped catalogue: the store's own title is the
 * supplier's SEO string ("Hoygi Collagen Moisturizing And Anti-Wrinkle Mask
 * (Bag) Three-In-One..."), and pasting it into a branded landing page undoes
 * the brand. Set SHOPIFY_USE_LIVE_TITLE=true if the store title really is the
 * one customers should see.
 */
export type ResolvedProduct = {
  title: string;
  shortTitle: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  currency: string;
  variants: ProductVariant[];
  images: ProductImage[];
  benefits: typeof localProduct.benefits;
  offer: typeof localProduct.offer;
  /** True when prices and photography came from the live store. */
  isLive: boolean;
  /** Store domain, resolved server-side so checkout needs no build-time var. */
  shopifyDomain: string;
  /** True when a Storefront token makes /api/checkout worth calling. */
  storefrontConfigured: boolean;
};

export const getProduct = cache(async (): Promise<ResolvedProduct> => {
  const shopifyDomain =
    process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "") ?? "";

  const base = {
    shopifyDomain,
    storefrontConfigured,
    title: localProduct.title,
    shortTitle: localProduct.shortTitle,
    eyebrow: localProduct.eyebrow,
    headline: localProduct.headline,
    subhead: localProduct.subhead,
    currency: localProduct.currency,
    benefits: localProduct.benefits,
    offer: localProduct.offer,
  };

  const live = await fetchLiveProduct(localProduct.title);

  if (!live) {
    return {
      ...base,
      variants: [...localProduct.variants],
      images: localGallery,
      isLive: false,
    };
  }

  const useLiveTitle = process.env.SHOPIFY_USE_LIVE_TITLE === "true";

  return {
    ...base,
    title: useLiveTitle ? live.title : localProduct.title,
    shortTitle: useLiveTitle
      ? live.title.replace(/^Hoygi\s+/i, "")
      : localProduct.shortTitle,
    variants: live.variants,
    // Local photography, when present, still wins — it's the deliberate choice.
    images: localGallery.length > 0 ? localGallery : live.images,
    isLive: true,
  };
});

export function defaultVariantOf(p: ResolvedProduct): ProductVariant {
  return p.variants.find((v) => v.default) ?? p.variants[0];
}
