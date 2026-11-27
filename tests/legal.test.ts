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

describe("the legal pages' default layout (ticket 1220948108100971)", () => {
  const blocks = readFileSync(join(import.meta.dirname, "..", "components/legal/legal-blocks.tsx"), "utf8")

  it("is a centred column with side padding and top spacing clear of a fixed header", () => {
    expect(blocks).toContain('data-slot="legal-page"')
    expect(blocks).toContain("mx-auto w-full max-w-3xl px-5")
    expect(blocks).toContain("pt-[var(--legal-page-top,7rem)]")
    expect(blocks).toContain("sm:px-8")
  })

  it("keeps the site's fonts and colours: no font family, text or background colour of its own", () => {
    expect(blocks).not.toMatch(/\bfont-(?:sans|serif|mono)\b/)
    expect(blocks).not.toMatch(/\b(?:text|bg)-(?:black|white|gray|neutral|zinc|slate|stone|\[#)/)
  })

  it("keeps every block type, and links stay visible and long values wrap", () => {
    for (const type of ["paragraph", "subheading", "list", "definition_list", "table", "link"])
      expect(blocks).toContain(`case "${type}":`)
    expect(blocks).toContain("[&_a]:underline")
    expect(blocks).toContain("[overflow-wrap:anywhere]")
    expect(blocks).toContain('<div className="mb-6 overflow-x-auto">')
  })
})
