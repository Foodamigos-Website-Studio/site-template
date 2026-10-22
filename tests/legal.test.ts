import { describe, expect, it } from "vitest"

import { legalPaths, legalSlug } from "@/lib/legal"
import { indexedPaths } from "@/lib/site-pages"

describe("legal paths", () => {
  it("names the pages in the site's language, as the site API does", () => {
    expect(legalPaths("de")).toEqual(["/impressum", "/datenschutzerklaerung", "/cookie-richtlinie"])
    expect(legalPaths("en")).toEqual(["/impressum", "/privacy-policy", "/cookie-policy"])
    expect(legalSlug("privacy-policy", "fr")).toBe("/privacy-policy")
  })

  it("keeps the legal pages out of the sitemap: only the site's pages and the SEO pages are indexed", () => {
    expect(indexedPaths("de")).toEqual(["/", "/angebote"])
    expect(indexedPaths("en")).toEqual(["/", "/coupons"])
    for (const path of legalPaths("de")) expect(indexedPaths("de")).not.toContain(path)
  })
})
