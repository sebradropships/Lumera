/**
 * ── PRODUCT IMAGERY ──────────────────────────────────────────────────────────
 *
 * No product photography has been supplied yet, so the gallery renders the
 * built-in Lumera art panels (hand-drawn SVG, not stock photos or AI-generated
 * "product shots" that would misrepresent the real product).
 *
 * TO USE REAL PHOTOGRAPHY:
 *   • Drop files into `public/product/` and reference them as `/product/x.jpg`, or
 *   • paste Shopify CDN URLs (`https://cdn.shopify.com/...`, already allow-listed
 *     in next.config.ts).
 *
 * Fill `gallery` below and the SVG panels are replaced automatically. Shoot or
 * export at 1200×1500 (4:5) for the gallery; anything else is cover-cropped.
 */

export type ProductImage = {
  src: string;
  /** Describe what is actually in the frame — this is the accessible label. */
  alt: string;
  width?: number;
  height?: number;
};

/** Hero gallery. Empty → the SVG art panels are used. */
export const gallery: ProductImage[] = [];

/** Optional close-up used by the "How it works" strip. Empty → SVG art. */
export const ritualImage: ProductImage | null = null;

/** Optional images for the three benefit cards, in order. Empty → SVG art. */
export const benefitImages: ProductImage[] = [];
