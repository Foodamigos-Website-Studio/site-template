import { describe, expect, it } from "vitest"

import { menuRoute } from "@/lib/menu-route"

const base = {
  pathname: "/menu/checkout",
  search: "?x=1",
  embedOrigin: "https://www.foodamigos-storefront-online-shop.com",
  onlineShopUrl: "https://shop.example.com/trattoria",
  language: "de",
}

describe("menuRoute", () => {
  it("embeds the shop on the custom domain, keeping /menu and setting the storefront cookies", () => {
    expect(menuRoute({ ...base, host: "www.trattoria-bella.de", shopOn: true, embedDomain: "trattoria-bella.de" })).toEqual({
      kind: "rewrite",
      url: "https://www.foodamigos-storefront-online-shop.com/menu/checkout?x=1",
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
})
