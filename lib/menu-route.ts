// /menu belongs to the online shop (when the module is on). On the custom domain the storefront build is embedded
// under /menu; elsewhere (previews, Vercel URLs) /menu redirects to the standalone shop.
// The embedded shop reads its settings from storefront_* cookies; storefront_google_maps_api_key_v1 hands it the
// project's Google key (allowed on the custom domain), so the shop's address search and maps work under /menu.

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
  language: string
  googleMapsApiKey: string | null
}): MenuRoute {
  if (!input.shopOn) return { kind: "next" }
  const host = input.host.toLowerCase().replace(/^www\./, "").replace(/:\d+$/, "")
  if (input.embedDomain && host === input.embedDomain.toLowerCase().replace(/^www\./, "")) {
    return {
      kind: "rewrite",
      url: `${input.embedOrigin.replace(/\/+$/, "")}${input.pathname}${input.search}`,
      cookies: {
        storefront_base_path: "/menu",
        storefront_locale: input.language,
        ...(input.googleMapsApiKey ? { storefront_google_maps_api_key_v1: input.googleMapsApiKey } : {}),
      },
    }
  }
  if (!input.onlineShopUrl) return { kind: "next" }
  const rest = input.pathname.replace(/^\/menu/, "")
  return { kind: "redirect", url: `${input.onlineShopUrl.replace(/\/+$/, "")}${rest}${input.search}` }
}
