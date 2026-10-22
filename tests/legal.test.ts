import { describe, expect, it } from "vitest"

import { legalPaths, legalSlug } from "@/lib/legal"

describe("legal paths", () => {
  it("names the pages in the site's language, as the site API does", () => {
    expect(legalPaths("de")).toEqual(["/impressum", "/datenschutzerklaerung", "/cookie-richtlinie"])
    expect(legalPaths("en")).toEqual(["/impressum", "/privacy-policy", "/cookie-policy"])
    expect(legalSlug("privacy-policy", "fr")).toBe("/privacy-policy")
  })
})
