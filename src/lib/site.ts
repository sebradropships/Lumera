/**
 * The origin every canonical, og:url and sitemap entry resolves against.
 *
 * A wrong value here is worse than none. A canonical naming a domain the site
 * is not served from tells search engines to credit THAT domain and drop this
 * one — so it must be a domain we actually own, never a placeholder.
 *
 * It is also deliberately not Vercel's generated *.vercel.app host: that host
 * serves the same page, so letting it name itself canonical would split
 * indexing between the preview URL and the real domain instead of
 * consolidating on one.
 *
 * Override with NEXT_PUBLIC_SITE_URL if the domain ever changes. Note that the
 * page is statically prerendered, so this is read at BUILD time — changing the
 * variable in Vercel requires a redeploy, not just a restart.
 */
/**
 * The `www` host, not the apex. `hoygi.xyz` answers 308 and redirects here, so an
 * apex canonical names a URL that does not serve the page — pointing the canonical
 * at a redirect rather than at the document it describes.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.hoygi.xyz";
