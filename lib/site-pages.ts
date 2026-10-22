// The site's own pages (not the legal ones): add every page you create here, so the sitemap lists exactly the
// visible pages. /menu is the online shop's, never a page of the site.
import { localizedPath } from "./localized-routes"
import { seoPaths } from "./seo-pages"

export const SITE_PAGES: readonly string[] = ["/"]

/** Which of the template's module pages the site shows (lib/modules.ts and the site API's data). */
export type ModulePages = { menu: boolean; locations: boolean; reservations: boolean; giftCards: boolean }

/**
 * The paths search engines may index, i.e. the sitemap: the site's pages, the module pages it shows and the SEO
 * pages. The legal pages are noindex and never in the sitemap.
 */
export function indexedPaths(language: string, modules: ModulePages = { menu: false, locations: false, reservations: false, giftCards: false }): string[] {
  return [
    ...SITE_PAGES,
    ...(modules.menu ? [localizedPath("our-menu", language)] : []),
    ...(modules.locations ? [localizedPath("location-and-hours", language)] : []),
    ...(modules.reservations ? [localizedPath("reservations", language)] : []),
    ...(modules.giftCards ? [localizedPath("gift-cards", language)] : []),
    ...seoPaths(language),
  ]
}
