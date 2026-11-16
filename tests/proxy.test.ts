import { NextRequest } from "next/server"
import { describe, expect, it, vi } from "vitest"

import { proxy } from "@/proxy"

vi.mock("@/lib/config", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/config")>()),
  hasModule: (module: string) => module === "online_shop",
  ONLINE_SHOP_EMBED_DOMAIN: "trattoria.de",
  ONLINE_SHOP_EMBED_ORIGIN: "https://embed.test",
  SITE_LANGUAGE: "de",
}))
vi.mock("@/lib/studio-api", () => ({ getProject: async () => ({ online_shop_url: "https://bestellen.trattoria.de" }) }))

function menu(url: string, { cookie }: { cookie?: string } = {}) {
  const request = new NextRequest(url, { headers: { host: new URL(url).host, ...(cookie ? { cookie: `site_language=${cookie}` } : {}) } })
  return proxy(request)
}

// WT.QF0.5: v0's preview proxy drops the Cookie header, so /menu reads the visitor's choice from ?lng= on the link first.
describe("/menu's language: ?lng= on the request, else the cookie, else the site's", () => {
  it("opens the standalone shop in the ?lng= of the link, over the cookie", async () => {
    const response = await menu("https://preview.vercel.app/menu?lng=en", { cookie: "de" })
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe("https://bestellen.trattoria.de/?lng=en")
  })

  it("falls back to the cookie, then the site's language", async () => {
    expect((await menu("https://preview.vercel.app/menu/checkout?x=1", { cookie: "en" })).headers.get("location")).toBe("https://bestellen.trattoria.de/checkout?x=1&lng=en")
    expect((await menu("https://preview.vercel.app/menu/checkout?x=1")).headers.get("location")).toBe("https://bestellen.trattoria.de/checkout?x=1&lng=de")
  })

  it("gives the embedded shop the same choice as storefront_locale, an invalid ?lng= falling back", async () => {
    const chosen = await menu("https://trattoria.de/menu/checkout?x=1&lng=en", { cookie: "de" })
    expect(chosen.headers.get("x-middleware-rewrite")).toBe("https://embed.test/menu/checkout?x=1&lng=en")
    expect(chosen.cookies.get("storefront_locale")?.value).toBe("en")
    expect((await menu("https://trattoria.de/menu?lng=it", { cookie: "en" })).cookies.get("storefront_locale")?.value).toBe("en")
    expect((await menu("https://trattoria.de/menu?lng=it")).cookies.get("storefront_locale")?.value).toBe("de")
  })
})
