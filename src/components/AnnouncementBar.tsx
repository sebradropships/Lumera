"use client";

import { useEffect, useState } from "react";
import { DiamondIcon } from "@/components/Icons";
import { msRemaining, offer } from "@/data/offer";

/**
 * Sale strip above the header: a marquee that loops forever.
 *
 * The track holds two identical copies of the sequence and travels exactly half
 * its own width, so it arrives back at a matching frame and the seam never
 * shows. Only the first copy is read by assistive tech; the second is decorative
 * duplication.
 *
 * Motion that runs indefinitely has to be escapable (WCAG 2.2.2), so it pauses
 * on hover and on keyboard focus, and does not animate at all under
 * prefers-reduced-motion.
 *
 * When the offer is a hard deadline rather than a repeating window, the strip
 * hides itself once that deadline passes so it never advertises a price that is
 * no longer available.
 */
export default function AnnouncementBar({
  savingsPercent,
}: {
  /** Real saving on the featured product, or null when there is no discount. */
  savingsPercent: number | null;
}) {
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (offer.recurringWindowHours) return;
    const remaining = msRemaining();
    if (remaining !== null && remaining <= 0) setLive(false);
  }, []);

  // The discount line only appears when there is a discount to name.
  const items =
    savingsPercent && savingsPercent > 0
      ? [...offer.strip.items, offer.strip.discountMessage.replace("{n}", String(savingsPercent))]
      : offer.strip.items;

  if (!offer.strip.enabled || !live || items.length === 0) return null;

  const sequence = (
    <ul className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-4 text-[11px] font-semibold uppercase tracking-wide2 sm:px-5 sm:text-[12px]">
            {item}
          </span>
          <DiamondIcon className="h-2 w-2 shrink-0 text-white/60" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="group relative z-50 overflow-hidden bg-gradient-to-r from-salered via-[#D42A5E] to-pink text-white"
      // Focus-within pauses it too, so a keyboard user reading the strip isn't
      // chasing moving text.
      tabIndex={0}
      role="region"
      aria-label={`Sale: ${items.join(", ")}`}
    >
      <div
        className="flex h-9 w-max animate-marquee items-center group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:h-10"
        style={{ ["--marquee-duration" as string]: `${offer.strip.loopSeconds}s` }}
      >
        {sequence}
        {/* Second copy is the seam filler, not content. */}
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {sequence}
        </div>
      </div>
    </div>
  );
}
