/**
 * Single source of truth for the Hoygi product, pricing and offer copy.
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
  brand: "HOYGI",
  title: "Hoygi Bio-Collagen Gel Face Mask",
  shortTitle: "Bio-Collagen Gel Mask",
  eyebrow: "KOREAN GLASS SKIN FACE MASK",
  headline: "Your Skin's 40-Minute Glow Reset.",
  subhead:
    "A bio-collagen gel mask designed to deeply hydrate and leave skin looking smoother, fresher and visibly radiant.",
  currency: "USD",

  /**
   * Fallback variants, mirroring the live store so the page is accurate and
   * purchasable even if the Shopify call fails. Shopify overrides these when
   * it answers.
   *
   * These mirror the store: $19.00 against a $45.00 compare-at price, which is
   * 58% off — the 4-pack works out at $4.75 a mask. Both figures mirror the
   * Shopify admin as of 2026-09-29. Change the price in Shopify and here in
   * the same breath — this is only the fallback for when the Admin API cannot
   * be reached, and a fallback that disagrees with checkout is worse than
   * none.
   *
   * Add more entries (3-pack, 5-pack) and the selector appears automatically —
   * but only if those variants genuinely exist in the store, or checkout will
   * reject them.
   *
   * THE VARIANT IDS BELOW MUST MATCH LIVE VARIANTS. They are only used when the
   * Admin API is unreachable, which is exactly when nobody is watching, and a
   * checkout permalink built from a deleted variant fails at Shopify rather
   * than here. Relisting the product — a new supplier, a re-import — mints new
   * ids and strands these, so re-check them whenever the product is replaced.
   */
  variants: [
    {
      id: "47734541877419",
      title: "Bio-Collagen Gel Mask",
      note: "One glow ritual",
      price: 1900,
      compareAtPrice: 4500,
      shopifyVariantId: "47734541877419",
      shopifyVariantGid: "gid://shopify/ProductVariant/47734541877419",
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
    ctaPrimary: "GET MY HOYGI MASK",
    ctaFinal: "GET HOYGI NOW",
    microcopy: "Free shipping · Secure checkout",
    /**
     * Shipping promise, written once and read everywhere it appears — the
     * strip, the purchase panel, the cart and the closing offer.
     *
     * Unconditional, and true as written: the customer pays $0 for shipping on
     * every order, with no minimum spend and no order threshold. Hoygi settles
     * the freight with CJ Dropshipping directly rather than billing it at
     * checkout, so there is no rate for this promise to contradict.
     *
     * It must still match the store's own rates. If a paid rate is ever
     * reintroduced in Shopify, change this string in the same breath — the
     * strip, the panel, the cart and the closing offer all read from here.
     */
    shipping: "Free shipping",
    shippingCaps: "FREE SHIPPING",
  },
} as const;

export const defaultVariant: ProductVariant =
  product.variants.find((v) => v.default) ?? product.variants[0];

export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars.toFixed(0)}` : `$${dollars.toFixed(2)}`;
}

export function savingsPercent(v: ProductVariant): number | null {
  if (!v.compareAtPrice || v.compareAtPrice <= v.price) return null;
  return Math.round((1 - v.price / v.compareAtPrice) * 100);
}
