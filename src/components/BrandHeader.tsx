"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { BagIcon } from "@/components/Icons";
import Wordmark from "@/components/Wordmark";

export default function BrandHeader() {
  const { itemCount, openCart } = useCart();
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ease-silk ${
        condensed
          ? "border-b border-rosedust/50 bg-blush/95 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-14 items-center justify-between sm:h-16">
        <span className="w-9" aria-hidden="true" />

        <a
          href="#top"
          className="flex h-10 items-center font-serif text-[15px] font-medium uppercase tracking-brand text-ink sm:text-[17px]"
          aria-label="Hoygi — back to top"
        >
          <Wordmark className="h-7 w-auto sm:h-8" alt="" priority />
        </a>

        <button
          type="button"
          onClick={openCart}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors duration-300 hover:bg-babypink/60"
          aria-label={itemCount > 0 ? `Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Open cart"}
        >
          <BagIcon />
          {itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[9.5px] font-semibold leading-none text-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
