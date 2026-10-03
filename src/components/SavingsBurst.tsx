"use client";

/**
 * A burst of hearts out of the savings figure in the cart drawer.
 *
 * Fifteen particles leave the "−$52" on a radial spread, drift upward, rotate
 * and fade over 0.8–1.2s. The motion itself lives in globals.css; this file
 * only works out each particle's vector and hands it over as custom properties,
 * so one keyframe serves all fifteen.
 *
 * Deliberately NOT Framer Motion. The storefront ships four runtime
 * dependencies and its whole problem on mobile was JavaScript arriving too late
 * — the inline pixel exists because of it. A ~100KB animation runtime for one
 * decorative flourish would be paid for on every visit, by every visitor,
 * including the ones who never open the bag. Fifteen spans and a keyframe cost
 * nothing and run on the compositor.
 *
 * Safety, since this sits directly above the checkout button:
 * - the layer is `pointer-events-none`, so nothing here can swallow a tap;
 * - every particle is absolutely positioned, so none of it is in flow and it
 *   cannot shift the subtotal, the shipping row or the button;
 * - the drawer footer clips it with `overflow-hidden`, so a particle heading
 *   right can never widen the document or cause horizontal scroll.
 */

const PARTICLE_COUNT = 15;

/* The golden angle spreads fifteen points around a circle without the banding a
   flat 24° step produces — the gaps stay irregular, which is what reads as
   organic rather than as a clock face. */
const GOLDEN_ANGLE = 137.508;

/* Fixed, not random. This component renders on the server as part of the
   drawer, and Math.random() would hand the client different numbers on
   hydration. Everything below is derived from the index instead, so both
   passes agree. */
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  /* -90° so the first heart leaves straight up, where the eye already is. */
  const radians = ((index * GOLDEN_ANGLE - 90) * Math.PI) / 180;
  const distance = 38 + ((index * 7) % 34);

  return {
    tx: Math.round(Math.cos(radians) * distance),
    /* Every particle also carries a constant upward bias, so the burst floats
       as it spreads instead of sitting on its origin. */
    ty: Math.round(Math.sin(radians) * distance) - (14 + ((index * 5) % 16)),
    rotate: ((index * 53) % 280) - 140,
    scale: 0.75 + ((index * 3) % 5) / 10,
    delay: ((index * 11) % 18) / 100,
    duration: 0.8 + ((index * 13) % 41) / 100,
  };
});

export default function SavingsBurst({ burstKey }: { burstKey: number }) {
  /* 0 is the initial render — nothing has been celebrated yet. */
  if (burstKey === 0) return null;

  return (
    /* Keyed so a new burst remounts the particles and restarts the animation;
       without it the second open would find them already finished. */
    <span key={burstKey} aria-hidden className="pointer-events-none absolute inset-0">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="savings-heart pointer-events-none absolute left-1/2 top-1/2 select-none text-[13px] leading-none"
          style={
            {
              "--burst-tx": `${particle.tx}px`,
              "--burst-ty": `${particle.ty}px`,
              "--burst-rotate": `${particle.rotate}deg`,
              "--burst-scale": particle.scale,
              "--burst-delay": `${particle.delay}s`,
              "--burst-duration": `${particle.duration}s`,
            } as React.CSSProperties
          }
        >
          💖
        </span>
      ))}
    </span>
  );
}
