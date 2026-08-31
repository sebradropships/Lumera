"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductArt from "@/components/ProductArt";
import PhotoFrame, { photoClassName } from "@/components/PhotoFrame";
import type { ProductImage } from "@/data/media";
import { useCart } from "@/lib/cart";

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

  const slides: Slide[] = useMemo(
    () =>
      product.images.length > 0
        ? product.images.map((image, i) => ({ key: `image-${i}`, image }))
        : fallbackSlides,
    [product.images],
  );

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
            // Square frame end to end: the store's photography is 1600x1600,
            // and a 4:5 frame would have cover-cropped a fifth of every shot
            // off the top and bottom. Matching the source means no crop at all
            // on desktop. Mobile still caps the height to keep the price above
            // the fold, which costs a small symmetric crop.
            className="relative aspect-square max-h-[33svh] w-full shrink-0 snap-center overflow-hidden rounded-xl3 bg-petal sm:max-h-none"
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
                className={photoClassName("object-cover")}
              />
            ) : (
              <ProductArt variant={slide.art} className="h-full w-full" />
            )}
            {slide.image && <PhotoFrame />}
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
