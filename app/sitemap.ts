import type { MetadataRoute } from "next"

import { SITE_LANGUAGE } from "@/lib/config"
import { giftCardsOn, reservationsOn } from "@/lib/modules"
import { getSiteUrl } from "@/lib/seo"
import { sitemapPaths } from "@/lib/site-pages"
import { getCompanies, getMenu, getPageMeta, getProject } from "@/lib/studio-api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [origin, project, menu, companies, entries] = await Promise.all([getSiteUrl(), getProject(), getMenu(), getCompanies(), getPageMeta()])
  const paths = sitemapPaths(SITE_LANGUAGE, {
    menu: Boolean(menu?.companies.some((company) => company.menus.some((group) => group.categories.length > 0))),
    locations: Boolean(companies?.length),
    reservations: reservationsOn(project),
    giftCards: giftCardsOn(project),
  }, entries)
  return paths.map((path) => ({ url: `${origin}${path}`, lastModified: new Date() }))
}
