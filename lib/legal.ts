// The legal pages and their paths in the site's language (lib/localized-routes.ts).
import { localizedPath } from "./localized-routes"
import type { LegalPageKey } from "./studio-api"

export const LEGAL_PAGES: readonly LegalPageKey[] = ["impressum", "privacy-policy", "cookie-policy"]

export function legalSlug(page: LegalPageKey, language: string): string {
  return localizedPath(page, language)
}

/** The site's legal paths (noindex: never in the sitemap). */
export function legalPaths(language: string): string[] {
  return LEGAL_PAGES.map((page) => legalSlug(page, language))
}
