import { NextResponse } from "next/server";
import { createStorefrontCheckout, type CheckoutLine } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Turns the local cart into a Shopify checkout URL.
 *
 * An unconfigured Storefront API answers 200 with `configured: false`, not a
 * 5xx: the client handles it by falling back to a cart permalink, so it is a
 * normal state rather than a server fault, and returning 501 made every
 * checkout attempt count as an error in production monitoring.
 */
export async function POST(request: Request) {
  let lines: CheckoutLine[] = [];
  try {
    const body = (await request.json()) as { lines?: CheckoutLine[] };
    lines = Array.isArray(body.lines) ? body.lines : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  try {
    const checkoutUrl = await createStorefrontCheckout(lines);
    if (!checkoutUrl) {
      return NextResponse.json({ configured: false });
    }
    return NextResponse.json({ checkoutUrl, configured: true });
  } catch (error) {
    // A genuine outage: Shopify was configured but unreachable.
    console.error("[shopify] Storefront checkout failed:", error);
    return NextResponse.json({ error: "Could not reach Shopify." }, { status: 502 });
  }
}
