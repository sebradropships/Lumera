/**
 * ── CUSTOMER REVIEWS ─────────────────────────────────────────────────────────
 *
 * `reviews` is EMPTY on purpose. No customer testimonials have been collected
 * for Lumera yet, and inventing them would be fabricated social proof.
 *
 * TO GO LIVE WITH REAL REVIEWS:
 *   1. Add each genuine review to the `reviews` array below.
 *   2. Set NEXT_PUBLIC_SHOW_PLACEHOLDER_REVIEWS=false (or remove it) in your env.
 *
 * Until then, section 3 renders the sample cards ONLY when
 * NEXT_PUBLIC_SHOW_PLACEHOLDER_REVIEWS=true, and every sample card carries a
 * visible "SAMPLE" chip so it can never be mistaken for a real customer.
 */

export type Review = {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  /** Attribution as the customer gave it, e.g. "Sarah M." or "Verified Customer". */
  author: string;
  /** true only if the order behind the review was verified. */
  verified?: boolean;
};

/** Real, collected reviews. Add them here. */
export const reviews: Review[] = [];

/**
 * Layout placeholders. NOT real customers — never remove the `SAMPLE` chip that
 * the UI renders over these, and never present them as genuine reviews.
 */
export const placeholderReviews: Review[] = [
  {
    id: "placeholder-1",
    rating: 5,
    quote: "[Placeholder — replace with a real customer review before launch.]",
    author: "Customer name",
  },
  {
    id: "placeholder-2",
    rating: 5,
    quote: "[Placeholder — replace with a real customer review before launch.]",
    author: "Customer name",
  },
  {
    id: "placeholder-3",
    rating: 5,
    quote: "[Placeholder — replace with a real customer review before launch.]",
    author: "Customer name",
  },
];

export const showPlaceholderReviews =
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_REVIEWS === "true";

/** What section 3 should actually render. */
export function displayedReviews(): { items: Review[]; isPlaceholder: boolean } {
  if (reviews.length > 0) return { items: reviews.slice(0, 3), isPlaceholder: false };
  if (showPlaceholderReviews) return { items: placeholderReviews, isPlaceholder: true };
  return { items: [], isPlaceholder: false };
}
