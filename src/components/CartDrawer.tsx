"use client";

import { useEffect, useRef } from "react";
import ProductArt from "@/components/ProductArt";
import Image from "next/image";
import QuantityStepper from "@/components/QuantityStepper";
import { ArrowIcon, CloseIcon, ShieldIcon } from "@/components/Icons";
import { formatPrice } from "@/data/product";
import { useCart } from "@/lib/cart";

export default function CartDrawer() {
  const {
    product,
    variantById,
    lines,
    isOpen,
    closeCart,
    setLineQuantity,
    removeLine,
    subtotal,
    compareAtSubtotal,
    itemCount,
    checkout,
    isCheckingOut,
    checkoutError,
  } = useCart();

  const thumb = product.images[0] ?? null;

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape to close + focus trap while open.
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  const savedAmount = compareAtSubtotal - subtotal;

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Scrim */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/25 backdrop-blur-[2px] transition-opacity duration-400 ease-silk ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-white/70 bg-blush shadow-lift transition-transform duration-450 ease-silk ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-rosedust/60 px-5 py-4">
          <h2 className="font-serif text-[19px] tracking-wide text-ink">
            Your Bag
            {itemCount > 0 && <span className="ml-2 text-[13px] text-muted">({itemCount})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-babypink/60"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="h-24 w-20 overflow-hidden rounded-2xl">
                <ProductArt variant="jar" className="h-full w-full" />
              </div>
              <p className="mt-5 font-serif text-[20px] text-ink">Your bag is empty.</p>
              <p className="mt-2 max-w-[26ch] text-[13px] leading-relaxed text-muted">
                Your glow ritual is one tap away.
              </p>
              <button type="button" onClick={closeCart} className="btn-secondary mt-6 max-w-[15rem]">
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => {
                const variant = variantById(line.variantId);
                return (
                  <li
                    key={line.variantId}
                    className="flex gap-4 rounded-xl2 border border-white/70 bg-white/70 p-3.5 shadow-soft"
                  >
                    <div className="relative h-[86px] w-[70px] shrink-0 overflow-hidden rounded-xl bg-petal">
                      {thumb ? (
                        <Image
                          src={thumb.src}
                          alt={thumb.alt}
                          fill
                          sizes="70px"
                          className="object-cover"
                        />
                      ) : (
                        <ProductArt variant="jar" className="h-full w-full" />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium leading-tight text-ink">
                            {product.shortTitle}
                          </p>
                          {/* One-variant products label the line with the product
                              name already; repeating it reads as a mistake. */}
                          {variant.title !== product.shortTitle && (
                            <p className="mt-0.5 text-[11.5px] text-muted">{variant.title}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(line.variantId)}
                          aria-label={`Remove ${variant.title} from bag`}
                          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-babypink/60 hover:text-ink"
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                        <QuantityStepper
                          compact
                          label={`Quantity for ${variant.title}`}
                          value={line.quantity}
                          onChange={(next) => setLineQuantity(line.variantId, next)}
                        />
                        <div className="text-right">
                          <p className="text-[14px] font-medium leading-none text-ink">
                            {formatPrice(variant.price * line.quantity)}
                          </p>
                          {variant.compareAtPrice && (
                            <p className="mt-1 text-[11.5px] leading-none text-muted line-through">
                              {formatPrice(variant.compareAtPrice * line.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-rosedust/60 bg-white/60 px-5 pt-4 backdrop-blur-sm pb-safe">
            {savedAmount > 0 && (
              <div className="mb-2.5 flex items-center justify-between text-[12px]">
                <span className="text-muted">Launch offer savings</span>
                <span className="font-medium text-pink">−{formatPrice(savedAmount)}</span>
              </div>
            )}

            <div className="flex items-baseline justify-between">
              <span className="text-[12px] uppercase tracking-eyebrow text-muted">Subtotal</span>
              <span className="font-serif text-[26px] leading-none text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-muted">
              Shipping and taxes calculated at checkout.
            </p>

            {checkoutError && (
              <p
                role="alert"
                className="mt-3 rounded-xl border border-pinksoft bg-white/70 px-3 py-2 text-[11.5px] leading-snug text-plum"
              >
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              onClick={checkout}
              disabled={isCheckingOut}
              className="btn-primary mt-4"
            >
              <span>{isCheckingOut ? "Opening checkout…" : "Checkout"}</span>
              {!isCheckingOut && <ArrowIcon />}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted">
              <ShieldIcon className="h-3.5 w-3.5 text-pink" />
              Secure checkout · Fast US delivery
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
