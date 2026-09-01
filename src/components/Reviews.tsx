import Reveal from "@/components/Reveal";
import { ShieldIcon, Stars } from "@/components/Icons";
import { displayedReviews } from "@/data/reviews";

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

            <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-12">
              {items.map((review, i) => (
                <Reveal as="li" key={review.id} delay={i * 90} className="h-full">
                  <figure className="relative flex h-full flex-col rounded-xl2 border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-[2px] sm:p-7">
                    {isPlaceholder && (
                      <span className="absolute right-4 top-4 rounded-full border border-pinksoft px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wide2 text-pink">
                        Sample
                      </span>
                    )}
                    <Stars count={review.rating} />
                    <blockquote className="mt-4 flex-1 font-serif text-[19px] leading-[1.45] text-ink sm:text-[20px]">
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
