import "server-only";
import { cache } from "react";
import {
  mapProduct,
  type AdminProductNode,
  type LiveProduct,
} from "@/lib/shopify-map";

export type { LiveProduct } from "@/lib/shopify-map";

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
  query HoygiProduct($query: String!) {
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

type ProductsData = { products?: { edges: { node: AdminProductNode }[] } };

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
  brandTitle = "Hoygi Bio-Collagen Gel Face Mask",
): Promise<LiveProduct | null> => {
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

  const mapped = mapProduct(node, brandTitle);

  if ("failure" in mapped) {
    console.warn(`[shopify] ${mapped.failure.detail}`);
    lastFailure = mapped.failure;
    return null;
  }

  lastFailure = null;
  return mapped.product;
});
