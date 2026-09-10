/**
 * Ambient types for the Meta (Facebook) Pixel.
 *
 * The pixel's base snippet defines `window.fbq` at runtime, so TypeScript has
 * no idea it exists. These overloads describe the calls the site actually
 * makes, and a permissive final signature keeps any further call compiling
 * rather than forcing a cast at each site.
 *
 * `_fbq` is the alias the snippet also assigns; it is declared so the snippet's
 * own shape is fully described.
 */

interface FbqFunction {
  (command: "init", pixelId: string, advancedMatching?: Record<string, unknown>): void;
  (
    command: "track",
    event:
      | "PageView"
      | "ViewContent"
      | "AddToCart"
      | "InitiateCheckout"
      | "AddPaymentInfo"
      | "Purchase"
      | "Lead"
      | "CompleteRegistration"
      | "Search"
      | "AddToWishlist"
      | "Contact"
      | "CustomizeProduct"
      | "Donate"
      | "FindLocation"
      | "Schedule"
      | "StartTrial"
      | "SubmitApplication"
      | "Subscribe",
    parameters?: Record<string, unknown>,
    options?: { eventID?: string },
  ): void;
  (
    command: "trackCustom",
    event: string,
    parameters?: Record<string, unknown>,
    options?: { eventID?: string },
  ): void;
  (command: "consent", action: "grant" | "revoke"): void;
  /** Escape hatch for commands not enumerated above. */
  (command: string, ...args: unknown[]): void;

  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
}

declare global {
  interface Window {
    fbq: FbqFunction;
    _fbq?: FbqFunction;
  }
}

export {};
