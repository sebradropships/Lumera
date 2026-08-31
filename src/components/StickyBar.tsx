"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { ArrowIcon } from "@/components/Icons";
import { formatPrice, savingsPercent } from "@/data/product";

/**
 * Mobile purchase bar. Appears once the visitor has scrolled and the hero CTA
 * is off screen, and hides again while the cart drawer is open so it never sits
 * on top of the checkout. Bottom padding respects the iPhone safe area.
 */
export default function StickyBar() {
  const { product, defaultVariant, addToCart, openCart, isOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const savings = savingsPercent(defaultVariant);

  useEffect(() => {
    const buyBox = document.getElementById("buy-box");

    // Fallback for browsers without IntersectionObserver: a plain scroll threshold.
    if (!buyBox || !("IntersectionObserver" in window)) {
      const onScroll = () => setVisible(window.scrollY > 320);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    let ctaVisible = true;
    let scrolled = false;
    const sync = () => setVisible(scrolled && !ctaVisible);

    const observer = new IntersectionObserver(
      ([entry]) => {
        ctaVisible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.35 },
    );
    observer.observe(buyBox);

    // Only once the visitor has actually engaged with the page.
    const onScroll = () => {
      scrolled = window.scrollY > 280;
      sync();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const shown = visible && !isOpen;

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-30 transition-all duration-500 ease-silk lg:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="border-t border-rosedust/60 bg-blush/90 px-4 pt-3 shadow-[0_-8px_30px_-18px_rgba(43,31,36,0.45)] backdrop-blur-xl pb-safe">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-medium leading-tight text-ink">
              {product.shortTitle}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] leading-tight text-muted">
              <span className="font-medium text-ink">{formatPrice(defaultVariant.price)}</span>
              {savings && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium uppercase tracking-wide text-pink">
                    Save {savings}%
                  </span>
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            tabIndex={shown ? 0 : -1}
            onClick={() => {
              addToCart(defaultVariant.id, 1);
              openCart();
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[12px] font-medium uppercase tracking-wide2 text-blush shadow-lift transition-transform duration-200 active:scale-[0.97]"
          >
            Get yours
            <ArrowIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
