import Image from "next/image";
import ProductArt from "@/components/ProductArt";
import Reveal from "@/components/Reveal";
import { DiamondIcon } from "@/components/Icons";
import { benefitImages, ritualImage } from "@/data/media";

const cards = [
  {
    number: "01",
    title: "Deep Hydration",
    copy: "Helps replenish moisture for skin that feels soft, supple and refreshed.",
    art: "texture" as const,
  },
  {
    number: "02",
    title: "Smoother-Looking Skin",
    copy: "A gel mask designed to leave skin looking smoother and more refreshed.",
    art: "mask" as const,
  },
  {
    number: "03",
    title: "Visible Radiance",
    copy: "Reveal a fresh, dewy-looking complexion after your skincare ritual.",
    art: "jar" as const,
  },
];

const steps = [
  { number: "01", title: "Apply", copy: "Place the mask onto clean skin." },
  { number: "02", title: "Relax", copy: "Leave on according to the product instructions." },
  {
    number: "03",
    title: "Glow",
    copy: "Remove and gently massage remaining essence into the skin.",
  },
];

export default function Experience() {
  return (
    <section
      aria-labelledby="experience-heading"
      className="relative border-y border-rosedust/50 bg-[linear-gradient(180deg,#FFF7F9_0%,#FDECF1_45%,#FFF7F9_100%)] py-16 sm:py-20 lg:py-28"
    >
      <div className="shell">
        <Reveal className="mx-auto max-w-[34rem] text-center">
          <p className="eyebrow">WHY LUMERA</p>
          <h2
            id="experience-heading"
            className="display mt-3 text-[32px] sm:text-[42px] lg:text-[50px]"
          >
            Your Skin, But More Radiant.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.65] text-plum sm:text-[16px]">
            Turn your skincare routine into a 20-minute glow ritual.
          </p>
        </Reveal>

        {/* Benefit cards */}
        <ul className="mt-11 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:gap-7">
          {cards.map((card, i) => {
            const image = benefitImages[i];
            return (
              <Reveal as="li" key={card.number} delay={i * 90} className="h-full">
                <article className="group h-full overflow-hidden rounded-xl2 border border-white/70 bg-white/65 shadow-soft backdrop-blur-[2px] transition-all duration-500 ease-silk hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-700 ease-silk group-hover:scale-[1.04]"
                      />
                    ) : (
                      <ProductArt
                        variant={card.art}
                        className="h-full w-full transition-transform duration-700 ease-silk group-hover:scale-[1.04]"
                      />
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-[10px] font-medium uppercase tracking-eyebrow text-pink">
                      {card.number}
                    </p>
                    <h3 className="mt-2.5 font-serif text-[22px] leading-tight text-ink sm:text-[24px]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-plum">{card.copy}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        {/* How it works — compact */}
        <Reveal className="mt-14 lg:mt-20">
          <div className="overflow-hidden rounded-xl3 border border-white/70 bg-white/70 shadow-soft backdrop-blur-sm md:grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-stretch">
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px]">
              {ritualImage ? (
                <Image
                  src={ritualImage.src}
                  alt={ritualImage.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              ) : (
                <ProductArt variant="ritual" className="h-full w-full" />
              )}
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">HOW IT WORKS</p>
              <ol className="mt-5 space-y-5">
                {steps.map((step) => (
                  <li key={step.number} className="flex gap-4">
                    <span className="mt-[3px] shrink-0 font-serif text-[15px] tracking-wide2 text-pink">
                      {step.number}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-[1.55] text-plum">{step.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-6 flex items-center gap-2 text-[11px] text-muted">
                <DiamondIcon className="h-2 w-2 text-pinksoft" />
                A cosmetic skincare ritual — always follow the instructions on pack.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
