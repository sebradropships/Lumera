"use client";

import { useCart } from "@/lib/cart";
import { ArrowIcon } from "@/components/Icons";
import { defaultVariant, product } from "@/data/product";

export default function FinalCta() {
  const { addToCart, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(defaultVariant.id, 1);
        openCart();
      }}
      className="btn-primary max-w-[26rem]"
    >
      <span>{product.offer.ctaFinal}</span>
      <ArrowIcon />
    </button>
  );
}
