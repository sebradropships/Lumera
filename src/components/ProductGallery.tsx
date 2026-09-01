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
            // The frame bounds the image; it does not reshape it. Sizing the
            // photo as a replaced element with max-h/max-w and auto dimensions
            // makes it settle at its own aspect ratio inside those bounds, so a
            // 3:4 shot and a 5:4 panel both arrive whole. Cover-cropping to a
            // fixed square previously cut a fifth off the tall ones and two of
            // five ingredient cards off the wide one.
            className="relative flex aspect-square max-h-[33svh] w-full shrink-0 snap-center items-center justify-center sm:max-h-none"
            aria-label={`Image ${i + 1} of ${slides.length}`}
            role="group"
          >
            {slide.image ? (
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                width={slide.image.width ?? 1600}
                height={slide.image.height ?? 1600}
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
                quality={92}
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? "eager" : "lazy"}
                // The hairline replaces PhotoFrame here: a vignette overlay
                // would have covered the whole bounding box, haloing the empty
                // space beside an image that no longer fills it.
                className={photoClassName(
                  "h-auto max-h-full w-auto max-w-full rounded-xl3 object-contain shadow-soft ring-1 ring-inset ring-white/55",
                )}
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
