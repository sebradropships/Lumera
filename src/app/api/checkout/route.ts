import { NextResponse } from "next/server";
import { createStorefrontCheckout, type CheckoutLine } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Turns the local cart into a Shopify checkout URL.
 * Returns 501 when the Storefront API is not configured — the client then
 * falls back to a cart permalink.
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
      return NextResponse.json({ error: "Storefront API not configured." }, { status: 501 });
    }
    return NextResponse.json({ checkoutUrl });
  } catch {
    return NextResponse.json({ error: "Could not reach Shopify." }, { status: 502 });
  }
}
