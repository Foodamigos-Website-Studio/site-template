import type { MetadataRoute } from "next"

import { SITE_LANGUAGE } from "@/lib/config"
import { giftCardsOn, reservationsOn } from "@/lib/modules"
import { getSiteUrl } from "@/lib/seo"
import { sitemapPaths } from "@/lib/site-pages"
import { getCompanies, getPageMeta, getProject } from "@/lib/studio-api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [origin, project, companies, entries] = await Promise.all([getSiteUrl(), getProject(), getCompanies(), getPageMeta()])
  const paths = sitemapPaths(SITE_LANGUAGE, {
    locations: Boolean(companies?.length),
    reservations: reservationsOn(project),
    giftCards: giftCardsOn(project),
  }, entries)
  return paths.map((path) => ({ url: `${origin}${path}`, lastModified: new Date() }))
}
