"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { ShieldIcon, Stars } from "@/components/Icons";
import type { Review } from "@/data/reviews";

const INITIAL = 6;

/**
 * The review cards, with the rest behind a disclosure.
 *
 * Showing a subset is a layout decision, not an editorial one: the cards keep
 * the order they were collected in rather than being sorted by rating, so the
 * opening six are not a filtered best-of and the critical reviews sit in the
 * same list as the rest.
 */
export default function ReviewList({
  items,
  isPlaceholder,
}: {
  items: Review[];
  isPlaceholder: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? items : items.slice(0, INITIAL);
  const remaining = items.length - INITIAL;

  return (
    <>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-7">
        {shown.map((review, i) => (
          <Reveal as="li" key={review.id} delay={Math.min(i, 5) * 80} className="h-full">
            <figure className="relative flex h-full flex-col rounded-xl2 border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-[2px] sm:p-7">
              {isPlaceholder && (
                <span className="absolute right-4 top-4 rounded-full border border-pinksoft px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wide2 text-pink">
                  Sample
                </span>
              )}
              <Stars count={review.rating} />
              <blockquote className="mt-4 flex-1 font-serif text-[17px] leading-[1.5] text-ink sm:text-[18px]">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-[11px] uppercase tracking-eyebrow text-muted">
                — {review.author}
                {review.verified && !isPlaceholder && (
                  <span className="ml-2 inline-flex items-center gap-1 text-pink">
                    <ShieldIcon className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="rounded-full border border-rosedust bg-white/70 px-6 py-3 text-[12px] font-semibold uppercase tracking-wide2 text-plum transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
          >
            {expanded ? "Show fewer reviews" : `Read all ${items.length} reviews`}
          </button>
        </div>
      )}
    </>
  );
}
