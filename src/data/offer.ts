/**
 * ── LIMITED OFFER ────────────────────────────────────────────────────────────
 *
 * The sale strip and the "offer ends in" countdown both read from here.
 *
 * Two ways to run the countdown:
 *
 *   1. `recurringWindowHours` — a repeating window. The clock is anchored to a
 *      fixed UTC epoch, so the SAME countdown is shown to every visitor at any
 *      given moment and it rolls over on shared wall-clock boundaries (with an
 *      8-hour window: 00:00, 08:00 and 16:00 UTC). It is NOT restarted per
 *      person, per session, or on page load.
 *
 *   2. `endsAt` — a single hard deadline. Used only when
 *      `recurringWindowHours` is null. Once it passes the countdown says the
 *      offer ended instead of looping.
 *
 * A word of warning on option 1: a countdown implies a deadline. If the price
 * never actually changes when the clock hits zero, the urgency is fictional —
 * the FTC and the EU Omnibus Directive both treat that as a deceptive practice,
 * and it is the single most common thing that makes a store look like a
 * dropshipper. If you run the recurring window, genuinely cycle the offer.
 */

export const offer = {
  /**
   * Top sale strip — a marquee that loops forever above the header.
   * Set `enabled: false` to hide it.
   */
  strip: {
    enabled: true,

    /**
     * The repeating sequence. Rendered twice so the loop has no visible seam,
     * so keep it short; every item is separated by a diamond.
     */
    items: ["SALE", "SALE", "SALE"] as string[],

    /**
     * Appended to the sequence with {n} replaced by the real saving. Dropped
     * entirely when the live product has no compare-at price, so the strip can
     * never advertise a discount that does not exist.
     */
    discountMessage: "{n}% OFF TODAY",

    /**
     * Seconds for one full pass. Higher is slower. Motion this persistent has
     * to be escapable, so it pauses on hover and on keyboard focus, and holds
     * still entirely under prefers-reduced-motion.
     */
    loopSeconds: 22,
  },

  /**
   * Repeating offer window in hours. Set to null to use `endsAt` instead.
   */
  recurringWindowHours: 8 as number | null,

  /**
   * Fixed UTC instant the repeating window is measured from. Every visitor
   * shares this anchor, which is what keeps the countdown identical for all of
   * them. Changing it shifts when the window rolls over.
   */
  windowAnchor: "2026-01-01T00:00:00Z",

  /**
   * Single hard deadline (ISO 8601, UTC). Only used when
   * `recurringWindowHours` is null.
   */
  endsAt: null as string | null,

  /** Shown above the countdown. */
  countdownLabel: "Offer ends in",

  /** Shown in place of the countdown once `endsAt` has passed. */
  expiredLabel: "This offer has ended",
} as const;

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

/** True when a countdown of either kind is configured. */
export const countdownEnabled = Boolean(offer.recurringWindowHours || offer.endsAt);

/**
 * Milliseconds until the offer window closes, or null when no countdown is
 * configured.
 *
 * For the repeating window this is the time to the next shared boundary, so two
 * people loading the page at the same instant see the same number.
 */
export function msRemaining(now: number = Date.now()): number | null {
  const hours = offer.recurringWindowHours;

  if (hours && hours > 0) {
    const windowMs = hours * 3_600_000;
    const anchor = Date.parse(offer.windowAnchor);
    if (Number.isNaN(anchor)) return null;
    // Positive modulo, so dates before the anchor behave too.
    const intoWindow = (((now - anchor) % windowMs) + windowMs) % windowMs;
    return windowMs - intoWindow;
  }

  if (!offer.endsAt) return null;
  const end = Date.parse(offer.endsAt);
  if (Number.isNaN(end)) return null;
  return Math.max(0, end - now);
}

export function breakdown(ms: number): Remaining {
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}
