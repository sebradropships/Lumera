"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import Countdown from "@/components/Countdown";
import QuantityStepper from "@/components/QuantityStepper";
import {
  ArrowIcon,
  DiamondIcon,
  DropIcon,
  LeafIcon,
  ShieldIcon,
  SparkleIcon,
  Stars,
  TruckIcon,
} from "@/components/Icons";
import { formatPrice, savingsPercent } from "@/data/product";

const icons = { drop: DropIcon, leaf: LeafIcon, sparkle: SparkleIcon };

export default function PurchasePanel() {
  const { product, defaultVariant, variantById, addToCart, openCart, buyNow, isCheckingOut } =
    useCart();
  const [variantId, setVariantId] = useState(defaultVariant.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const hasVariants = product.variants.length > 1;
  const variant = variantById(variantId);
  const savings = savingsPercent(variant);

  const handleAdd = () => {
    addToCart(variant.id, quantity);
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="mt-6 sm:mt-10">
      <p className="eyebrow">{product.eyebrow}</p>

      <h1 className="display mt-2.5 text-[33px] sm:text-[46px] lg:text-[54px]">
        {product.headline}
      </h1>

      <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.6] text-plum sm:mt-4 sm:text-[16px]">
        {product.subhead}
      </p>

      {/* Benefit micro-row */}
      <ul className="mt-5 grid grid-cols-3 gap-2 border-y border-rosedust/60 py-3.5 sm:mt-7 sm:py-5">
        {product.benefits.map((benefit) => {
          const Icon = icons[benefit.icon];
          return (
            <li key={benefit.label} className="flex flex-col items-center gap-2 text-center">
              <span className="h-[22px] w-[22px] text-pink">
                <Icon />
              </span>
              <span className="text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-plum sm:text-[10.5px] sm:tracking-eyebrow">
                {benefit.label}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Offer */}
      <div className="mt-5 rounded-xl2 border border-white/70 bg-white/70 p-5 shadow-soft backdrop-blur-sm sm:mt-7 sm:p-6">
        <div className="flex items-center gap-2">
          <DiamondIcon className="h-2.5 w-2.5 text-pink" />
          <p className="text-[10px] font-semibold uppercase tracking-eyebrow text-pink sm:text-[10.5px]">
            {product.offer.label}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="flex items-baseline gap-3">
            <span className="price-now">{formatPrice(variant.price)}</span>
            {variant.compareAtPrice && (
              <span className="price-was">{formatPrice(variant.compareAtPrice)}</span>
            )}
          </div>
          {savings && (
            <span className="rounded-full bg-pink px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide2 text-white">
              Save {savings}% today
            </span>
          )}
        </div>

        <Countdown className="mt-3.5 border-t border-rosedust/50 pt-3.5" />

        {hasVariants && (
          <fieldset className="mt-5 sm:mt-6">
            <legend className="sr-only">Choose your pack</legend>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map((option) => {
                const selected = option.id === variantId;
                return (
                  <label
                    key={option.id}
                    className={`relative flex cursor-pointer flex-col rounded-2xl border px-3.5 py-2.5 transition-all duration-300 ease-silk ${
                      selected
                        ? "border-pink bg-babypink/40 shadow-soft"
                        : "border-rosedust/70 bg-white/60 hover:border-pinksoft"
                    }`}
                  >
                    <input
                      type="radio"
                      name="hoygi-variant"
                      value={option.id}
                      checked={selected}
                      onChange={() => setVariantId(option.id)}
                      className="sr-only"
                    />
                    {option.badge && (
                      <span className="absolute -top-2 right-3 rounded-full bg-pink px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wide2 text-white">
                        {option.badge}
                      </span>
                    )}
                    <span className="font-serif text-[18px] leading-none text-ink">
                      {option.title}
                    </span>
                    {option.note && (
                      <span className="mt-0.5 text-[11px] leading-tight text-muted">{option.note}</span>
                    )}
                    <span className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-[15px] font-medium text-ink">
                        {formatPrice(option.price)}
                      </span>
                      {option.compareAtPrice && (
                        <span className="text-[12px] text-muted line-through">
                          {formatPrice(option.compareAtPrice)}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="mt-4 flex items-center gap-4">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <p className="text-[11.5px] leading-tight text-muted">
            {formatPrice(variant.price * quantity)} total
          </p>
        </div>

        <div id="buy-box" className="mt-4 space-y-2.5">
          <button type="button" onClick={handleAdd} className="btn-primary">
            <span>{added ? "Added to bag" : product.offer.ctaPrimary}</span>
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 ease-silk group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => buyNow(variant.id, quantity)}
            disabled={isCheckingOut}
            className="btn-secondary"
          >
            {isCheckingOut ? "Opening checkout…" : "Buy it now"}
          </button>
        </div>

        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldIcon className="h-3.5 w-3.5 text-pink" />
            Secure checkout
          </span>
          <span aria-hidden="true" className="text-rosedust">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <TruckIcon className="h-3.5 w-3.5 text-pink" />
            Fast US delivery
          </span>
        </p>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] uppercase tracking-eyebrow text-pink">
          <DiamondIcon className="h-2 w-2" />
          {product.offer.urgency}
        </p>
      </div>

      {/* Trust strip */}
      <div className="mt-6 flex items-center justify-center gap-2.5">
        <Stars />
        <span className="text-[11.5px] tracking-wide text-plum">
          Loved by skincare lovers
        </span>
      </div>
    </div>
  );
}
