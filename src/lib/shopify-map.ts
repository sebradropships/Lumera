import type { ProductImage, ProductVideo } from "@/data/media";
import type { ProductVariant } from "@/data/product";

/**
 * Pure mapping from an Admin API product node to what the page renders.
 *
 * Kept free of I/O and of "server-only" so it can be exercised directly against
 * a captured API response — the transformation is where the store's quirks get
 * normalised, so it is the part worth testing.
 */

export type AdminImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type AdminVideoSource = {
  url: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
};

export type AdminVideo = {
  alt?: string | null;
  sources?: AdminVideoSource[] | null;
  preview?: { image?: { url: string; width: number | null; height: number | null } | null } | null;
};

export type AdminProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  media: { edges: { node: ({ image?: AdminImage | null } & AdminVideo) }[] };
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

export type LiveProduct = {
  /** The store's own title. Kept for reference; the page uses brand copy. */
  title: string;
  handle: string;
  description: string | null;
  images: ProductImage[];
  /** First video in the product's media, if the store has one. */
  video: ProductVideo | null;
  variants: ProductVariant[];
};

/**
 * Shopify auto-fills altText with a content hash for imported/dropshipped
 * media. A hash is worse than nothing as an accessible label, so it is
 * discarded in favour of a real description.
 */
export function usableAltText(altText: string | null | undefined): string | null {
  const value = altText?.trim();
  if (!value) return null;
  if (/^[0-9a-f]{16,}$/i.test(value)) return null;
  return value;
}

/** "gid://shopify/ProductVariant/123" -> "123" */
export function numericId(gid: string): string {
  const parts = gid.split("/");
  return parts[parts.length - 1] ?? "";
}

/** Shopify Money strings are major units ("39.00"); the UI works in cents. */
export function toCents(money: string | null | undefined): number | undefined {
  if (!money) return undefined;
  const value = Number.parseFloat(money);
  return Number.isFinite(value) ? Math.round(value * 100) : undefined;
}

export type MapFailure = { reason: string; detail: string };

export function mapProduct(
  node: AdminProductNode,
  brandTitle: string,
): { product: LiveProduct } | { failure: MapFailure } {
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
      (index === 0 ? brandTitle : `${brandTitle} — view ${index + 1}`),
    width: image.width ?? undefined,
    height: image.height ?? undefined,
  }));

  // Prefer an explicit mp4: Shopify also returns HLS (.m3u8) manifests, which a
  // bare <video> cannot play without a JS player.
  const videoNode = node.media.edges.map((e) => e.node).find((n) => (n.sources?.length ?? 0) > 0);
  const sources = videoNode?.sources ?? [];
  const best =
    sources.filter((v) => v.mimeType === "video/mp4").sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0] ??
    sources[0];
  const video: ProductVideo | null = best
    ? {
        src: best.url,
        poster: videoNode?.preview?.image?.url,
        alt: usableAltText(videoNode?.alt) ?? `${brandTitle} in use`,
        width: best.width ?? undefined,
        height: best.height ?? undefined,
      }
    : null;

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
    return {
      failure: {
        reason: "no_variants",
        detail: `"${node.title}" has no variant that is both available for sale and priced above zero.`,
      },
    };
  }

  return {
    product: {
      title: node.title,
      handle: node.handle,
      description: node.description,
      images,
      video,
      variants,
    },
  };
}
