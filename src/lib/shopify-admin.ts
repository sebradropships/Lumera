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
const API_VERSION = process.env.SHOPIFY_API_VERSION?.trim() || "2025-01";

/** Which product to feature. A handle is exact; otherwise the first match wins. */
const HANDLE = process.env.SHOPIFY_PRODUCT_HANDLE?.trim() ?? "";
const SEARCH = process.env.SHOPIFY_PRODUCT_QUERY?.trim() || "status:active";

export const adminConfigured = Boolean(DOMAIN && TOKEN);

const PRODUCT_QUERY = /* GraphQL */ `
  query LumeraProduct($query: String!) {
    products(first: 1, query: $query, sortKey: RELEVANCE) {
      edges {
        node {
          id
          title
          handle
          description
          onlineStoreUrl
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

type AdminResponse = {
  data?: {
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
  errors?: { message: string }[];
};

export type LiveProduct = {
  title: string;
  handle: string;
  description: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
};

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

/**
 * Fetches the featured product. Returns null when Shopify isn't configured or
 * the call fails — the caller then uses the local defaults, so a store outage
 * degrades to a working page rather than a broken one.
 *
 * `cache` dedupes this across a single render; `revalidate` keeps it off the
 * critical path for repeat visitors.
 */
export const fetchLiveProduct = cache(async (): Promise<LiveProduct | null> => {
  if (!adminConfigured) return null;

  const query = HANDLE ? `handle:${HANDLE}` : SEARCH;

  let json: AdminResponse;
  try {
    const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query: PRODUCT_QUERY, variables: { query } }),
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      console.error(`[shopify] Admin API responded ${res.status}`);
      return null;
    }
    json = (await res.json()) as AdminResponse;
  } catch (error) {
    console.error("[shopify] Admin API request failed:", error);
    return null;
  }

  if (json.errors?.length) {
    console.error("[shopify] Admin API errors:", json.errors.map((e) => e.message).join("; "));
    return null;
  }

  const node = json.data?.products?.edges?.[0]?.node;
  if (!node) {
    console.warn(`[shopify] No product matched query: ${query}`);
    return null;
  }

  const images: ProductImage[] = node.media.edges
    .map((edge) => edge.node.image)
    .filter((image): image is AdminImage => Boolean(image?.url))
    .map((image) => ({
      src: image.url,
      alt: image.altText?.trim() || node.title,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
    }));

  const variants: ProductVariant[] = node.variants.edges
    .filter((edge) => edge.node.availableForSale)
    .map((edge, index) => {
      const v = edge.node;
      const price = toCents(v.price) ?? 0;
      const compareAt = toCents(v.compareAtPrice);
      return {
        id: numericId(v.id),
        // Shopify names a single-option product's variant "Default Title".
        title: v.title === "Default Title" ? node.title : v.title,
        price,
        compareAtPrice: compareAt && compareAt > price ? compareAt : undefined,
        shopifyVariantId: numericId(v.id),
        shopifyVariantGid: v.id,
        default: index === 0,
      };
    })
    .filter((v) => v.price > 0);

  if (variants.length === 0) {
    console.warn("[shopify] Product has no purchasable variants; using local defaults.");
    return null;
  }

  return {
    title: node.title,
    handle: node.handle,
    description: node.description,
    images,
    variants,
  };
});
