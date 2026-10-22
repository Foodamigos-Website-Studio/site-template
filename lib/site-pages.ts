// The sitemap: the template's pages the site shows, plus every page Website Studio knows (GET /page-meta, one entry per
// page, written by Max when a page is added and removed when it is deleted). /menu is the online shop's, never a page
// of the site; legal pages are noindex and never in the sitemap.
import { localizedPath } from "./localized-routes"
import { ROUTES } from "./routes"
import type { PageMetaEntry } from "./studio-api"
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
    ...(modules.locations ? [ROUTES.locations] : []),
    ...(modules.reservations ? [localizedPath("reservations", language)] : []),
    ...(modules.giftCards ? [localizedPath("gift-cards", language)] : []),
    ...seoPaths(language),
  ]
}

/**
 * Every path for the sitemap: indexedPaths plus the pages registered in Website Studio without noindex (pages v0 added),
 * never a module page whose module is off.
 */
export function sitemapPaths(language: string, modules: ModulePages, entries: readonly PageMetaEntry[] | null): string[] {
  const off = [
    ...(modules.menu ? [] : [localizedPath("our-menu", language)]),
    ...(modules.locations ? [] : [ROUTES.locations]),
    ...(modules.reservations ? [] : [localizedPath("reservations", language)]),
    ...(modules.giftCards ? [] : [localizedPath("gift-cards", language)]),
  ]
  const registered = (entries ?? []).filter((entry) => !entry.noindex && !off.includes(entry.path)).map((entry) => entry.path)
  return [...new Set([...indexedPaths(language, modules), ...registered])]
}
