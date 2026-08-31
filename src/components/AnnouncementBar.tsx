"use client";

import { useEffect, useState } from "react";
import { DiamondIcon } from "@/components/Icons";
import { msRemaining, offer } from "@/data/offer";

/**
 * Sale strip above the header. Hides itself once the launch offer has actually
 * ended, so it never advertises an expired price.
 */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState(true);

  const messages = offer.strip.messages;

  useEffect(() => {
    // Respect the real deadline.
    const remaining = msRemaining();
    if (remaining !== null && remaining <= 0) {
      setLive(false);
      return;
    }
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
    <div className="relative z-50 bg-charcoal text-ivory">
      <div className="shell flex h-9 items-center justify-center gap-2 overflow-hidden sm:h-10">
        <DiamondIcon className="h-2 w-2 shrink-0 text-goldsoft" />

        <p
          key={index}
          className="animate-fade-in truncate text-center text-[10.5px] font-medium uppercase tracking-wide2 text-ivory/90 sm:text-[11px]"
        >
          {messages[index]}
        </p>

        <DiamondIcon className="h-2 w-2 shrink-0 text-goldsoft" />
      </div>
    </div>
  );
}
