import { describe, expect, it } from "vitest"

import { LOCALIZED_MATCHER, localizedPath, localizedRoute } from "@/lib/localized-routes"
import { seoPaths } from "@/lib/seo-pages"
import { config } from "@/proxy"

describe("localized routes", () => {
  it("shows a German site's pages under their German paths, from the English folders", () => {
    expect(localizedRoute("/datenschutzerklaerung", "de")).toEqual({ kind: "rewrite", path: "/privacy-policy" })
    expect(localizedRoute("/angebote", "de")).toEqual({ kind: "rewrite", path: "/coupons" })
    expect(localizedRoute("/privacy-policy", "de")).toEqual({ kind: "redirect", path: "/datenschutzerklaerung" })
    expect(localizedRoute("/impressum", "de")).toEqual({ kind: "next" })
  })

  it("leaves an English (or any other) site on the folder paths", () => {
    expect(localizedRoute("/privacy-policy", "en")).toEqual({ kind: "next" })
    expect(localizedRoute("/datenschutzerklaerung", "en")).toEqual({ kind: "next" })
    expect(localizedPath("cookie-policy", "fr")).toBe("/cookie-policy")
    expect(seoPaths("de")).toEqual(["/angebote"])
  })

  it("matches every localized path in the proxy", () => {
    for (const path of LOCALIZED_MATCHER) expect(config.matcher).toContain(path)
  })
})
