# Gilroy

Gilroy is a commercial typeface from Fontfabric and is **not** included in this
repository. Buy a webfont licence, then drop the `.woff2` files here using these
exact filenames:

```
Gilroy-Regular.woff2    (400)
Gilroy-Medium.woff2     (500)
Gilroy-SemiBold.woff2   (600)
Gilroy-Bold.woff2       (700)
```

2. Uncomment the `@font-face` block at the top of `src/app/globals.css`. It is
   commented out by default so the site doesn't request four fonts that aren't
   there — those requests 404 on every page load until the files exist.

That's it. The font stack already lists `Gilroy` first, so the next build picks
it up everywhere.

Until the files are present every rule falls through to **Outfit** (loaded via
`next/font` in `src/app/layout.tsx`), the closest free geometric sans, so the
layout and proportions hold either way.
