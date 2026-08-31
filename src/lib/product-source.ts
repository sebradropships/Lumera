import { cache } from "react";
import { gallery as localGallery, type ProductImage } from "@/data/media";
import { product as localProduct, type ProductVariant } from "@/data/product";
import { fetchLiveProduct } from "@/lib/shopify-admin";

/**
 * The product as the page should render it: live Shopify data when the store is
 * connected, the local defaults otherwise.
 *
 * Marketing copy (headline, eyebrow, benefits, CTA labels) always comes from
 * src/data/product.ts — Shopify owns commerce facts, not the funnel copy.
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
};

export const getProduct = cache(async (): Promise<ResolvedProduct> => {
  const shopifyDomain =
    process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "") ?? "";

  const base = {
    shopifyDomain,
    title: localProduct.title,
    shortTitle: localProduct.shortTitle,
    eyebrow: localProduct.eyebrow,
    headline: localProduct.headline,
    subhead: localProduct.subhead,
    currency: localProduct.currency,
    benefits: localProduct.benefits,
    offer: localProduct.offer,
  };

  const live = await fetchLiveProduct();

  if (!live) {
    return {
      ...base,
      variants: [...localProduct.variants],
      images: localGallery,
      isLive: false,
    };
  }

  return {
    ...base,
    title: live.title,
    // Keep the short label tight for the sticky bar and cart lines.
    shortTitle: live.title.replace(/^Lumera\s+/i, "") || localProduct.shortTitle,
    variants: live.variants,
    // Local photography, when present, still wins — it's the deliberate choice.
    images: localGallery.length > 0 ? localGallery : live.images,
    isLive: true,
  };
});

export function defaultVariantOf(p: ResolvedProduct): ProductVariant {
  return p.variants.find((v) => v.default) ?? p.variants[0];
}
