import { readFileSync } from "node:fs"
import { join } from "node:path"

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

describe("the legal pages' blocks (ticket 1220948108100971)", () => {
  // Only what a restyle must keep: generated sites run these tests in CI, and the README tells v0 to restyle this file.
  const blocks = readFileSync(join(import.meta.dirname, "..", "components/legal/legal-blocks.tsx"), "utf8")

  it("renders every block type the site API sends", () => {
    for (const type of ["paragraph", "subheading", "list", "definition_list", "table", "link"])
      expect(blocks).toContain(`case "${type}":`)
  })
})
