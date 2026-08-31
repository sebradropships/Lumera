import "server-only";
import { cache } from "react";
import type { ProductImage } from "@/data/media";
import type { ProductVariant } from "@/data/product";

/**
 * Server-side Shopify Admin API client.
 *
 * When SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN are set, the live store
 * becomes the source of truth for the product title, prices and photography —
 * images are served straight from cdn.shopify.com. Without them the page falls
 * back to the local defaults in src/data/.
 *
 * The Admin token is a server-only secret. It is never sent to the browser and
 * must never live in a NEXT_PUBLIC_* variable.
 */

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "") ?? "";
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN?.trim() ?? "";

/**
 * Shopify supports each quarterly version for about a year, so a hard-coded
 * version silently rots: every call fails once it drops out of support. Keep
 * this current, or override it with SHOPIFY_API_VERSION.
 */
const API_VERSION = process.env.SHOPIFY_API_VERSION?.trim() || "2026-01";

/** Which product to feature. A handle is exact; otherwise the first match wins. */
const HANDLE = process.env.SHOPIFY_PRODUCT_HANDLE?.trim() ?? "";
const SEARCH = process.env.SHOPIFY_PRODUCT_QUERY?.trim() || "status:active";

export const adminConfigured = Boolean(DOMAIN && TOKEN);
export const apiVersion = API_VERSION;
export const storeDomain = DOMAIN;
export const productQuery = HANDLE ? `handle:${HANDLE}` : SEARCH;

export type AdminResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number | null; error: string };

/**
 * One Admin GraphQL call. Surfaces the actual failure — HTTP status plus
 * Shopify's own message — rather than collapsing everything to null, because
 * "no product" and "your token lacks read_products" need different fixes.
 */
export async function adminGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 600,
): Promise<AdminResult<T>> {
  if (!adminConfigured) {
    return { ok: false, status: null, error: "SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN is not set." };
  }

  let res: Response;
  try {
    res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, status: null, error: `Could not reach ${DOMAIN}: ${message}` };
  }

  const body = await res.text();

  if (!res.ok) {
    // 401 -> bad token. 403 -> missing scope. 404 -> API version gone.
    return {
      ok: false,
      status: res.status,
      error: `HTTP ${res.status} from ${DOMAIN} (API ${API_VERSION}): ${body.slice(0, 300)}`,
    };
  }

  let json: { data?: T; errors?: { message: string }[] };
  try {
    json = JSON.parse(body) as typeof json;
  } catch {
    return { ok: false, status: res.status, error: `Non-JSON response: ${body.slice(0, 300)}` };
  }

  if (json.errors?.length) {
    return {
      ok: false,
      status: res.status,
      error: `GraphQL: ${json.errors.map((e) => e.message).join("; ").slice(0, 300)}`,
    };
  }

  if (!json.data) {
    return { ok: false, status: res.status, error: "Response contained no data." };
  }

  return { ok: true, data: json.data };
}

