import type { MetadataRoute } from "next"

import { SITE_LANGUAGE } from "@/lib/config"
import { legalPaths } from "@/lib/legal"
import { getSiteUrl } from "@/lib/seo"
import { SITE_PAGES } from "@/lib/site-pages"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteUrl()
  return [...SITE_PAGES, ...legalPaths(SITE_LANGUAGE)].map((path) => ({ url: `${origin}${path}`, lastModified: new Date() }))
}
