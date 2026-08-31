"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProductVariant } from "@/data/product";
import type { ResolvedProduct } from "@/lib/product-source";
import { cartPermalink } from "@/lib/shopify";

export type CartLine = {
  variantId: string;
  quantity: number;
};

type CartState = {
  /** Live product when Shopify is connected, local defaults otherwise. */
  product: ResolvedProduct;
  defaultVariant: ProductVariant;
  variantById: (id: string) => ProductVariant;
  lines: CartLine[];
  isOpen: boolean;
  isCheckingOut: boolean;
  /** Set when checkout can't be reached, so the UI can say so instead of failing silently. */
  checkoutError: string | null;
  subtotal: number;
  compareAtSubtotal: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: string, quantity: number) => void;
  setLineQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  checkout: () => Promise<void>;
  buyNow: (variantId: string, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "lumera.cart.v1";

/**
 * Stored lines are dropped when they no longer match a live variant — a price
 * change or a renamed SKU must never resurrect a stale cart line.
 */
function readStoredLines(variants: ProductVariant[]): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => variants.some((v) => v.id === l.variantId))
      .map((l) => ({ variantId: l.variantId, quantity: Math.max(1, Math.min(99, l.quantity)) }));
  } catch {
    return [];
  }
}

export function CartProvider({
  product,
  children,
}: {
  product: ResolvedProduct;
  children: React.ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const defaultVariant = useMemo(
    () => product.variants.find((v) => v.default) ?? product.variants[0],
    [product.variants],
  );

  const variantById = useCallback(
    (id: string) => product.variants.find((v) => v.id === id) ?? defaultVariant,
    [product.variants, defaultVariant],
  );

  // Hydrate from localStorage after mount so server and client markup match.
  useEffect(() => setLines(readStoredLines(product.variants)), [product.variants]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable (private mode) — cart just won't persist */
    }
  }, [lines]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((variantId: string, quantity: number) => {
    setCheckoutError(null);
    setLines((current) => {
      const existing = current.find((l) => l.variantId === variantId);
      if (existing) {
        return current.map((l) =>
          l.variantId === variantId
            ? { ...l, quantity: Math.min(99, l.quantity + quantity) }
            : l,
        );
      }
      return [...current, { variantId, quantity: Math.min(99, Math.max(1, quantity)) }];
    });
  }, []);

  const setLineQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((l) => l.variantId !== variantId)
        : current.map((l) =>
            l.variantId === variantId ? { ...l, quantity: Math.min(99, quantity) } : l,
          ),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    setLines((current) => current.filter((l) => l.variantId !== variantId));
  }, []);

  const { subtotal, compareAtSubtotal, itemCount } = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        const variant = variantById(line.variantId);
        acc.subtotal += variant.price * line.quantity;
        acc.compareAtSubtotal += (variant.compareAtPrice ?? variant.price) * line.quantity;
        acc.itemCount += line.quantity;
        return acc;
      },
      { subtotal: 0, compareAtSubtotal: 0, itemCount: 0 },
    );
  }, [lines, variantById]);

  /** Resolves a Shopify checkout URL for the given lines, or null. */
  const resolveCheckoutUrl = useCallback(async (target: CartLine[]) => {
    const payload = target.map((line) => {
      const variant = variantById(line.variantId);
      return {
        variantId: variant.shopifyVariantId,
        variantGid: variant.shopifyVariantGid,
        quantity: line.quantity,
      };
    });

    // 1. Storefront API cart.
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: payload }),
      });
      if (res.ok) {
        const data = (await res.json()) as { checkoutUrl?: string };
        if (data.checkoutUrl) return data.checkoutUrl;
      }
    } catch {
      /* fall through to the permalink */
    }

    // 2. Cart permalink.
    return cartPermalink(payload, product.shopifyDomain);
  }, [variantById, product.shopifyDomain]);

  const startCheckout = useCallback(
    async (target: CartLine[]) => {
      if (target.length === 0) return;
      setIsCheckingOut(true);
      setCheckoutError(null);
      try {
        const url = await resolveCheckoutUrl(target);
        if (url) {
          window.location.assign(url);
          return;
        }
        setCheckoutError(
          product.shopifyDomain
            ? "Checkout isn't available yet — this product still needs its Shopify variant ID."
            : "Checkout isn't connected yet. Add your Shopify store details to enable it.",
        );
        setIsOpen(true);
      } finally {
        setIsCheckingOut(false);
      }
    },
    [resolveCheckoutUrl, product.shopifyDomain],
  );

  const checkout = useCallback(() => startCheckout(lines), [lines, startCheckout]);

  const buyNow = useCallback(
    async (variantId: string, quantity: number) => {
      addToCart(variantId, quantity);
      await startCheckout([{ variantId, quantity }]);
    },
    [addToCart, startCheckout],
  );

  const value = useMemo<CartState>(
    () => ({
      product,
      defaultVariant,
      variantById,
      lines,
      isOpen,
      isCheckingOut,
      checkoutError,
      subtotal,
      compareAtSubtotal,
      itemCount,
      openCart,
      closeCart,
      addToCart,
      setLineQuantity,
      removeLine,
      checkout,
      buyNow,
    }),
    [
      product,
      defaultVariant,
      variantById,
      lines,
      isOpen,
      isCheckingOut,
      checkoutError,
      subtotal,
      compareAtSubtotal,
      itemCount,
      openCart,
      closeCart,
      addToCart,
      setLineQuantity,
      removeLine,
      checkout,
      buyNow,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>.");
  return context;
}
