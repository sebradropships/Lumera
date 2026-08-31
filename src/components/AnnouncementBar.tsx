"use client";

import { useEffect, useState } from "react";
import { DiamondIcon } from "@/components/Icons";
import { msRemaining, offer } from "@/data/offer";

/**
 * Sale strip above the header. When the offer is a hard deadline rather than a
 * repeating window, the strip hides itself once that deadline passes so it
 * never advertises a price that is no longer available.
 */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState(true);

  const messages = offer.strip.messages;

  useEffect(() => {
    // A repeating window never closes for good; a hard deadline does, and once
    // it passes the strip must stop advertising the price.
    if (offer.recurringWindowHours) return;
    const remaining = msRemaining();
    if (remaining !== null && remaining <= 0) setLive(false);
  }, []);

  useEffect(() => {
    if (!live || messages.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      offer.strip.rotateSeconds * 1000,
    );
    return () => window.clearInterval(id);
  }, [live, messages.length]);

  if (!offer.strip.enabled || !live || messages.length === 0) return null;

  return (
    <div className="relative z-50 bg-pink text-white">
      <div className="shell flex h-9 items-center justify-center gap-2 overflow-hidden sm:h-10">
        <DiamondIcon className="h-2 w-2 shrink-0 text-white/70" />

        <p
          key={index}
          className="animate-fade-in truncate text-center text-[10.5px] font-medium uppercase tracking-wide2 text-white sm:text-[11px]"
        >
          {messages[index]}
        </p>

        <DiamondIcon className="h-2 w-2 shrink-0 text-white/70" />
      </div>
    </div>
  );
}
