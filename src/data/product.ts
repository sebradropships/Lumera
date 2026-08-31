/**
 * Single source of truth for the Lumera product, pricing and offer copy.
 *
 * ── Connecting the live Shopify store ────────────────────────────────────────
 * Set these two in `.env.local` (see `.env.example`) and everything below
 * becomes a fallback — the live store supplies the title, prices, variants and
 * photography instead:
 *
 *   SHOPIFY_STORE_DOMAIN   your-store.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN    Admin API access token (server-only secret)
 *
 * The prices here are placeholders until then. Update `price` /
 * `compareAtPrice` — in cents — if you want to run without the store.
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
   * Fallback variants, mirroring the live store so the page is accurate and
   * purchasable even if the Shopify call fails. Shopify overrides these when
   * it answers.
   *
   * These mirror the store: $39.00 against a $65.00 compare-at price, which is
   * exactly 40% off. Change the price in Shopify, not here — this is only the
   * fallback for when the Admin API cannot be reached.
   *
   * Add more entries (3-pack, 5-pack) and the selector appears automatically —
   * but only if those variants genuinely exist in the store, or checkout will
   * reject them.
   */
  variants: [
    {
      id: "47728384606379",
      title: "Bio-Collagen Gel Mask",
      note: "One glow ritual",
      price: 3900,
      compareAtPrice: 6500,
      shopifyVariantId: "47728384606379",
      shopifyVariantGid: "gid://shopify/ProductVariant/47728384606379",
      default: true,
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
