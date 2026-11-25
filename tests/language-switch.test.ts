import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { LanguageSwitch } from "@/components/site/language-switch"

const render = (siteLanguage = "de") => renderToStaticMarkup(createElement(LanguageSwitch, { siteLanguage }))
const classes = (html: string, pattern: RegExp) => (pattern.exec(html)?.[1] ?? "").split(" ")

describe("LanguageSwitch", () => {
  it("offers the site's language first and the other one second", () => {
    const html = render("de")
    expect(html).toMatch(/<button[^>]*lang="de"[^>]*aria-pressed="true"[^>]*>DE<\/button>/)
    expect(html).toMatch(/<button[^>]*lang="en"[^>]*aria-pressed="false"[^>]*>EN<\/button>/)
    expect(html.indexOf(">DE<")).toBeLessThan(html.indexOf(">EN<"))
  })

  // SV.QF0.7 (SV.1 run 3): on a built site the switch was two bare buttons that read "DEEN", with no gap and no
  // visible choice, at 1280 and 375 px: Max didn't restyle it. Like the promo bar (SV.QF0.4) it comes with a
  // neutral look of its own: the two options apart with a separator, the chosen one stands out.
  it("comes styled: two options apart, with a separator, the chosen one stands out", () => {
    const html = render("de")
    expect(classes(html, /<div data-slot="language-switch"[^>]*class="([^"]+)"/)).toEqual(
      expect.arrayContaining(["inline-flex", "items-center", "gap-1"]),
    )
    // A visible separator between DE and EN, hidden from screen readers (the group already says "Language").
    expect(html).toMatch(/>DE<\/button><span aria-hidden="true"[^>]*>\/<\/span><button/)
    const button = classes(html, /<button[^>]*class="([^"]+)"/)
    expect(button).toEqual(
      expect.arrayContaining(["text-inherit", "bg-transparent", "opacity-60", "aria-pressed:opacity-100", "aria-pressed:font-semibold"]),
    )
    // Both buttons carry the same look; only aria-pressed decides which one stands out.
    const buttons = html.match(/<button[^>]*class="([^"]+)"/g) ?? []
    expect(buttons).toHaveLength(2)
  })

  it("starts from English on an English site", () => {
    const html = render("en")
    expect(html).toMatch(/<button[^>]*lang="en"[^>]*aria-pressed="true"[^>]*>EN<\/button>/)
    expect(html.indexOf(">EN<")).toBeLessThan(html.indexOf(">DE<"))
  })
})
