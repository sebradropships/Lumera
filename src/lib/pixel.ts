import type { ProductVariant } from "@/data/product";

/**
 * Meta Pixel event helpers.
 *
 * Every call goes through `track`, which is a no-op when `fbq` is missing.
 * That is the common case, not the rare one: ad blockers remove the pixel
 * outright, and analytics must never be able to break a purchase.
 */

/** Prices are held in cents; Meta expects major units. */
export function toMajorUnits(cents: number): number {
  return Math.round(cents) / 100;
}

export type PixelLine = { variant: ProductVariant; quantity: number };

/** Prefer the Shopify variant id so events reconcile with a synced catalogue. */
function contentId(variant: ProductVariant): string {
  return variant.shopifyVariantId ?? variant.id;
}

export function track(
  event: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase",
  params: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

/** Shared shape for the commerce events: ids, line detail, value and currency. */
export function contentPayload(
  lines: PixelLine[],
  currency: string,
  contentName: string,
): Record<string, unknown> {
  const value = lines.reduce((sum, l) => sum + l.variant.price * l.quantity, 0);
  return {
    content_type: "product",
    content_name: contentName,
    content_ids: lines.map((l) => contentId(l.variant)),
    contents: lines.map((l) => ({
      id: contentId(l.variant),
      quantity: l.quantity,
      item_price: toMajorUnits(l.variant.price),
    })),
    num_items: lines.reduce((sum, l) => sum + l.quantity, 0),
    value: toMajorUnits(value),
    currency,
  };
}
