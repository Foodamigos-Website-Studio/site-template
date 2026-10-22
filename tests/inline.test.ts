import { describe, expect, it } from "vitest"

import { parseInline, plainText, safeHref } from "@/lib/inline"

describe("parseInline", () => {
  it("splits bold and links out of the text", () => {
    expect(parseInline("Mehr in unserer [Cookie-Richtlinie](/cookie-richtlinie). **Wir** sind da.")).toEqual([
      { type: "text", text: "Mehr in unserer " },
      { type: "link", label: "Cookie-Richtlinie", href: "/cookie-richtlinie" },
      { type: "text", text: ". " },
      { type: "bold", text: "Wir" },
      { type: "text", text: " sind da." },
    ])
  })

  it("keeps only safe links: a javascript: link becomes plain text", () => {
    expect(parseInline("[klick](javascript:alert(1))")).toEqual([{ type: "text", text: "klick" }, { type: "text", text: ")" }])
    expect(safeHref("//evil.example")).toBeNull()
    expect(safeHref("https://support.google.com/chrome")).toBe("https://support.google.com/chrome")
    expect(safeHref("mailto:hallo@example.com")).toBe("mailto:hallo@example.com")
  })

  it("leaves text without markup as one token, and HTML as text", () => {
    expect(parseInline("<b>no html</b>")).toEqual([{ type: "text", text: "<b>no html</b>" }])
  })

  it("gives the plain text for a meta description", () => {
    expect(plainText("**Sushi Kaito** verpflichtet sich, [mehr](/x).")).toBe("Sushi Kaito verpflichtet sich, mehr.")
  })
})
