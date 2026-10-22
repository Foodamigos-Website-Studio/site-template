import type { MetadataRoute } from "next"

import { SITE_LANGUAGE } from "@/lib/config"
import { giftCardsOn, reservationsOn } from "@/lib/modules"
import { getSiteUrl } from "@/lib/seo"
import { indexedPaths } from "@/lib/site-pages"
import { getCompanies, getMenu, getProject } from "@/lib/studio-api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [origin, project, menu, companies] = await Promise.all([getSiteUrl(), getProject(), getMenu(), getCompanies()])
  const paths = indexedPaths(SITE_LANGUAGE, {
    menu: Boolean(menu?.companies.some((company) => company.menus.some((group) => group.categories.length > 0))),
    locations: Boolean(companies?.length),
    reservations: reservationsOn(project),
    giftCards: giftCardsOn(project),
  })
  return paths.map((path) => ({ url: `${origin}${path}`, lastModified: new Date() }))
}
