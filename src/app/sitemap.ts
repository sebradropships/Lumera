import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** One page, one entry — the landing page is the whole site. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
