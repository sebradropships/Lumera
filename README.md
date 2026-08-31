# LUMERA

A premium, mobile-first, single-product landing page for the **Lumera Bio-Collagen Gel
Face Mask** — built as a direct-response funnel, not a Shopify template.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS.

---

## The page

Exactly three main sections, in funnel order:

| # | Section | Job |
|---|---------|-----|
| 1 | **Hero / Product / Purchase** | Gallery, headline, benefits, offer, quantity, add-to-cart, buy-now |
| 2 | **Why Lumera** | Three benefit cards + a compact three-step "How it works" |
| 3 | **Social proof + Final CTA** | Reviews (see below) and the closing offer block |

Plus a sticky brand header, a mobile purchase bar, a cart drawer, and a minimal
legal footer. No about page, no blog, no FAQ, no newsletter block.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Shopify details
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

---

## Connecting Shopify

Checkout has two paths and falls back automatically.

**1. Cart permalink — no API app needed.** Set your store domain and the numeric
variant IDs, and every CTA opens a real Shopify checkout:

```bash
# .env.local
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
```

```ts
// src/data/product.ts
{ id: "single", title: "1 Mask", price: 3900, shopifyVariantId: "45123456789012" }
```

**2. Storefront API — preferred.** Adds a real Shopify cart via `POST /api/checkout`.
In Shopify admin: *Settings → Apps and sales channels → Develop apps →* create an app,
enable Storefront API access with `unauthenticated_write_checkouts`, then:

```bash
SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
```

```ts
// src/data/product.ts
{ …, shopifyVariantGid: "gid://shopify/ProductVariant/45123456789012" }
```

Until either is configured the cart works locally and the drawer says checkout
isn't connected yet, rather than sending shoppers to a dead link.

### Where to find your variant IDs

Shopify admin → the product → click a variant. The URL ends in
`/variants/45123456789012` — that number is `shopifyVariantId`, and
`gid://shopify/ProductVariant/45123456789012` is `shopifyVariantGid`.

---

## What you need to replace before launch

Three placeholders are deliberate. Each is isolated in one file.

### 1. Pricing — `src/data/product.ts`

`$39` (was `$65`, 40% off) and the 3-pack are stand-ins. Set `price` and
`compareAtPrice` in **cents**. The savings badges, the sticky bar and the final
offer all recompute from these — no other file to touch.

### 2. Product photography — `src/data/media.ts`

No photography was supplied, so the page renders hand-drawn SVG art panels
(`src/components/ProductArt.tsx`) — deliberately illustrative rather than a fake
photo of a product that hasn't been shot. Drop files in `public/product/` or paste
Shopify CDN URLs into `gallery`, and the SVGs are replaced automatically:

```ts
export const gallery: ProductImage[] = [
  { src: "/product/lumera-jar.jpg", alt: "Lumera Bio-Collagen Gel Face Mask jar" },
];
```

Shoot at 4:5 (1200×1500). `cdn.shopify.com` is already allow-listed in
`next.config.ts`. Images are lazy-loaded and served as AVIF/WebP; only the first
gallery frame is eager.

### 3. Reviews — `src/data/reviews.ts`

`reviews` is **empty on purpose** — inventing customers would be fabricated social
proof. Add real ones there and section 3 uses them automatically.

`NEXT_PUBLIC_SHOW_PLACEHOLDER_REVIEWS=true` renders three layout placeholders,
each with a visible **SAMPLE** chip and a banner above the row. **Set this to
`false` in production.** With no reviews and the flag off, the section states
plainly that reviews haven't been collected yet.

---

## Claims

Copy is cosmetic throughout — *hydrates*, *helps skin look smoother*, *dewy-looking*.
No medical claims, no guaranteed results, no "clinically proven", no invented review
counts, no resetting countdown timers. The only urgency is the launch price, which is
real because you set it. Please keep it that way when editing.

---

## Mobile

Designed at 390 × 844 first; desktop is the enhanced version.

- Product visible immediately; the price sits above the fold on a 390px phone.
- Sticky purchase bar appears after the visitor scrolls and the hero CTA leaves the
  screen — and hides while the cart drawer is open, so it never covers checkout.
- `env(safe-area-inset-bottom)` respected on the sticky bar and drawer.
- No horizontal overflow at any width (verified at 390 and 1440).
- ~117 kB First Load JS, no client-side data fetching on first paint.

## Accessibility

Semantic landmarks and one `h1`; keyboard-operable controls throughout; the cart
drawer traps focus, closes on `Escape` and restores scroll; visible gold focus
rings; `aria-live` on the quantity value; all animation disabled under
`prefers-reduced-motion`.

## Structure

```
src/
  app/          layout (fonts, metadata, JSON-LD), page, globals.css, api/checkout
  components/   BrandHeader, Hero, ProductGallery, PurchasePanel, QuantityStepper,
                Experience, SocialProof, FinalCta, StickyBar, CartDrawer, Reveal,
                ProductArt, Icons
  lib/          cart.tsx (cart state + checkout), shopify.ts (Storefront API + permalink)
  data/         product.ts, media.ts, reviews.ts   ← everything you edit lives here
```
