// TP.8: the site template's version is package.json's "version", read through one constant. TP.9 defaults
// SEO_PAGES_MIN_TEMPLATE_VERSION to 0.2.0 and TP.5 reads package.json's version at build time.
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { SITE_TEMPLATE_VERSION } from "@/lib/template-version"

const packageVersion = JSON.parse(readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8")).version as string

function parts(version: string): number[] {
  return version.split(".").map(Number)
}

function atLeast(version: string, minimum: string): boolean {
  const [a, b] = [parts(version), parts(minimum)]
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]
  return true
}

describe("SITE_TEMPLATE_VERSION", () => {
  it("is package.json's version, the one value a build reads", () => {
    expect(SITE_TEMPLATE_VERSION).toBe(packageVersion)
  })

  it("is x.y.z, with no v", () => {
    expect(SITE_TEMPLATE_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it("is at least 0.2.0, the first version with the dish pages and the home FAQ (TP.9's default minimum)", () => {
    expect(atLeast(SITE_TEMPLATE_VERSION, "0.2.0")).toBe(true)
    expect(atLeast("0.1.9", "0.2.0")).toBe(false)
    expect(atLeast("0.10.0", "0.2.0")).toBe(true)
  })
})
