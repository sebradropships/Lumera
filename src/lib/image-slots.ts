import type { ProductImage } from "@/data/media";

/**
 * ── WHICH STORE PHOTO GOES WHERE ─────────────────────────────────────────────
 *
 * The page has three kinds of image slot, and they want different pictures: the
 * hero wants product and lifestyle photography, the benefit cards want
 * supporting detail, and the ritual strip wants one wide frame. Feeding it the
 * whole media library instead put every infographic into the hero carousel.
 *
 * So position in Shopify decides the slot. Reorder the product's media in the
 * Shopify admin and the page follows — no code change, no deploy:
 *
 *     1 – 3   hero gallery, in order
 *     4 – 6   the three benefit cards
 *     7       the "how it works" strip
 *
 * Images narrower than 1000px are skipped rather than reordered: Shopify's
 * featured image is often a low-res thumbnail of a shot already in the set, and
 * it would read as soft in a full-bleed hero. Skipping keeps the numbering above
 * predictable, which reordering would not.
 *
 * Anything set explicitly in data/media.ts still wins over all of this.
 */
const MIN_WIDTH = 1000;

export type ImageSlots = {
  gallery: ProductImage[];
  benefits: (ProductImage | null)[];
  ritual: ProductImage | null;
};

export function imageSlots(photos: ProductImage[]): ImageSlots {
  const usable = photos.filter((p) => (p.width ?? MIN_WIDTH) >= MIN_WIDTH);
  const pool = usable.length > 0 ? usable : photos;

  return {
    gallery: pool.slice(0, 3),
    benefits: [pool[3] ?? null, pool[4] ?? null, pool[5] ?? null],
    ritual: pool[6] ?? pool[0] ?? null,
  };
}
