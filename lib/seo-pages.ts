// Pages the site has only to be found and indexed, as on the storefront: not in the navigation, but in the sitemap.
// Their texts come from the site API (GET /seo-pages/{page}) in the site's language: the restaurant's own (Max writes
// them in the SEO optimization) or the defaults.
import { localizedPath } from "./localized-routes"

export type SeoPageKey = "coupons"

export const SEO_PAGES: readonly SeoPageKey[] = ["coupons"]

export function seoPaths(language: string): string[] {
  return SEO_PAGES.map((page) => localizedPath(page, language))
}
