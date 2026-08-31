/**
 * ── PRODUCT IMAGERY ──────────────────────────────────────────────────────────
 *
 * Every image slot resolves in the same order:
 *
 *     1. an override listed here
 *     2. the connected store's own photography
 *     3. the built-in SVG art panels
 *
 * So LEAVE THESE EMPTY in the normal case — the store is the source, and
 * changing a photo in Shopify changes the site. Fill one only to override the
 * store for a particular slot, such as a shoot that never went into Shopify.
 *
 * TO OVERRIDE:
 *   • Drop files into `public/product/` and reference them as `/product/x.jpg`, or
 *   • paste Shopify CDN URLs (`https://cdn.shopify.com/...`, already allow-listed
 *     in next.config.ts).
 *
 * The gallery frame is square, matching typical Shopify product exports, so a
 * 1:1 image is shown uncropped. Anything else is cover-cropped to fit.
 */

export type ProductImage = {
  src: string;
  /** Describe what is actually in the frame — this is the accessible label. */
  alt: string;
  width?: number;
  height?: number;
};

/** Hero gallery. Empty → the store's photography, then the SVG panels. */
export const gallery: ProductImage[] = [];

/** "How it works" strip. Empty → a later frame from the store's photos. */
export const ritualImage: ProductImage | null = null;

/** The three benefit cards, in order. Empty → the store's photos, offset
 * past the hero frame so the cards are not a repeat of it. */
export const benefitImages: ProductImage[] = [];
