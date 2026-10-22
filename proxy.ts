// /menu is the online shop's (lib/menu-route.ts): embedded on the custom domain, a redirect elsewhere.
import { NextResponse, type NextRequest } from "next/server"

import { hasModule, ONLINE_SHOP_EMBED_DOMAIN, ONLINE_SHOP_EMBED_ORIGIN, SITE_LANGUAGE } from "@/lib/config"
import { menuRoute } from "@/lib/menu-route"
import { getProject } from "@/lib/studio-api"

export async function proxy(request: NextRequest) {
  const shopOn = hasModule("online_shop")
  const onlineShopUrl = shopOn ? ((await getProject())?.online_shop_url ?? null) : null
  const route = menuRoute({
    host: request.headers.get("host") ?? "",
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
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

export const config = { matcher: ["/menu", "/menu/:path*"] }
