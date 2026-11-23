import { describe, expect, it } from "vitest"

import { menuNavItem, siteNavigation } from "@/lib/navigation"
import type { Project } from "@/lib/studio-api"

const project = (overrides: Partial<Project> = {}) =>
  ({ has_online_shop: true, online_shop_url: "https://trattoria.foodamigos.io", ...overrides }) as Project

describe("navigation (ML.2)", () => {
  it("links the menu item to the shop under /menu, labelled in the site's language", () => {
    expect(menuNavItem("de")).toEqual({ label: "Speisekarte", href: "/menu" })
    expect(menuNavItem("en")).toEqual({ label: "Menu", href: "/menu" })
    expect(menuNavItem("pl")).toEqual({ label: "Menu", href: "/menu" })
    expect(siteNavigation("de", project())).toEqual([{ label: "Speisekarte", href: "/menu" }])
  })

  it("has no menu item without the online shop", () => {
    expect(siteNavigation("de", project({ has_online_shop: false }))).toEqual([])
    expect(siteNavigation("de", project({ online_shop_url: null }))).toEqual([])
    expect(siteNavigation("de", null)).toEqual([])
  })
})
