import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(join(import.meta.dirname, "..", path), "utf8")

describe("the page loading bar", () => {
  it("is in the root layout on every page, before the header", () => {
    const layout = read("app/layout.tsx")
    expect(layout).toContain('import { PageLoader } from "@/components/site/page-loader"')
    expect(layout.indexOf("<PageLoader />")).toBeGreaterThan(layout.indexOf("<body>"))
    expect(layout.indexOf("<PageLoader />")).toBeLessThan(layout.indexOf("<SiteHeader />"))
  })

  it("takes the site's accent colour, with no spinner, from a pinned nextjs-toploader", () => {
    const loader = read("components/site/page-loader.tsx")
    expect(loader).toContain('color="var(--site-accent, #1f1f1f)"')
    expect(loader).toContain("showSpinner={false}")
    expect(JSON.parse(read("package.json")).dependencies["nextjs-toploader"]).toBe("3.9.17")
  })
})
