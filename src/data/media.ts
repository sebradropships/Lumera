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

/**
 * How product photography is settled into the pink page. See PhotoFrame.tsx.
 *
 *   "frame"    pink vignette + a breath of blush over the photo. Safe for any
 *              image, including shots on grey or with their own background.
 *   "multiply" white backgrounds vanish into the page entirely. Strongest
 *              result, but only when the backdrop is genuinely white — grey
 *              turns muddy and dark products lose contrast.
 *   "none"     as shot, hairline only.
 *
 * If the store's shots are on pure white, "multiply" is worth trying first.
 */
export const photoBlend: "frame" | "multiply" | "none" = "frame";

export type ProductImage = {
  src: string;
  /** Describe what is actually in the frame — this is the accessible label. */
  alt: string;
  width?: number;
  height?: number;
};

export type ProductVideo = {
  /** H.264 MP4. Safari plays HEVC, Chrome and Firefox largely do not. */
  src: string;
  /** Still shown before playback and while the file loads. */
  poster?: string;
  /** Describe what happens in the clip — silent decoration needs no caption. */
  alt: string;
  width?: number;
  height?: number;
};

/**
 * Clip for the "how it works" panel. Empty → the store's own video, then the
 * ritual photo.
 *
 * PREFER UPLOADING TO SHOPIFY (product → Media → Add video). Shopify transcodes
 * to several resolutions and serves from its CDN, and the page picks it up with
 * no deploy. A file in public/ is committed to git forever, ships whole to every
 * visitor at one size, and GitHub refuses anything over 100MB — phone footage
 * reaches that quickly.
 */
export const ritualVideo: ProductVideo | null = {
  src: "/ritual.mp4",
  poster: "/ritual-poster.jpg",
  alt: "The mask being applied and smoothed over the face",
  width: 720,
  height: 1280,
};

/** Hero gallery. Empty → the store's photography, then the SVG panels. */
export const gallery: ProductImage[] = [];

/** "How it works" strip. Empty → a later frame from the store's photos. */
export const ritualImage: ProductImage | null = null;

/** The three benefit cards, in order. Empty → the store's photos, offset
 * past the hero frame so the cards are not a repeat of it. */
export const benefitImages: (ProductImage | null)[] = [
  {
    src: "/benefit-hydration.jpg",
    alt: "Close-up of hydrated skin with a focus bracket over the cheek",
    width: 796,
    height: 995,
  },
  // 02 has no photograph yet, so it keeps the drawn art panel.
  null,
  {
    src: "/benefit-radiance.jpg",
    alt: "Close-up of a cheek with a dewy highlight",
    width: 1000,
    height: 1250,
  },
];
