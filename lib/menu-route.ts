// /menu belongs to the online shop (when the module is on). On the custom domain the storefront build is embedded
// under /menu; elsewhere (previews, Vercel URLs) /menu redirects to the standalone shop.

export type MenuRoute =
  | { kind: "next" }
  | { kind: "rewrite"; url: string; cookies: Record<string, string> }
  | { kind: "redirect"; url: string }

export function menuRoute(input: {
  host: string
  pathname: string
  search: string
  shopOn: boolean
  embedDomain: string
  embedOrigin: string
  onlineShopUrl: string | null
  /** The language the visitor reads the site in (the DE/EN switch), which the shop opens in. */
  language: string
  /** The site's own language (the language when there is no choice); the standalone shop always gets ?lng={language}. */
  siteLanguage?: string
}): MenuRoute {
  if (!input.shopOn) return { kind: "next" }
  const host = input.host.toLowerCase().replace(/^www\./, "").replace(/:\d+$/, "")
  if (input.embedDomain && host === input.embedDomain.toLowerCase().replace(/^www\./, "")) {
    return {
      kind: "rewrite",
      url: `${input.embedOrigin.replace(/\/+$/, "")}${input.pathname}${input.search}`,
      cookies: { storefront_base_path: "/menu", storefront_locale: input.language },
    }
  }
  if (!input.onlineShopUrl) return { kind: "next" }
  const rest = input.pathname.replace(/^\/menu/, "")
  // WT.QF0.2: the standalone shop has no /{language} pages (it reads "/en" as a company and shows its 404); it takes
  // the visitor's language from ?lng=. Always sent, the site's own language too: without it the shop opens in the
  // restaurant's language, which can differ from the site's, and a past ?lng= would stick. The visitor's own query
  // goes along as it came (appended to, never rebuilt); a lng it already carries is left alone.
  const search = /(?:^\?|&)lng=/.test(input.search) ? input.search : `${input.search}${input.search ? "&" : "?"}lng=${encodeURIComponent(input.language)}`
  return { kind: "redirect", url: `${input.onlineShopUrl.replace(/\/+$/, "")}${rest}${search}` }
}
