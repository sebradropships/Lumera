/**
 * ── BRAND MARK ───────────────────────────────────────────────────────────────
 *
 * The wordmark shown in the header and footer. It resolves the same way the
 * product imagery does (see media.ts): a file listed here wins, otherwise the
 * page falls back to the letter-spaced type treatment.
 *
 * TO ENABLE:
 *   1. Put the logo in `public/` — e.g. `public/logo-hoygi.png`
 *   2. Set `src` below to `/logo-hoygi.png`
 *
 * `width`/`height` only establish the intrinsic ratio for next/image. Both call
 * sites render the mark with `h-* w-auto`, so the browser sizes it from the
 * file's real aspect ratio — a slightly stale number here cannot squash it.
 *
 * ON BACKGROUNDS: this mark is pale pink on a pale pink page, so it carries a
 * soft shadow to lift it off the blush. If the exported PNG has a baked white
 * background rather than transparency, set `blend` to "multiply" — the same
 * trick PhotoFrame uses to dissolve white product backdrops into the page.
 */
export type BrandLogo = {
  src: string;
  /** Intrinsic pixel size. Ratio only — display size is set in CSS. */
  width: number;
  height: number;
  /** "multiply" dissolves a baked white background. "none" for transparent PNG/SVG. */
  blend: "multiply" | "none";
};

/** null → the type-set wordmark. Set this once the logo file is in `public/`. */
export const logo: BrandLogo | null = null;
