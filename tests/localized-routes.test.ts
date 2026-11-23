import { existsSync } from "node:fs"
import { join } from "node:path"

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

  it("has no menu page of its own: /our-menu and /speisekarte are not routes, the menu is the shop under /menu (ML.2)", () => {
    expect(localizedRoute("/speisekarte", "de")).toEqual({ kind: "next" })
    expect(localizedRoute("/our-menu", "de")).toEqual({ kind: "next" })
    expect(LOCALIZED_MATCHER).not.toContain("/our-menu")
    expect(LOCALIZED_MATCHER).not.toContain("/speisekarte")
    expect(config.matcher).not.toContain("/our-menu")
    expect(config.matcher).not.toContain("/speisekarte")
    expect(existsSync(join(process.cwd(), "app/our-menu"))).toBe(false)
  })

  it("matches every localized path in the proxy", () => {
    for (const path of LOCALIZED_MATCHER) expect(config.matcher).toContain(path)
  })
})
