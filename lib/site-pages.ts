// The site's own pages (not the legal ones): add every page you create here, so the sitemap lists exactly the
// visible pages. /menu is the online shop's, never a page of the site.
import { seoPaths } from "./seo-pages"

export const SITE_PAGES: readonly string[] = ["/"]

/**
 * The paths search engines may index, i.e. the sitemap: the site's pages and the SEO pages. The legal pages are
 * noindex and never in the sitemap.
 */
export function indexedPaths(language: string): string[] {
  return [...SITE_PAGES, ...seoPaths(language)]
}
