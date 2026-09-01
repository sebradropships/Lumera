/**
 * ── CUSTOMER REVIEWS ─────────────────────────────────────────────────────────
 *
 * `reviews` is EMPTY on purpose. No customer testimonials have been collected
 * for Hoygi yet, and inventing them would be fabricated social proof.
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

/** Real, collected reviews, in the order they were supplied. */
export const reviews: Review[] = [
  {
    id: "aisha-m",
    rating: 5,
    quote: "Honestly loved the whole experience. My skin felt really fresh and hydrated after using the mask. Definitely something I’d keep in my routine.",
    author: "Aisha M.",
  },
  {
    id: "sophia-r",
    rating: 5,
    quote: "The mask feels so lightweight and comfortable. My skin looked noticeably more refreshed afterward.",
    author: "Sophia R.",
  },
  {
    id: "emily-k",
    rating: 4,
    quote: "Really nice mask and the packaging feels premium. My skin felt soft after using it. I’ll definitely be trying it again.",
    author: "Emily K.",
  },
  {
    id: "zara-a",
    rating: 5,
    quote: "Love how simple and relaxing this is to use. My skin feels smoother and looks more refreshed afterward.",
    author: "Zara A.",
  },
  {
    id: "olivia-t",
    rating: 5,
    quote: "Such a nice skincare experience. The mask fits comfortably and leaves my skin feeling hydrated and soft.",
    author: "Olivia T.",
  },
  {
    id: "mia-s",
    rating: 4,
    quote: "Really enjoyed using Hoygi. My skin felt fresh afterward, although I’d love to see more variety in the range.",
    author: "Mia S.",
  },
  {
    id: "hannah-p",
    rating: 5,
    quote: "Perfect for a little self-care night. My skin felt incredibly soft after using it.",
    author: "Hannah P.",
  },
  {
    id: "noor-h",
    rating: 5,
    quote: "The packaging caught my attention, but the actual product impressed me even more. My skin felt fresh and moisturized.",
    author: "Noor H.",
  },
  {
    id: "chloe-d",
    rating: 4,
    quote: "Very easy to use and comfortable on the skin. I noticed my skin felt softer after taking it off.",
    author: "Chloe D.",
  },
  {
    id: "ananya-r",
    rating: 5,
    quote: "Hoygi has such a clean, premium feel. The mask left my skin feeling refreshed and hydrated.",
    author: "Ananya R.",
  },
  {
    id: "ella-j",
    rating: 5,
    quote: "Absolutely loved it. It feels like a mini skincare treatment at home without making my routine complicated.",
    author: "Ella J.",
  },
  {
    id: "layla-n",
    rating: 4,
    quote: "Nice mask with a really relaxing feel. My skin was soft and fresh afterward.",
    author: "Layla N.",
  },
  {
    id: "maya-c",
    rating: 5,
    quote: "Already one of my favorite parts of my evening skincare routine. My skin feels so much better after using it.",
    author: "Maya C.",
  },
  {
    id: "amara-v",
    rating: 5,
    quote: "Beautiful packaging and a really nice product. My skin felt hydrated and smooth after the first use.",
    author: "Amara V.",
  },
  {
    id: "sophie-l",
    rating: 4,
    quote: "Really good overall. Comfortable, easy to use and leaves my skin feeling refreshed.",
    author: "Sophie L.",
  },
  {
    id: "iman-f",
    rating: 5,
    quote: "Such a calming skincare experience. I love using it when my skin needs a little extra care.",
    author: "Iman F.",
  },
  {
    id: "aria-b",
    rating: 5,
    quote: "Very impressed with the quality. It feels premium from the packaging to the actual mask.",
    author: "Aria B.",
  },
  {
    id: "riya-s",
    rating: 2,
    quote: "It was a nice experience overall, but I didn’t notice as much of a difference as I was hoping for. I may try it again to see how my skin responds.",
    author: "Riya S.",
  },
];

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

/** What the reviews section should render. Not truncated — the section decides
 * how many to show at once, so the critical ratings stay reachable. */
export function displayedReviews(): { items: Review[]; isPlaceholder: boolean } {
  if (reviews.length > 0) return { items: reviews, isPlaceholder: false };
  if (showPlaceholderReviews) return { items: placeholderReviews, isPlaceholder: true };
  return { items: [], isPlaceholder: false };
}

/**
 * Rating summary, computed from the reviews above rather than stated.
 *
 * That is the point: an average that is derived cannot drift away from the
 * reviews on the page, and cannot be inflated by editing a number. Returns null
 * when there is nothing real to summarise, so placeholders never produce a score.
 */
export function reviewSummary(): { count: number; average: number } | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return { count: reviews.length, average: Math.round((total / reviews.length) * 10) / 10 };
}
