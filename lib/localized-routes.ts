// Pages live in one folder each, under their English path (app/privacy-policy, app/cookie-policy, app/coupons, …);
// the site shows them under the path in its language, as the site API names them. proxy.ts rewrites the localized path
// onto the folder and redirects the folder's own path to the localized one, so every page has one URL per site.

export type LocalizedPage =
  | "impressum"
  | "privacy-policy"
  | "cookie-policy"
  | "coupons"
  | "our-menu"
  | "reservations"
  | "gift-cards"
  | "location-and-hours"

/** The folder (English path) and the paths in other languages. */
const ROUTES: Record<LocalizedPage, { folder: string; localized: Record<string, string> }> = {
  impressum: { folder: "/impressum", localized: {} },
  "privacy-policy": { folder: "/privacy-policy", localized: { de: "/datenschutzerklaerung" } },
  "cookie-policy": { folder: "/cookie-policy", localized: { de: "/cookie-richtlinie" } },
  coupons: { folder: "/coupons", localized: { de: "/angebote" } },
  // /menu is the online shop's: the site's own menu is /our-menu (/speisekarte on a German site).
  "our-menu": { folder: "/our-menu", localized: { de: "/speisekarte" } },
  reservations: { folder: "/reservations", localized: { de: "/reservierungen" } },
  "gift-cards": { folder: "/gift-cards", localized: { de: "/gutscheine" } },
  "location-and-hours": { folder: "/location-and-hours", localized: { de: "/standort-und-oeffnungszeiten" } },
}

/** The page's path on the site, e.g. /datenschutzerklaerung on a German site. */
export function localizedPath(page: LocalizedPage, language: string): string {
  const route = ROUTES[page]
  return route.localized[language] ?? route.folder
}

export type LocalizedRoute = { kind: "next" } | { kind: "rewrite"; path: string } | { kind: "redirect"; path: string }

/** What the proxy does with a request's path on a site in this language. */
export function localizedRoute(pathname: string, language: string): LocalizedRoute {
  for (const route of Object.values(ROUTES)) {
    const own = route.localized[language] ?? route.folder
    if (own === route.folder) continue
    if (pathname === own) return { kind: "rewrite", path: route.folder }
    if (pathname === route.folder) return { kind: "redirect", path: own }
  }
  return { kind: "next" }
}

/** Every path the proxy handles, localized or not (its matcher). */
export const LOCALIZED_MATCHER = [
  ...new Set(Object.values(ROUTES).flatMap((route) => [route.folder, ...Object.values(route.localized)])),
]