const PRODUCT_QUERY = /* GraphQL */ `
  query LumeraProduct($query: String!) {
    products(first: 1, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          media(first: 10) {
            edges {
              node {
                ... on MediaImage {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

type AdminImage = { url: string; altText: string | null; width: number | null; height: number | null };

type ProductsData = {
  products?: {
    edges: {
      node: {
        id: string;
        title: string;
        handle: string;
        description: string | null;
        media: { edges: { node: { image?: AdminImage | null } }[] };
        variants: {
          edges: {
            node: {
              id: string;
              title: string;
              price: string;
              compareAtPrice: string | null;
              availableForSale: boolean;
            };
          }[];
        };
      };
    }[];
  };
};

export type LiveProduct = {
  /** The store's own title. Kept for reference; the page uses brand copy. */
  title: string;
  handle: string;
  description: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
};

/**
 * Shopify auto-fills altText with a content hash for imported/dropshipped
 * media. A hash is worse than nothing as an accessible label, so it is
 * discarded in favour of a real description.
 */
function usableAltText(altText: string | null | undefined): string | null {
  const value = altText?.trim();
  if (!value) return null;
  if (/^[0-9a-f]{16,}$/i.test(value)) return null;
  return value;
}

/** "gid://shopify/ProductVariant/123" -> "123" */
function numericId(gid: string): string {
  const parts = gid.split("/");
  return parts[parts.length - 1] ?? "";
}

/** Shopify Money strings are major units ("39.00"); the UI works in cents. */
function toCents(money: string | null | undefined): number | undefined {
  if (!money) return undefined;
  const value = Number.parseFloat(money);
  return Number.isFinite(value) ? Math.round(value * 100) : undefined;
}

/** The reason the live product could not be used, for the diagnostic route. */
export type ProductFailure = { reason: string; detail: string };

let lastFailure: ProductFailure | null = null;
export function lastProductFailure(): ProductFailure | null {
  return lastFailure;
}

/**
 * Fetches the featured product. Returns null when Shopify isn't configured or
 * the call fails — the caller then uses the local defaults, so a store outage
 * degrades to a working page rather than a broken one.
 */
export const fetchLiveProduct = cache(async (
  /** Brand-facing name, used for image alt text and variant labels. */
  brandTitle = "Lumera Bio-Collagen Gel Face Mask",
): Promise<LiveProduct | null> => {
  const altBase = brandTitle;
  if (!adminConfigured) {
    lastFailure = { reason: "not_configured", detail: "Store domain or admin token is missing." };
    return null;
  }

  const result = await adminGraphQL<ProductsData>(PRODUCT_QUERY, { query: productQuery });

  if (!result.ok) {
    console.error(`[shopify] ${result.error}`);
    lastFailure = { reason: "request_failed", detail: result.error };
    return null;
  }

  const node = result.data.products?.edges?.[0]?.node;
  if (!node) {
    const detail = `No product matched "${productQuery}". A draft product will not match status:active.`;
    console.warn(`[shopify] ${detail}`);
    lastFailure = { reason: "no_match", detail };
    return null;
  }

  const usable = node.media.edges
    .map((edge) => edge.node.image)
    .filter((image): image is AdminImage => Boolean(image?.url));

  // Shopify's featured image is often a low-res thumbnail while the rest of the
  // set is full size. The hero slot needs the sharp ones, so anything at least
  // 1000px wide leads, with the original order preserved inside each group.
  const large = usable.filter((i) => (i.width ?? 0) >= 1000);
  const small = usable.filter((i) => (i.width ?? 0) < 1000);
  const ordered = large.length > 0 ? [...large, ...small] : usable;

  const images: ProductImage[] = ordered.map((image, index) => ({
    src: image.url,
    alt:
      usableAltText(image.altText) ??
      (index === 0 ? altBase : `${altBase} — view ${index + 1}`),
    width: image.width ?? undefined,
    height: image.height ?? undefined,
  }));

  const sellable = node.variants.edges.filter((edge) => edge.node.availableForSale);
  const singleVariant = sellable.length === 1;

  const variants: ProductVariant[] = sellable
    .map((edge, index) => {
      const v = edge.node;
      const price = toCents(v.price) ?? 0;
      const compareAt = toCents(v.compareAtPrice);
      return {
        id: numericId(v.id),
        // With one option there is nothing to choose between, and a supplier's
        // packing spec ("1pc / 33.7g / 4.72*7.09*0.39inch") is not a label a
        // shopper should see in their cart.
        title: singleVariant || v.title === "Default Title" ? brandTitle : v.title,
        price,
        compareAtPrice: compareAt && compareAt > price ? compareAt : undefined,
        shopifyVariantId: numericId(v.id),
        shopifyVariantGid: v.id,
        default: index === 0,
      };
    })
    .filter((v) => v.price > 0);

  if (variants.length === 0) {
    const detail = `"${node.title}" has no variant that is both available for sale and priced above zero.`;
    console.warn(`[shopify] ${detail}`);
    lastFailure = { reason: "no_variants", detail };
    return null;
  }

  lastFailure = null;
  return {
    title: node.title,
    handle: node.handle,
    description: node.description,
    images,
    variants,
  };
});
