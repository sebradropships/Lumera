"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DiamondIcon } from "@/components/Icons";
import { msRemaining, offer } from "@/data/offer";

/**
 * Sale strip above the header: a marquee that loops forever.
 *
 * ── Why the copy count is measured rather than fixed ─────────────────────────
 * The track scrolls left by exactly one sequence, then restarts. For the strip
 * never to show a gap, whatever remains after that shift must still be at least
 * as wide as the viewport:
 *
 *     (copies - 1) x sequenceWidth  >=  containerWidth
 *
 * Two copies only satisfies that when a single sequence is already wider than
 * the screen. "SALE ✦ SALE ✦ SALE ✦ 40% OFF TODAY" measures ~368px, so on a
 * 390px phone two copies left a 22px hole at the right edge on every pass.
 *
 * So the sequence is measured after mount and repeated as many times as the
 * width actually requires, re-measured on resize and orientation change.
 *
 * Indefinite motion has to be escapable (WCAG 2.2.2): it pauses on hover and on
 * keyboard focus, and does not animate at all under prefers-reduced-motion.
 */
export default function AnnouncementBar({
  savingsPercent,
}: {
  /** Real saving on the featured product, or null when there is no discount. */
  savingsPercent: number | null;
}) {
  const [live, setLive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);

  /** One sequence's width in px; 0 until measured. */
  const [sequenceWidth, setSequenceWidth] = useState(0);
  /** Enough copies to cover the viewport after a full shift. Starts generous. */
  const [copies, setCopies] = useState(8);

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

  const measure = useCallback(() => {
    const container = containerRef.current;
    const sequence = sequenceRef.current;
    if (!container || !sequence) return;

    const width = sequence.getBoundingClientRect().width;
    if (width <= 0) return;

    setSequenceWidth(width);
    setCopies(Math.max(2, Math.ceil(container.getBoundingClientRect().width / width) + 1));
  }, []);

  useEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    // Catches rotation and font swap, not just window resize.
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure, items.length]);

  if (!offer.strip.enabled || !live || items.length === 0) return null;

  const sequence = (ref?: React.Ref<HTMLUListElement>, hidden = false) => (
    <ul ref={ref} aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
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
      ref={containerRef}
      className="group relative z-50 overflow-hidden bg-gradient-to-r from-salered via-[#D42A5E] to-pink text-white"
      tabIndex={0}
      role="region"
      aria-label={`Sale: ${items.join(", ")}`}
    >
      <div
        className="marquee-track flex h-9 w-max items-center group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:h-10"
        style={
          {
            "--marquee-shift": `${sequenceWidth}px`,
            "--marquee-duration": `${Math.max(4, sequenceWidth / offer.strip.pixelsPerSecond)}s`,
            // Nothing to shift by until measured — holding still beats a jump.
            animationPlayState: sequenceWidth > 0 ? undefined : "paused",
          } as React.CSSProperties
        }
      >
        {/* Only the first copy is content; the rest exist to fill the width. */}
        {sequence(sequenceRef)}
        {Array.from({ length: copies - 1 }, (_, i) => (
          <div key={i} className="flex shrink-0 items-center">
            {sequence(undefined, true)}
          </div>
        ))}
      </div>
    </div>
  );
}
