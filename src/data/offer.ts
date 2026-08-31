/**
 * ── LAUNCH OFFER ─────────────────────────────────────────────────────────────
 *
 * The sale strip and the "offer ends in" countdown both read from here.
 *
 * HONESTY RULE: `endsAt` is a single real deadline shared by every visitor. It
 * does NOT reset per session and it is not restarted on reload. When it passes,
 * the countdown and the strip hide themselves rather than showing a fake timer.
 * If you extend the sale, move this date — don't rig it to always show "2 hours
 * left".
 *
 * Set to `null` to remove the countdown entirely and keep the plain sale strip.
 */

export const offer = {
  /** Top announcement strip. Set `enabled: false` to hide it. */
  strip: {
    enabled: true,
    /**
     * Rotating messages. Keep each under ~32 characters or it truncates on a
     * 390px phone. Only claim shipping, returns or guarantees that your actual
     * store policy backs up.
     */
    messages: [
      "Limited launch offer — 40% off",
      "Fast US delivery",
      "Secure checkout",
    ] as string[],
    /** Seconds each message holds before the next fades in. */
    rotateSeconds: 4.5,
  },

  /**
   * Real end of the launch price, as an ISO 8601 instant (UTC).
   * Update this when the sale genuinely changes.
   */
  endsAt: "2026-09-30T23:59:59Z" as string | null,

  /** Shown above the countdown. */
  countdownLabel: "Offer ends in",

  /** Shown in place of the countdown once `endsAt` has passed. */
  expiredLabel: "Launch pricing has ended",
} as const;

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

/** Milliseconds left until `endsAt`, or null when no deadline is configured. */
export function msRemaining(now: number = Date.now()): number | null {
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
