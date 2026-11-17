import { describe, expect, it } from "vitest"

import { menuRoute } from "@/lib/menu-route"

const base = {
  pathname: "/menu/checkout",
  search: "?x=1",
  embedOrigin: "https://www.foodamigos-storefront-online-shop.com",
  onlineShopUrl: "https://shop.example.com/trattoria",
  language: "de",
  googleMapsApiKey: null,
}

const embedded = { ...base, host: "www.trattoria-bella.de", shopOn: true, embedDomain: "trattoria-bella.de" }
const rewriteUrl = "https://www.foodamigos-storefront-online-shop.com/menu/checkout?x=1"

describe("menuRoute", () => {
  it("embeds the shop on the custom domain, keeping /menu and setting the storefront cookies", () => {
    expect(menuRoute(embedded)).toEqual({
      kind: "rewrite",
      url: rewriteUrl,
      cookies: { storefront_base_path: "/menu", storefront_locale: "de" },
    })
  })

  it("redirects to the standalone shop on previews, and lets /menu through without a shop", () => {
    expect(menuRoute({ ...base, host: "site.vercel.app", shopOn: true, embedDomain: "trattoria-bella.de" })).toEqual({
      kind: "redirect",
      url: "https://shop.example.com/trattoria/checkout?x=1",
    })
    expect(menuRoute({ ...base, host: "site.vercel.app", shopOn: true, embedDomain: "", onlineShopUrl: null })).toEqual({ kind: "next" })
  })

  it("does nothing when the manager switched the online shop off", () => {
    expect(menuRoute({ ...base, host: "www.trattoria-bella.de", shopOn: false, embedDomain: "trattoria-bella.de" })).toEqual({ kind: "next" })
  })

  describe("the project's Google Maps key", () => {
    it("is passed to the embedded shop as a cookie when the project has one", () => {
      expect(menuRoute({ ...embedded, googleMapsApiKey: "AIza-project-key" })).toEqual({
        kind: "rewrite",
        url: rewriteUrl,
        cookies: {
          storefront_base_path: "/menu",
          storefront_locale: "de",
          storefront_google_maps_api_key_v1: "AIza-project-key",
        },
      })
    })

    it("sets no key cookie when the project has no key or an empty one", () => {
      for (const googleMapsApiKey of [null, ""]) {
        const route = menuRoute({ ...embedded, googleMapsApiKey })
        expect(route).toEqual({ kind: "rewrite", url: rewriteUrl, cookies: { storefront_base_path: "/menu", storefront_locale: "de" } })
      }
    })

    it("is set on the custom domain with or without www. and with a port", () => {
      for (const host of ["trattoria-bella.de", "www.trattoria-bella.de", "trattoria-bella.de:3000", "WWW.Trattoria-Bella.de:443"]) {
        const route = menuRoute({ ...embedded, host, googleMapsApiKey: "AIza-project-key" })
        expect(route.kind).toBe("rewrite")
        expect(route.kind === "rewrite" && route.cookies.storefront_google_maps_api_key_v1).toBe("AIza-project-key")
      }
    })

    it("is not set on a preview, which still redirects with no cookies", () => {
      expect(menuRoute({ ...embedded, host: "site.vercel.app", googleMapsApiKey: "AIza-project-key" })).toEqual({
        kind: "redirect",
        url: "https://shop.example.com/trattoria/checkout?x=1",
      })
    })

    it("is not set when the online shop is off", () => {
      expect(menuRoute({ ...embedded, shopOn: false, googleMapsApiKey: "AIza-project-key" })).toEqual({ kind: "next" })
    })
  })
})
