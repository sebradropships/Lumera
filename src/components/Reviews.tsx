import Reveal from "@/components/Reveal";
import ReviewList from "@/components/ReviewList";
import { displayedReviews, reviewSummary } from "@/data/reviews";

/**
 * Customer reviews, as their own section between the ritual and the final offer.
 *
 * Renders only what src/data/reviews.ts actually holds. With no collected
 * reviews it says so plainly rather than filling the space — a fabricated
 * testimonial is the one thing this section must never produce. The sample
 * cards appear only behind NEXT_PUBLIC_SHOW_PLACEHOLDER_REVIEWS and each keeps
 * a visible SAMPLE chip.
 */
export default function Reviews() {
  const { items, isPlaceholder } = displayedReviews();
  const summary = reviewSummary();

  return (
    <section aria-labelledby="reviews-heading" className="pb-0 pt-16 sm:pt-20 lg:pt-28">
      <div className="shell">
        <Reveal className="mx-auto max-w-[34rem] text-center">
          <p className="eyebrow">LOVED BY SKINCARE LOVERS</p>
          <h2
            id="reviews-heading"
            className="display mt-3 text-[32px] sm:text-[42px] lg:text-[50px]"
          >
            The Glow Everyone Wants.
          </h2>

          {/* Figures only — a five-star graphic beside a 4.6 average would
              overstate it, and rounding the glyphs hides the very difference
              the number exists to show. */}
          {summary && (
            <div className="mt-5 flex flex-col items-center gap-2">
              <p className="text-[13px] text-plum">
                <span className="font-semibold text-ink">{summary.average.toFixed(1)}</span> out of
                5{" · "}
                {summary.count} {summary.count === 1 ? "review" : "reviews"}
              </p>
            </div>
          )}
        </Reveal>

        {items.length > 0 ? (
          <>
            {isPlaceholder && (
              <Reveal className="mx-auto mt-6 max-w-[34rem]">
                <p className="rounded-full border border-dashed border-pinksoft bg-white/60 px-4 py-2 text-center text-[11px] leading-snug text-muted">
                  Sample layout — no customer reviews have been collected yet. Replace these in{" "}
                  <code className="font-mono text-[10.5px] text-plum">src/data/reviews.ts</code>.
                </p>
              </Reveal>
            )}

            <ReviewList items={items} isPlaceholder={isPlaceholder} />
          </>
        ) : (
          <Reveal className="mx-auto mt-8 max-w-[34rem] text-center">
            <p className="text-[15px] leading-[1.65] text-plum">
              Hoygi is newly launched, so we haven&apos;t collected customer reviews yet. Every
              review published here will come from a real, verified order.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
