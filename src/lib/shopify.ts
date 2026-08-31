/**
 * Shopify wiring.
 *
 * Two checkout paths, tried in order:
 *
 *  1. Storefront API (preferred) — requires SHOPIFY_STOREFRONT_TOKEN plus
 *     `shopifyVariantGid` on the variants. `/api/checkout` creates a real cart
 *     and returns Shopify's hosted `checkoutUrl`.
 *  2. Cart permalink (zero-config fallback) — requires only
 *     SHOPIFY_STORE_DOMAIN and numeric `shopifyVariantId`s. Builds
 *     `https://<domain>/cart/<variantId>:<qty>` which Shopify turns into a
 *     checkout.
 *
 * If neither is configured the UI keeps the cart local and tells the operator
 * the store is not connected yet, rather than sending the shopper nowhere.
 */

export type CheckoutLine = { variantId?: string; variantGid?: string; quantity: number };

/**
 * Whether the Storefront API path is usable. Resolved on the server so the
 * client can skip a round-trip to /api/checkout it already knows will decline.
 */
export const storefrontConfigured = Boolean(
  process.env.SHOPIFY_STOREFRONT_TOKEN?.trim() && process.env.SHOPIFY_STORE_DOMAIN?.trim(),
);

/**
 * Cart-permalink checkout URL, or null when the store or variant ids are
 * missing.
 *
 * The domain is passed in rather than read from a NEXT_PUBLIC_ variable: those
 * are inlined at build time, so a store connected after the fact would need a
 * rebuild. Resolving it server-side means setting the env var is enough.
 */
export function cartPermalink(lines: CheckoutLine[], domain: string): string | null {
  if (!domain) return null;
  const parts = lines
    .filter((l) => l.variantId && l.quantity > 0)
    .map((l) => `${l.variantId}:${l.quantity}`);
  if (parts.length === 0) return null;
  return `https://${domain}/cart/${parts.join(",")}`;
}

const API_VERSION = process.env.SHOPIFY_API_VERSION?.trim() || "2025-01";

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/** Server-only: creates a Shopify cart and returns its hosted checkout URL. */
export async function createStorefrontCheckout(
  lines: CheckoutLine[],
): Promise<string | null> {
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "") ?? "";
  if (!token || !domain) return null;

  const cartLines = lines
    .filter((l) => l.variantGid && l.quantity > 0)
    .map((l) => ({ merchandiseId: l.variantGid, quantity: l.quantity }));
  if (cartLines.length === 0) return null;

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: CART_CREATE, variables: { lines: cartLines } }),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: { cartCreate?: { cart?: { checkoutUrl?: string } } };
  };
  return json.data?.cartCreate?.cart?.checkoutUrl ?? null;
}
