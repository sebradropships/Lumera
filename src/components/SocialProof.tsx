import FinalCta from "@/components/FinalCta";
import Reveal from "@/components/Reveal";
import { DiamondIcon, ShieldIcon, Stars } from "@/components/Icons";
import { displayedReviews } from "@/data/reviews";
import { defaultVariant, formatPrice, product, savingsPercent } from "@/data/product";

export default function SocialProof() {
  const { items, isPlaceholder } = displayedReviews();
  const savings = savingsPercent(defaultVariant);

  return (
    <section aria-labelledby="proof-heading" className="py-16 sm:py-20 lg:py-28">
      <div className="shell">
        <Reveal className="mx-auto max-w-[34rem] text-center">
          <p className="eyebrow">LOVED BY SKINCARE LOVERS</p>
          <h2 id="proof-heading" className="display mt-3 text-[32px] sm:text-[42px] lg:text-[50px]">
            The Glow Everyone Wants.
          </h2>
        </Reveal>

        {items.length > 0 ? (
          <>
            {isPlaceholder && (
              <Reveal className="mx-auto mt-6 max-w-[34rem]">
                <p className="rounded-full border border-dashed border-goldsoft bg-white/60 px-4 py-2 text-center text-[11px] leading-snug text-muted">
                  Sample layout — no customer reviews have been collected yet. Replace these in{" "}
                  <code className="font-mono text-[10.5px] text-graphite">src/data/reviews.ts</code>.
                </p>
              </Reveal>
            )}

            <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-12">
              {items.map((review, i) => (
                <Reveal as="li" key={review.id} delay={i * 90} className="h-full">
                  <figure className="relative flex h-full flex-col rounded-xl2 border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-[2px] sm:p-7">
                    {isPlaceholder && (
                      <span className="absolute right-4 top-4 rounded-full border border-goldsoft px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wide2 text-gold">
                        Sample
                      </span>
                    )}
                    <Stars count={review.rating} />
                    <blockquote className="mt-4 flex-1 font-serif text-[19px] leading-[1.45] text-charcoal sm:text-[20px]">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 text-[11px] uppercase tracking-eyebrow text-muted">
                      — {review.author}
                      {review.verified && !isPlaceholder && (
                        <span className="ml-2 inline-flex items-center gap-1 text-gold">
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
            <p className="text-[15px] leading-[1.65] text-graphite">
              Lumera is newly launched, so we haven&apos;t collected customer reviews yet. Every
              review published here will come from a real, verified order.
            </p>
          </Reveal>
        )}

        {/* Final offer */}
        <Reveal delay={120}>
          <div className="mt-14 overflow-hidden rounded-xl3 border border-white/70 bg-[radial-gradient(120%_120%_at_50%_0%,#FFFDFA_0%,#F3E9DC_60%,#EADFD1_100%)] px-6 py-12 text-center shadow-soft sm:px-10 sm:py-16 lg:mt-20 lg:py-20">
            <p className="eyebrow">{product.offer.label}</p>

            <h2 className="display mx-auto mt-4 max-w-[16ch] text-[34px] sm:text-[46px] lg:text-[54px]">
              Ready for Your Glow Ritual?
            </h2>

            <p className="mx-auto mt-4 max-w-[38ch] text-[15px] leading-[1.65] text-graphite sm:text-[16px]">
              Give your skin 20 minutes of hydration, softness and radiance.
            </p>

            {savings && (
              <p className="mt-8 inline-flex items-center rounded-full bg-charcoal px-4 py-2 text-[10.5px] font-semibold uppercase tracking-wide2 text-ivory">
                Save {savings}% today
              </p>
            )}

            <div className="mt-5 flex items-baseline justify-center gap-3">
              <span className="price-now">{formatPrice(defaultVariant.price)}</span>
              {defaultVariant.compareAtPrice && (
                <span className="price-was">{formatPrice(defaultVariant.compareAtPrice)}</span>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <FinalCta />
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted">
              <DiamondIcon className="h-2 w-2 text-gold" />
              Limited launch offer · Secure checkout
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
