// /menu belongs to the online shop (when the module is on). On the custom domain the storefront build is embedded
// under /menu; elsewhere (previews, Vercel URLs) /menu redirects to the standalone shop. The embedded shop also gets
// the project's Google Maps key (storefront_google_maps_api_key_v1), which Google accepts on the restaurant's domain;
// without it the shop falls back to its global key, which Google refuses there.

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
    const cookies: Record<string, string> = { storefront_base_path: "/menu", storefront_locale: input.language }
    if (input.googleMapsApiKey) cookies.storefront_google_maps_api_key_v1 = input.googleMapsApiKey
    return {
      kind: "rewrite",
      url: `${input.embedOrigin.replace(/\/+$/, "")}${input.pathname}${input.search}`,
      cookies,
    }
  }
  if (!input.onlineShopUrl) return { kind: "next" }
  const rest = input.pathname.replace(/^\/menu/, "")
  return { kind: "redirect", url: `${input.onlineShopUrl.replace(/\/+$/, "")}${rest}${input.search}` }
}
