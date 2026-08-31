"use client";

import { useEffect, useState } from "react";
import { breakdown, countdownEnabled, msRemaining, offer, type Remaining } from "@/data/offer";

const pad = (n: number) => n.toString().padStart(2, "0");

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[2.2rem] rounded-lg border border-white/70 bg-white/80 px-2 py-1 lining-nums text-center font-serif text-[17px] leading-none text-ink shadow-soft sm:min-w-[2.5rem] sm:text-[20px] sm:py-1.5">
        {value}
      </span>
      <span className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.18em] text-muted sm:text-[9px]">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span aria-hidden="true" className="pb-3.5 font-serif text-[15px] leading-none text-rosedust">
      :
    </span>
  );
}

/**
 * "Offer ends in" countdown to the single real deadline in `src/data/offer.ts`.
 * It does not reset per visitor. Once the deadline passes it says so instead of
 * restarting.
 *
 * Renders nothing on the server pass so the first paint can't show a stale
 * number; it appears on mount.
 */
export default function Countdown({ className = "" }: { className?: string }) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [expired, setExpired] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const tick = () => {
      const ms = msRemaining();
      if (ms === null) return;
      if (ms <= 0) {
        setExpired(true);
        setRemaining(null);
        return;
      }
      setRemaining(breakdown(ms));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!countdownEnabled || !mounted) return null;

  if (expired) {
    return (
      <p className={`text-[11px] uppercase tracking-eyebrow text-muted ${className}`}>
        {offer.expiredLabel}
      </p>
    );
  }

  if (!remaining) return null;

  // An 8-hour window never shows a day, so the cell would just read "00".
  const showDays = remaining.days > 0;
  const spoken = [
    showDays ? `${remaining.days} days` : null,
    `${remaining.hours} hours`,
    `${remaining.minutes} minutes`,
    `${remaining.seconds} seconds`,
  ]
    .filter(Boolean)
    .join(", ") + " remaining";

  return (
    <div className={className}>
      <p className="text-center text-[9.5px] font-medium uppercase tracking-eyebrow text-pink sm:text-[10px]">
        {offer.countdownLabel}
      </p>

      <div
        className="mt-1.5 flex items-start justify-center gap-1.5"
        role="timer"
        aria-live="off"
        aria-label={spoken}
      >
        {showDays && (
          <>
            <Cell value={pad(remaining.days)} label="Days" />
            <Colon />
          </>
        )}
        <Cell value={pad(remaining.hours)} label="Hrs" />
        <Colon />
        <Cell value={pad(remaining.minutes)} label="Min" />
        <Colon />
        <Cell value={pad(remaining.seconds)} label="Sec" />
      </div>
    </div>
  );
}
