/**
 * Single source of truth for the Lumera product, pricing and offer copy.
 *
 * ── Connecting the live Shopify store ────────────────────────────────────────
 * Set these in `.env.local` (see `.env.example`) and the values below are used
 * only as the build-time fallback:
 *
 *   NEXT_PUBLIC_SHOPIFY_DOMAIN        your-store.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_VARIANT_ID    numeric variant id (cart permalink checkout)
 *   SHOPIFY_STOREFRONT_TOKEN          Storefront API token (Cart API checkout)
 *
 * Prices here are placeholders until the store is connected — update
 * `price` / `compareAtPrice` to the real launch numbers, or let the Storefront
 * API supply them.
 */

export type ProductVariant = {
  /** Stable id used by the local cart. */
  id: string;
  /** Customer-facing option label, e.g. "1 Mask" / "3-Pack". */
  title: string;
  /** Optional short line under the option label. */
  note?: string;
  /** Price in cents (USD). */
  price: number;
  /** Original price in cents, shown struck through. Omit for no discount. */
  compareAtPrice?: number;
  /** Numeric Shopify variant id, e.g. "45123456789012". Required for checkout. */
  shopifyVariantId?: string;
  /** Storefront API GID, e.g. "gid://shopify/ProductVariant/45123456789012". */
  shopifyVariantGid?: string;
  /** Marks the option pre-selected on load. */
  default?: boolean;
  /** Small badge on the option, e.g. "BEST VALUE". Keep honest. */
  badge?: string;
};

export const product = {
  brand: "LUMERA",
  title: "Lumera Bio-Collagen Gel Face Mask",
  shortTitle: "Bio-Collagen Gel Mask",
  eyebrow: "THE GLOW RITUAL",
  headline: "Your Skin's 20-Minute Glow Reset.",
  subhead:
    "A bio-collagen gel mask designed to deeply hydrate and leave skin looking smoother, fresher and visibly radiant.",
  currency: "USD",

  /**
   * Variants. A single default variant is enough — add more (3-pack, 5-pack)
   * and the selector appears automatically.
   */
  variants: [
    {
      id: "single",
      title: "1 Mask",
      note: "One glow ritual",
      price: 3900,
      compareAtPrice: 6500,
      default: true,
    },
    {
      id: "trio",
      title: "3 Masks",
      note: "A month of rituals",
      price: 9900,
      compareAtPrice: 19500,
      badge: "BEST VALUE",
    },
  ] as ProductVariant[],

  benefits: [
    { label: "HYDRATING", icon: "drop" as const },
    { label: "SMOOTHING", icon: "leaf" as const },
    { label: "RADIANCE BOOST", icon: "sparkle" as const },
  ],

  offer: {
    label: "LIMITED OFFER",
    urgency: "Limited offer · ends soon",
    ctaPrimary: "GET MY LUMERA MASK",
    ctaFinal: "GET LUMERA NOW",
    microcopy: "Secure checkout · Fast US delivery",
  },
} as const;

export const defaultVariant: ProductVariant =
  product.variants.find((v) => v.default) ?? product.variants[0];

export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars)
    ? `$${dollars.toFixed(0)}`
    : `$${dollars.toFixed(2)}`;
}

export function savingsPercent(v: ProductVariant): number | null {
  if (!v.compareAtPrice || v.compareAtPrice <= v.price) return null;
  return Math.round((1 - v.price / v.compareAtPrice) * 100);
}
