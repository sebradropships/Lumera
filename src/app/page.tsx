import AnnouncementBar from "@/components/AnnouncementBar";
import BrandHeader from "@/components/BrandHeader";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Reviews from "@/components/Reviews";
import SocialProof from "@/components/SocialProof";
import StickyBar from "@/components/StickyBar";
import Wordmark from "@/components/Wordmark";
import { savingsPercent } from "@/data/product";
import { defaultVariantOf, getProduct } from "@/lib/product-source";

export default async function Page() {
  const product = await getProduct();
  const savings = savingsPercent(defaultVariantOf(product));

  return (
    <div id="top" className="bg-atmosphere min-h-dvh">
      <AnnouncementBar savingsPercent={savings} />
      <BrandHeader />

      <main>
        {/* 1 — Hero / product / purchase */}
        <Hero />

        {/* 2 — Why Hoygi: experience + how it works */}
        <Experience product={product} />

        {/* 3 — Customer reviews */}
        <Reviews />

        {/* 4 — Final CTA */}
        <SocialProof product={product} />
      </main>

      <footer className="border-t border-rosedust/50 px-5 pb-28 pt-8 text-center sm:pb-12 lg:pb-12">
        <p className="font-serif text-[13px] uppercase tracking-brand text-ink">
          <Wordmark id="mark-footer" className="inline-block h-10 w-auto" />
        </p>
        <p className="mx-auto mt-3 max-w-[42ch] text-[11px] leading-relaxed text-muted">
          Hoygi is a cosmetic skincare product, not a medical treatment. Results and appearance vary
          from person to person.
        </p>
        <p className="mt-3 text-[11px] text-muted">
          © {new Date().getFullYear()} Hoygi. All rights reserved.
        </p>
      </footer>

      {/* Sticky mobile purchase bar — bottom of the DOM, above the safe area */}
      <StickyBar />
    </div>
  );
}
