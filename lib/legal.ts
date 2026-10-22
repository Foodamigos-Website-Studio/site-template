// The legal pages' paths per language, as the site API names them (GET /legal). Each path has its own route; a page
// opened under the other language's path redirects to the site's one.
import type { LegalPageKey } from "./studio-api"

export const LEGAL_PAGES: readonly LegalPageKey[] = ["impressum", "privacy-policy", "cookie-policy"]

export function legalSlug(page: LegalPageKey, language: string): string {
  const german = language === "de"
  switch (page) {
    case "impressum":
      return "/impressum"
    case "privacy-policy":
      return german ? "/datenschutzerklaerung" : "/privacy-policy"
    case "cookie-policy":
      return german ? "/cookie-richtlinie" : "/cookie-policy"
  }
}

/** The site's legal paths, for the sitemap and the footer. */
export function legalPaths(language: string): string[] {
  return LEGAL_PAGES.map((page) => legalSlug(page, language))
}
