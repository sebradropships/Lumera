import type { ProductVariant } from "@/data/product";

/**
 * Meta Pixel event helpers.
 *
 * Every commerce event goes out twice under one event id: through `fbq` from
 * the browser, and through the same-origin Conversions API relay at
 * /api/capi, which forwards a server copy to Meta. Meta deduplicates the pair
 * on event_name + event_id, so an event counts once whether one copy lands or
 * both.
 *
 * That pairing is the point. Between 11 and 20 Sep the browser pixel alone
 * lost 83% of Hoygi's link clicks: mobile visitors left before fbevents.js had
 * finished downloading from Facebook, so nothing was ever counted, and a
 * blocked facebook.com does exactly the same thing. The relay is first-party,
 * so a blocker aimed at Facebook leaves it alone, and it is beaconed, so it
 * survives the page unloading — InitiateCheckout fires on the way out to
 * Shopify.
 *
 * `track` is still a no-op for fbq when fbq is missing. That is the common
 * case, not the rare one, and analytics must never be able to break a
 * purchase — but the server copy now goes out regardless.
 */

/** hoygi 1 — also the dataset src/app/api/capi/route.ts posts to. */
export const META_PIXEL_ID = "1077952204953438";

/** Dispatched by the inline base code once `fbq` exists; releases anything
    queued before it. */
export const PIXEL_READY_EVENT = "hoygi:pixel-ready";

/** Same-origin relay to the Conversions API (src/app/api/capi/route.ts). */
export const CAPI_PATH = "/api/capi";

/** Prices are held in cents; Meta expects major units. */
export function toMajorUnits(cents: number): number {
  return Math.round(cents) / 100;
}

export type PixelLine = { variant: ProductVariant; quantity: number };

export type PixelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout";

/** Prefer the Shopify variant id so events reconcile with a synced catalogue. */
function contentId(variant: ProductVariant): string {
  return variant.shopifyVariantId ?? variant.id;
}

/** One id per event, shared by the browser pixel and its server copy so Meta
    counts the pair once. */
export function newEventId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/* The server copy. sendBeacon so it is not cancelled when the page goes away;
   fetch with keepalive where sendBeacon is unavailable. The relay decides what
   actually reaches Meta. */
function relay(event: PixelEvent, eventId: string, params: Record<string, unknown>): void {
  try {
    const body = JSON.stringify({
      event_name: event,
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: params,
    });
    if (navigator.sendBeacon?.(CAPI_PATH, body)) return;
    void fetch(CAPI_PATH, { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {
    /* Tracking must not be able to break a purchase. */
  }
}

let queued: (() => void)[] = [];

export function track(event: PixelEvent, params: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const eventID = newEventId();
  relay(event, eventID, params);

  const fire = () => window.fbq("track", event, params, { eventID });
  if (typeof window.fbq === "function") {
    fire();
    return;
  }

  /* The base code is inline in the server HTML, so fbq normally exists before
     any of this runs. It is missing only if that script never ran — inline
     scripts blocked outright. Hold the event until the base code announces
     itself; if it never does, the queue never drains and the server copy above
     is the only record. */
  queued.push(fire);
  if (queued.length > 1) return;
  window.addEventListener(
    PIXEL_READY_EVENT,
    () => {
      const pending = queued;
      queued = [];
      pending.forEach((run) => run());
    },
    { once: true },
  );
}

/** Shared shape for the commerce events: ids, line detail, value and currency. */
export function contentPayload(
  lines: PixelLine[],
  currency: string,
  contentName: string,
): Record<string, unknown> {
  const value = lines.reduce((sum, l) => sum + l.variant.price * l.quantity, 0);
  return {
    content_type: "product",
    content_name: contentName,
    content_ids: lines.map((l) => contentId(l.variant)),
    contents: lines.map((l) => ({
      id: contentId(l.variant),
      quantity: l.quantity,
      item_price: toMajorUnits(l.variant.price),
    })),
    num_items: lines.reduce((sum, l) => sum + l.quantity, 0),
    value: toMajorUnits(value),
    currency,
  };
}
