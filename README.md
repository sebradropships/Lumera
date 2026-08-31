# HOYGI

A pink, mobile-first, single-product landing page for the **Hoygi Bio-Collagen
Gel Face Mask**, backed by a live Shopify store. Built as a direct-response
funnel, not a Shopify template.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS.

---

## The page

Exactly three main sections, in funnel order:

| # | Section | Job |
|---|---------|-----|
| 1 | **Hero / Product / Purchase** | Gallery, headline, benefits, offer, countdown, quantity, add-to-cart, buy-now |
| 2 | **Why Hoygi** | Three benefit cards + a compact three-step "How it works" |
| 3 | **Social proof + Final CTA** | Reviews (see below) and the closing offer block |

Plus a sale strip, sticky brand header, mobile purchase bar, cart drawer, and a
minimal legal footer. No about page, no blog, no FAQ, no newsletter block.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Shopify details
npm run dev                  # http://localhost:3000
```

---

## Shopify

Two server-side variables are the entire configuration:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_...     # secret — never NEXT_PUBLIC_
```

With those set, the store supplies the **commerce facts** — price, compare-at
price, variants, checkout IDs and photography (served from `cdn.shopify.com`).
Checkout works through a cart permalink; no Storefront token needed.

Nothing store-related is inlined at build time, so setting these on an
already-deployed site takes effect without a rebuild.

**The store does not supply brand copy.** Headline, benefits, CTA labels and the
product *name* stay in `src/data/product.ts`. That split matters for a
dropshipped catalogue, where the store's own title is the supplier's SEO string.
Set `SHOPIFY_USE_LIVE_TITLE=true` if your store title really is customer-facing.

### Is it connected?

```
GET /api/shopify-status
```

Runs three probes — reach the shop, count the products, run the product query —
and names the specific cause and fix when one fails. Returns no secrets.

Common causes: a **401** means the token is wrong or revoked; a **403** means the
app is missing the `read_products` scope; a **404** usually means the API version
has aged out of Shopify's ~1-year support window (see `SHOPIFY_API_VERSION`).

### Choosing the product

`SHOPIFY_PRODUCT_QUERY` defaults to `status:active` and takes the first match.
Set `SHOPIFY_PRODUCT_HANDLE` to target one product exactly, regardless of status.

---

## The offer

`src/data/offer.ts` drives the sale strip and the countdown.

**Countdown.** `recurringWindowHours` (default 8) is anchored to a fixed UTC
epoch, so every visitor sees the same number at the same instant and it rolls
over on shared boundaries — 00:00, 08:00, 16:00 UTC. It is *not* restarted per
person, per session, or on page load. Set it to `null` and use `endsAt` for a
single hard deadline instead.

> A countdown implies a deadline. If the price never actually changes when the
> clock hits zero, the urgency is fictional — the FTC and the EU Omnibus
> Directive both treat that as a deceptive practice. If you run the recurring
> window, genuinely cycle the offer.

**Discounts are never invented.** Every "save X%" badge, the struck-through
price and the strip's discount line all derive from the live compare-at price.
No compare-at price means no discount claim anywhere on the page. Set one in
Shopify and they appear on their own.

---

## Typography

**Gilroy** is a commercial typeface (Fontfabric) and is not bundled. The font
stack lists it first with **Outfit** behind it, so proportions hold either way.
See `public/fonts/README.md` for the two steps to install it.

## Palette

```
blush    #FFF7F9   page ground        ink       #2B1F24   headings
petal    #FDEFF3   section fill       plum      #574450   body copy
babypink #F9D6E1   accent fill        muted     #7E6A72   secondary
rosedust #EFC3D0   hairlines          pink      #C2456B   accent, sale strip
                                      pinksoft  #F0A8BE   decorative
```

Contrast checked: pink on blush 5.3:1, white on pink 5.3:1, muted on blush 5:1.
Sale strip and savings pills carry the pink; CTAs stay ink so the primary action
still reads first.

---

## Reviews

`src/data/reviews.ts` is **empty on purpose** — inventing customers would be
fabricated social proof. Add real ones there and section 3 uses them.

`NEXT_PUBLIC_SHOW_PLACEHOLDER_REVIEWS=true` renders three layout placeholders,
each with a visible **SAMPLE** chip and a banner above the row. **Keep this
false in production.** With no reviews and the flag off, the section says plainly
that reviews haven't been collected yet.

## Claims

Copy is cosmetic throughout — *hydrates*, *helps skin look smoother*,
*dewy-looking*. No medical claims, no guaranteed results, no invented review
counts, no fabricated discounts. Please keep it that way when editing.

---

## Mobile

Designed at 390 × 844 first; desktop is the enhanced version.

- Product visible immediately; the price sits above the fold on a 390px phone.
- Sticky purchase bar appears after the visitor scrolls and the hero CTA leaves
  the screen — and hides while the cart drawer is open.
- `env(safe-area-inset-bottom)` respected on the sticky bar and drawer.
- No horizontal overflow at any width (verified at 320, 390 and 1440).

## Accessibility

Semantic landmarks and one `h1`; keyboard-operable controls; the cart drawer
traps focus, closes on `Escape` and restores scroll; visible focus rings; 36px+
tap targets; `aria-live` on the quantity; the countdown carries a spoken label
but does not announce every second; all animation disabled under
`prefers-reduced-motion`. Shopify alt text that is a content hash is discarded
in favour of a real description.

## Structure

```
src/
  app/          layout, page, globals.css, api/checkout, api/shopify-status
  components/   AnnouncementBar, BrandHeader, Hero, ProductGallery,
                PurchasePanel, Countdown, QuantityStepper, Experience,
                SocialProof, FinalCta, StickyBar, CartDrawer, Reveal,
                ProductArt, Icons
  lib/          shopify-admin.ts (live product) · product-source.ts (live over
                local) · cart.tsx (cart + checkout) · shopify.ts (permalink)
  data/         product.ts, offer.ts, media.ts, reviews.ts   ← what you edit
```

## Deploying

The Vercel project is linked to this repository, so every push to the production
branch deploys automatically. Set `SHOPIFY_STORE_DOMAIN` and
`SHOPIFY_ADMIN_TOKEN` for the Production environment in Vercel.
