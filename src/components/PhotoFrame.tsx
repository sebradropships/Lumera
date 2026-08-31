import { photoBlend } from "@/data/media";

/**
 * Settles a product photo into the pink page.
 *
 * Supplier photography is almost always shot on white, and a white rectangle on
 * a blush ground reads as a sticker pasted onto the design. Two ways to fix it,
 * chosen in `src/data/media.ts` because which one wins depends on the photos:
 *
 *   "frame"    — a pink vignette dissolves the edges into the page, plus a
 *                whisper of blush over the whole frame so the whites pick up
 *                the palette. Safe for any photo, including ones shot on grey
 *                or with their own background detail. This is the default.
 *
 *   "multiply" — multiply blending makes pure white transparent, so the
 *                background disappears entirely and the product sits directly
 *                on the pink. Much stronger, but it only works when the
 *                backdrop is genuinely white; anything grey turns muddy and
 *                dark products lose contrast.
 *
 *   "none"     — photo as shot, hairline only.
 */
export function photoClassName(base = ""): string {
  return photoBlend === "multiply" ? `${base} mix-blend-multiply` : base;
}

export default function PhotoFrame({ subtle = false }: { subtle?: boolean }) {
  if (photoBlend === "none") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/55"
      />
    );
  }

  // Multiply already merges the photo with the page, so it needs only the
  // hairline — a vignette on top would darken the edges twice.
  if (photoBlend === "multiply") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/40"
      />
    );
  }

  const edge = subtle
    ? "rgba(249,214,225,0.30) 76%, rgba(240,168,190,0.48) 100%"
    : "rgba(249,214,225,0.46) 72%, rgba(240,168,190,0.78) 100%";

  return (
    <>
      {/* Edge fade — clear through the middle so the product is untouched. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(128% 118% at 50% 46%, transparent 48%, ${edge})`,
        }}
      />
      {/* A breath of blush over everything, tying the whites to the palette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-babypink/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/55"
      />
    </>
  );
}
