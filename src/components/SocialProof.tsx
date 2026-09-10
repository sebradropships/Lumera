import Countdown from "@/components/Countdown";
import FinalCta from "@/components/FinalCta";
import Reveal from "@/components/Reveal";
import { DiamondIcon } from "@/components/Icons";
import { formatPrice, savingsPercent } from "@/data/product";
import { defaultVariantOf, type ResolvedProduct } from "@/lib/product-source";

export default function SocialProof({ product }: { product: ResolvedProduct }) {
  const defaultVariant = defaultVariantOf(product);
  const savings = savingsPercent(defaultVariant);

  return (
    <section
      aria-labelledby="final-offer-heading"
      className="pb-16 pt-14 sm:pb-20 lg:pb-28 lg:pt-20"
    >
      <div className="shell">
        {/* Final offer */}
        <Reveal>
          <div className="overflow-hidden rounded-xl3 border border-white/70 bg-[radial-gradient(120%_120%_at_50%_0%,#FFFAFC_0%,#FDE7EE_60%,#F9D6E1_100%)] px-6 py-12 text-center shadow-soft sm:px-10 sm:py-16 lg:py-20">
            <p className="eyebrow">{product.offer.label}</p>

            <h2
              id="final-offer-heading"
              className="display mx-auto mt-4 max-w-[16ch] text-[34px] sm:text-[46px] lg:text-[54px]"
            >
              Ready for Your Glow Ritual?
            </h2>

            <p className="mx-auto mt-4 max-w-[38ch] text-[15px] leading-[1.65] text-plum sm:text-[16px]">
              Give your skin 40 minutes of hydration, softness and radiance.
            </p>

            {savings && (
              <p className="mt-8 inline-flex items-center rounded-full bg-pink px-4 py-2 text-[10.5px] font-semibold uppercase tracking-wide2 text-white">
                Save {savings}% today
              </p>
            )}

            <div className="mt-5 flex items-baseline justify-center gap-3">
              <span className="price-now">{formatPrice(defaultVariant.price)}</span>
              {defaultVariant.compareAtPrice && (
                <span className="price-was">{formatPrice(defaultVariant.compareAtPrice)}</span>
              )}
            </div>

            <Countdown className="mt-7" />

            <div className="mt-7 flex justify-center">
              <FinalCta />
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted">
              <DiamondIcon className="h-2 w-2 text-pink" />
              Free shipping · Limited offer · Secure checkout
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
