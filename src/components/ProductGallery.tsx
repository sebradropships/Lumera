"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductArt from "@/components/ProductArt";
import { photoClassName } from "@/components/PhotoFrame";
import { gallery as localGallery, type ProductImage } from "@/data/media";
import { useCart } from "@/lib/cart";
import { imageSlots } from "@/lib/image-slots";

type Slide = {
  key: string;
  art?: "jar" | "mask" | "texture";
  image?: ProductImage;
};

const fallbackSlides: Slide[] = [
  { key: "jar", art: "jar" },
  { key: "mask", art: "mask" },
  { key: "texture", art: "texture" },
];

export default function ProductGallery() {
  const { product } = useCart();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const slides: Slide[] = useMemo(() => {
    const hero = localGallery.length > 0 ? localGallery : imageSlots(product.images).gallery;
    return hero.length > 0
      ? hero.map((image, i) => ({ key: `image-${i}`, image }))
      : fallbackSlides;
  }, [product.images]);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(Math.max(0, Math.min(slides.length - 1, index)));
  }, [slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    setActive(index);
  };

  return (
    <div className="relative">
      {/* Soft babypink halo behind the product */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -top-8 bottom-8 -z-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(249,214,225,0.9),rgba(249,214,225,0))] blur-xl"
      />

      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl3"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${product.shortTitle} images`}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.key}
            // One frame size for every slide, with the image contained inside
            // it. Cover would crop to fill and contain alone would leave each
            // slide a different width, so the card is the constant and the
            // photo sits within it — same box each time, nothing cut. The
            // height cap keeps the price above the fold on a 390x844 screen;
            // raising it further pushes the price under.
            className="relative aspect-square max-h-[36svh] w-full shrink-0 snap-center overflow-hidden rounded-xl3 bg-petal shadow-soft ring-1 ring-inset ring-white/55 sm:max-h-none"
            aria-label={`Image ${i + 1} of ${slides.length}`}
            role="group"
          >
            {slide.image ? (
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
                quality={92}
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? "eager" : "lazy"}
                // The hairline replaces PhotoFrame here: a vignette overlay
                // would have covered the whole bounding box, haloing the empty
                // space beside an image that no longer fills it.
                className={photoClassName("object-contain")}
              />
            ) : (
              <ProductArt variant={slide.art} className="h-full w-full rounded-xl3" />
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="mt-1.5 flex items-center justify-center gap-0.5 sm:mt-2">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={active === i}
              className="flex h-9 w-9 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-500 ease-silk ${
                  active === i ? "w-7 bg-pink" : "w-1.5 bg-rosedust"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
