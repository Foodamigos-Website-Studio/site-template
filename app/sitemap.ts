import type { MetadataRoute } from "next"

import { SITE_LANGUAGE } from "@/lib/config"
import { getSiteUrl } from "@/lib/seo"
import { indexedPaths } from "@/lib/site-pages"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteUrl()
  return indexedPaths(SITE_LANGUAGE).map((path) => ({ url: `${origin}${path}`, lastModified: new Date() }))
}
