import AnnouncementBar from "@/components/AnnouncementBar";
import BrandHeader from "@/components/BrandHeader";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import SocialProof from "@/components/SocialProof";
import StickyBar from "@/components/StickyBar";
import { getProduct } from "@/lib/product-source";

export default async function Page() {
  const product = await getProduct();

  return (
    <div id="top" className="bg-atmosphere min-h-dvh">
      <AnnouncementBar />
      <BrandHeader />

      <main>
        {/* 1 — Hero / product / purchase */}
        <Hero />

        {/* 2 — Why Lumera: experience + how it works */}
        <Experience />

        {/* 3 — Social proof + final CTA */}
        <SocialProof product={product} />
      </main>

      <footer className="border-t border-sand/50 px-5 pb-28 pt-8 text-center sm:pb-12 lg:pb-12">
        <p className="font-serif text-[13px] uppercase tracking-brand text-charcoal">
          <span className="pl-[0.42em]">LUMERA</span>
        </p>
        <p className="mx-auto mt-3 max-w-[42ch] text-[11px] leading-relaxed text-muted">
          Lumera is a cosmetic skincare product, not a medical treatment. Results and appearance
          vary from person to person.
        </p>
        <p className="mt-3 text-[11px] text-muted">
          © {new Date().getFullYear()} Lumera. All rights reserved.
        </p>
      </footer>

      {/* Sticky mobile purchase bar — bottom of the DOM, above the safe area */}
      <StickyBar />
    </div>
  );
}
