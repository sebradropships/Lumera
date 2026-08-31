import ProductGallery from "@/components/ProductGallery";
import PurchasePanel from "@/components/PurchasePanel";
import Reveal from "@/components/Reveal";

export default function Hero() {
  return (
    <section id="offer" aria-labelledby="hero-heading" className="relative pb-16 pt-4 sm:pt-6 lg:pb-24">
      <h2 id="hero-heading" className="sr-only">
        Hoygi Bio-Collagen Gel Face Mask
      </h2>

      <div className="shell">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <Reveal className="lg:sticky lg:top-24">
            <ProductGallery />
          </Reveal>

          <Reveal delay={90}>
            <PurchasePanel />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
