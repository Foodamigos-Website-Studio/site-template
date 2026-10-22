// The site's paths: /menu is the online shop's (lib/menu-route.ts), and the legal and SEO pages show under the path in
// the site's language (lib/localized-routes.ts).
import { NextResponse, type NextRequest } from "next/server"

import { hasModule, ONLINE_SHOP_EMBED_DOMAIN, ONLINE_SHOP_EMBED_ORIGIN, SITE_LANGUAGE } from "@/lib/config"
import { localizedRoute } from "@/lib/localized-routes"
import { menuRoute } from "@/lib/menu-route"
import { getProject } from "@/lib/studio-api"

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname === "/menu" || pathname.startsWith("/menu/")) {
    const shopOn = hasModule("online_shop")
    const onlineShopUrl = shopOn ? ((await getProject())?.online_shop_url ?? null) : null
    const route = menuRoute({
      host: request.headers.get("host") ?? "",
      pathname,
      search,
      shopOn,
      embedDomain: ONLINE_SHOP_EMBED_DOMAIN,
      embedOrigin: ONLINE_SHOP_EMBED_ORIGIN,
      onlineShopUrl,
      language: SITE_LANGUAGE,
    })
    if (route.kind === "redirect") return NextResponse.redirect(route.url, 307)
    if (route.kind === "rewrite") {
      const response = NextResponse.rewrite(route.url)
      for (const [name, value] of Object.entries(route.cookies)) {
        response.cookies.set(name, value, { path: "/", maxAge: 60 * 60 * 24 * 365, secure: true, sameSite: "none" })
      }
      return response
    }
    return NextResponse.next()
  }

  const localized = localizedRoute(pathname, SITE_LANGUAGE)
  if (localized.kind === "rewrite") return NextResponse.rewrite(new URL(`${localized.path}${search}`, request.url))
  if (localized.kind === "redirect") return NextResponse.redirect(new URL(`${localized.path}${search}`, request.url), 308)
  return NextResponse.next()
}

// A literal list (Next reads it at build time); tests/localized-routes.test.ts keeps it in step with the route table.
export const config = {
  matcher: [
    "/menu",
    "/menu/:path*",
    "/impressum",
    "/privacy-policy",
    "/datenschutzerklaerung",
    "/cookie-policy",
    "/cookie-richtlinie",
    "/coupons",
    "/angebote",
    "/our-menu",
    "/speisekarte",
    "/reservations",
    "/reservierungen",
    "/gift-cards",
    "/gutscheine",
    "/location-and-hours",
    "/standort-und-oeffnungszeiten",
  ],
}
