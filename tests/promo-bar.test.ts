import { readFileSync } from "node:fs"
import { join } from "node:path"

import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { PromoBarView } from "@/components/site/promo-bar-view"
import { dismissPromoBar, PROMO_BAR_DISMISSED_KEY, promoBarCodes, promoBarDismissed, promoBarTexts } from "@/lib/promo-bar"
import type { Project, PromoCode } from "@/lib/studio-api"

const read = (path: string) => readFileSync(join(import.meta.dirname, "..", path), "utf8")

const shop = { has_online_shop: true, online_shop_url: "https://trattoria.order.example" } as Project
const codes: PromoCode[] = [
  { code: "SOMMER10", text: "10 % Rabatt ab 20 €" },
  { code: "FREI", text: "Gratis Dessert" },
]

function memoryStore(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  }
}

const render = (list: PromoCode[], language = "de") =>
  renderToStaticMarkup(createElement(PromoBarView, { codes: list, texts: promoBarTexts(language) }))

describe("the promo bar (F-PB)", () => {
  it("shows every code with its text, each linking to the online shop at /menu, and a close button", () => {
    const html = render(codes)
    expect(html).toContain('data-slot="promo-bar"')
    expect(html).toContain("<strong>SOMMER10</strong>")
    expect(html).toContain("10 % Rabatt ab 20 €")
    expect(html).toContain("<strong>FREI</strong>")
    expect(html.match(/href="\/menu"/g)).toHaveLength(2)
    expect(html).toContain('aria-label="Schließen"')
    expect(html).toContain("Aktionscode:")
  })

  it("renders nothing without codes", () => {
    expect(render([])).toBe("")
  })

  it("keeps only real codes, and none while the online shop is off or the API failed", () => {
    // The template's default modules (lib/site-defaults.ts) have the online shop on.
    expect(promoBarCodes(codes, shop)).toEqual(codes)
    expect(promoBarCodes([...codes, { code: " ", text: "x" }], shop)).toEqual(codes)
    expect(promoBarCodes([], shop)).toEqual([])
    expect(promoBarCodes(null, shop)).toEqual([])
    expect(promoBarCodes(codes, { ...shop, has_online_shop: false })).toEqual([])
    expect(promoBarCodes(codes, null)).toEqual([])
  })

  it("stays closed for the visit once dismissed, and survives blocked storage", () => {
    const store = memoryStore()
    expect(promoBarDismissed(store)).toBe(false)
    dismissPromoBar(store)
    expect(promoBarDismissed(store)).toBe(true)
    expect(store.getItem(PROMO_BAR_DISMISSED_KEY)).toBe("1")

    const blocked = {
      getItem: () => {
        throw new Error("SecurityError")
      },
      setItem: () => {
        throw new Error("SecurityError")
      },
    }
    expect(promoBarDismissed(blocked)).toBe(false)
    expect(() => dismissPromoBar(blocked)).not.toThrow()
    expect(promoBarDismissed(null)).toBe(false)
  })

  it("closes for the visit in sessionStorage, read on mount", () => {
    const view = read("components/site/promo-bar-view.tsx")
    expect(view).toContain("window.sessionStorage")
    expect(view).toMatch(/useEffect\(\(\) => \{\s*if \(promoBarDismissed\(sessionStore\(\)\)\) setOpen\(false\)/)
    expect(view).toMatch(/dismissPromoBar\(sessionStore\(\)\)\s*setOpen\(false\)/)
  })

  it("has its texts in English and German, English for other languages", () => {
    expect(promoBarTexts("en")).toEqual({ label: "Promo code", close: "Close" })
    expect(promoBarTexts("de")).toEqual({ label: "Aktionscode", close: "Schließen" })
    expect(promoBarTexts("fr")).toEqual(promoBarTexts("en"))
  })

  it("is in the root layout on every page, above the header", () => {
    const layout = read("app/layout.tsx")
    expect(layout).toContain('import { PromoBar } from "@/components/site/promo-bar"')
    expect(layout.indexOf("<PromoBar />")).toBeGreaterThan(layout.indexOf("<body>"))
    expect(layout.indexOf("<PromoBar />")).toBeLessThan(layout.indexOf("<SiteHeader />"))
  })

  it("reads the codes from the site API's promo codes endpoint (PB.1)", () => {
    expect(read("lib/studio-api.ts")).toContain('request<PromoCode[]>("/shop/promo-codes")')
  })
})
