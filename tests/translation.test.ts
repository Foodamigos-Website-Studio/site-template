// @vitest-environment jsdom
import { createElement } from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { LanguageSwitch } from "@/components/site/language-switch"
import { PageTranslation } from "@/components/site/page-translation"
import { menuRoute } from "@/lib/menu-route"
import {
  chosenLanguage,
  createPageTranslation,
  createTranslator,
  LANGUAGE_CHANGE_EVENT,
  menuLanguage,
  siteApiTranslate,
  switchLanguages,
} from "@/lib/translation"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const fakeTranslate = vi.fn(async (texts: string[], target: string) => texts.map((text) => `[${target}] ${text}`))

beforeEach(() => {
  fakeTranslate.mockClear()
  window.localStorage.clear()
  document.cookie = "site_language=; Max-Age=0; Path=/"
  document.documentElement.lang = "de"
})
afterEach(() => {
  document.body.innerHTML = ""
})

describe("the switch's languages and the stored choice", () => {
  it("offers the site's language and the other of DE/EN, and keeps only a valid choice", () => {
    expect(switchLanguages("de")).toEqual(["de", "en"])
    expect(switchLanguages("en")).toEqual(["en", "de"])
    expect(chosenLanguage("en", "de")).toBe("en")
    expect(chosenLanguage("fr", "de")).toBe("de")
    expect(chosenLanguage(null, "de")).toBe("de")
    expect(menuLanguage("en", "de")).toBe("en")
    expect(menuLanguage("xx", "de")).toBe("de")
  })
})

describe("translating texts", () => {
  it("asks for each text once, in batches of at most 128, and keeps a text the API could not translate", async () => {
    const batch = vi.fn(async (texts: string[]) => texts.map((text) => (text === "Fehler" ? null : `EN ${text}`)))
    const translate = createTranslator(batch)
    const texts = Array.from({ length: 130 }, (_, i) => `Text ${i}`)
    expect(await translate([...texts, "Text 0", "Fehler"], "en")).toEqual([...texts.map((t) => `EN ${t}`), "EN Text 0", "Fehler"])
    expect(batch).toHaveBeenCalledTimes(2)
    expect(batch.mock.calls[0]![0]).toHaveLength(128)
    await translate(["Text 1"], "en")
    expect(batch).toHaveBeenCalledTimes(2)
  })

  it("posts to the site API and leaves the texts alone when it fails", async () => {
    const ok = vi.fn(async () => new Response(JSON.stringify({ translations: ["Menu"] })))
    expect(await siteApiTranslate("https://api.test/api/projects/p", ok as unknown as typeof fetch)(["Speisekarte"], "en")).toEqual(["Menu"])
    expect(ok).toHaveBeenCalledWith("https://api.test/api/projects/p/translations", expect.objectContaining({ method: "POST", body: JSON.stringify({ texts: ["Speisekarte"], target: "en" }) }))
    const down = vi.fn(async () => new Response("", { status: 500 }))
    expect(await siteApiTranslate("https://api.test", down as unknown as typeof fetch)(["Speisekarte"], "en")).toEqual([null])
    const offline = vi.fn(async () => {
      throw new Error("offline")
    })
    expect(await siteApiTranslate("https://api.test", offline as unknown as typeof fetch)(["Speisekarte"], "en")).toEqual([null])
  })
})

describe("the page translation", () => {
  it("translates visible text and attributes, sets html lang, and restores the originals", async () => {
    document.body.innerHTML = `<h1> Unsere Speisekarte </h1><img alt="Terrasse"><input placeholder="Dein Name"><script>var x = "nicht"</script><span data-no-translate>Trattoria Bella</span>`
    const page = createPageTranslation(() => document.body, createTranslator(fakeTranslate))

    await page.apply("en", "de")
    expect(document.querySelector("h1")!.textContent).toBe(" [en] Unsere Speisekarte ")
    expect(document.querySelector("img")!.getAttribute("alt")).toBe("[en] Terrasse")
    expect(document.querySelector("input")!.getAttribute("placeholder")).toBe("[en] Dein Name")
    expect(document.querySelector("script")!.textContent).toBe('var x = "nicht"')
    expect(document.querySelector("span")!.textContent).toBe("Trattoria Bella")
    expect(document.documentElement.lang).toBe("en")

    await page.apply("de", "de")
    expect(document.querySelector("h1")!.textContent).toBe(" Unsere Speisekarte ")
    expect(document.querySelector("img")!.getAttribute("alt")).toBe("Terrasse")
    expect(document.documentElement.lang).toBe("de")
  })
})

describe("text the page changes in place (WT.2 review)", () => {
  it("takes a text React rewrote as the new original: DE shows it, EN translates it", async () => {
    document.body.innerHTML = `<p>Geschlossen</p><input placeholder="Dein Name">`
    const page = createPageTranslation(() => document.body, createTranslator(fakeTranslate))
    const text = document.querySelector("p")!.firstChild as Text
    const input = document.querySelector("input")!

    await page.apply("en", "de")
    expect(text.data).toBe("[en] Geschlossen")
    // React updates the text node and the attribute in place, without adding nodes.
    text.data = "Jetzt geöffnet"
    input.setAttribute("placeholder", "Deine E-Mail")

    await page.apply("de", "de")
    expect(text.data).toBe("Jetzt geöffnet")
    expect(input.getAttribute("placeholder")).toBe("Deine E-Mail")

    await page.apply("en", "de")
    expect(text.data).toBe("[en] Jetzt geöffnet")
    expect(input.getAttribute("placeholder")).toBe("[en] Deine E-Mail")
    expect(fakeTranslate.mock.calls.flatMap(([texts]) => texts)).not.toContain("[en] Geschlossen")
  })

  it("never puts back a text the page emptied or an attribute it removed (WT.2 review 2)", async () => {
    document.body.innerHTML = `<p>Heute geschlossen</p><button title="Mehr erfahren">i</button><input placeholder="Dein Name">`
    const page = createPageTranslation(() => document.body, createTranslator(fakeTranslate))
    const text = document.querySelector("p")!.firstChild as Text
    const button = document.querySelector("button")!
    const input = document.querySelector("input")!

    await page.apply("en", "de")
    expect(button.getAttribute("title")).toBe("[en] Mehr erfahren")
    // React empties the text, drops the conditional title and empties the placeholder.
    text.data = ""
    button.removeAttribute("title")
    input.setAttribute("placeholder", "")

    await page.apply("de", "de")
    expect(text.data).toBe("")
    expect(button.hasAttribute("title")).toBe(false)
    expect(input.getAttribute("placeholder")).toBe("")

    await page.apply("en", "de")
    expect(text.data).toBe("")
    expect(button.hasAttribute("title")).toBe(false)
  })

  it("leaves a change the page made between collecting and restoring alone", async () => {
    document.body.innerHTML = `<p>Geschlossen</p>`
    const page = createPageTranslation(() => document.body, createTranslator(fakeTranslate))
    const text = document.querySelector("p")!.firstChild as Text
    await page.apply("en", "de")
    text.data = ""
    text.data = "[en] Geschlossen" // the same value again, written by the page: still restored as ours
    await page.apply("de", "de")
    expect(text.data).toBe("Geschlossen")
  })

  it("tells its own writes from the page's", async () => {
    document.body.innerHTML = `<p>Willkommen</p>`
    const page = createPageTranslation(() => document.body, createTranslator(fakeTranslate))
    const text = document.querySelector("p")!.firstChild as Text
    await page.apply("en", "de")
    expect(page.isOwnWrite({ type: "characterData", target: text })).toBe(true)
    text.data = "Neu"
    expect(page.isOwnWrite({ type: "characterData", target: text })).toBe(false)
    expect(page.isOwnWrite({ type: "childList", target: document.body })).toBe(false)
  })
})

describe("the switch and the page translator together", () => {
  async function mount(siteLanguage = "de") {
    const header = document.createElement("header")
    const main = document.createElement("main")
    main.innerHTML = "<p>Willkommen</p>"
    document.body.append(header, main)
    vi.stubGlobal("fetch", vi.fn(async (_url: string, init: RequestInit) => {
      const { texts, target } = JSON.parse(String(init.body)) as { texts: string[]; target: string }
      return new Response(JSON.stringify({ translations: texts.map((text) => `[${target}] ${text}`) }))
    }))
    const root = createRoot(header)
    await act(async () => {
      root.render([createElement(LanguageSwitch, { key: "s", siteLanguage }), createElement(PageTranslation, { key: "t", siteLanguage, apiUrl: "https://api.test/api/projects/p" })])
    })
    return root
  }

  it("translates at once on EN, keeps the choice for the next page and back on DE", async () => {
    const root = await mount()
    const buttons = [...document.querySelectorAll("button")]
    expect(buttons.map((b) => [b.textContent, b.getAttribute("aria-pressed")])).toEqual([["DE", "true"], ["EN", "false"]])

    await act(async () => buttons[1]!.click())
    await vi.waitFor(() => expect(document.querySelector("main p")!.textContent).toBe("[en] Willkommen"))
    expect(window.localStorage.getItem("site_language")).toBe("en")
    expect(document.cookie).toContain("site_language=en")
    expect(document.documentElement.lang).toBe("en")
    expect(buttons[1]!.getAttribute("aria-pressed")).toBe("true")

    await act(async () => buttons[0]!.click())
    await vi.waitFor(() => expect(document.querySelector("main p")!.textContent).toBe("Willkommen"))
    root.unmount()
    vi.unstubAllGlobals()
  })

  it("opens the next page in the stored language and translates content that arrives later", async () => {
    window.localStorage.setItem("site_language", "en")
    const root = await mount()
    await vi.waitFor(() => expect(document.querySelector("main p")!.textContent).toBe("[en] Willkommen"))
    expect(document.querySelector("button[aria-pressed='true']")!.textContent).toBe("EN")

    const later = document.createElement("p")
    later.textContent = "Neue Gerichte"
    await act(async () => document.querySelector("main")!.append(later))
    await vi.waitFor(() => expect(later.textContent).toBe("[en] Neue Gerichte"), { timeout: 2000 })
    root.unmount()
    vi.unstubAllGlobals()
  })

  it("translates text the page rewrites in place while English is on", async () => {
    const root = await mount()
    await act(async () => [...document.querySelectorAll("button")][1]!.click())
    await vi.waitFor(() => expect(document.querySelector("main p")!.textContent).toBe("[en] Willkommen"))

    const text = document.querySelector("main p")!.firstChild as Text
    await act(async () => {
      text.data = "Heute geöffnet"
    })
    await vi.waitFor(() => expect(text.data).toBe("[en] Heute geöffnet"), { timeout: 2000 })
    root.unmount()
    vi.unstubAllGlobals()
  })

  it("keeps two switches (header and mobile menu) in step", async () => {
    const root = await mount()
    const second = document.createElement("nav")
    document.body.append(second)
    const secondRoot = createRoot(second)
    await act(async () => secondRoot.render(createElement(LanguageSwitch, { siteLanguage: "de" })))

    await act(async () => [...document.querySelectorAll<HTMLButtonElement>("header button")][1]!.click())
    expect([...second.querySelectorAll("button")].map((b) => b.getAttribute("aria-pressed"))).toEqual(["false", "true"])
    secondRoot.unmount()
    root.unmount()
    vi.unstubAllGlobals()
  })

  it("never sends the switch's own labels to be translated", async () => {
    const root = await mount()
    await act(async () => [...document.querySelectorAll("button")][1]!.click())
    await vi.waitFor(() => expect(document.querySelector("main p")!.textContent).toBe("[en] Willkommen"))
    expect([...document.querySelectorAll("button")].map((b) => b.textContent)).toEqual(["DE", "EN"])
    root.unmount()
    vi.unstubAllGlobals()
  })

  it("dispatches the change for other listeners", async () => {
    const root = await mount()
    const heard = vi.fn()
    window.addEventListener(LANGUAGE_CHANGE_EVENT, heard)
    await act(async () => [...document.querySelectorAll("button")][1]!.click())
    expect((heard.mock.calls[0]![0] as CustomEvent).detail).toBe("en")
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, heard)
    root.unmount()
    vi.unstubAllGlobals()
  })
})

describe("/menu in the chosen language", () => {
  const base = { host: "trattoria.de", pathname: "/menu/gift-cards/checkout", search: "?value=2500", shopOn: true, embedDomain: "trattoria.de", embedOrigin: "https://embed.test", onlineShopUrl: "https://bestellen.trattoria.de", siteLanguage: "de" }

  it("passes the choice to the embedded shop as storefront_locale", () => {
    expect(menuRoute({ ...base, language: "en" })).toEqual({ kind: "rewrite", url: "https://embed.test/menu/gift-cards/checkout?value=2500", cookies: { storefront_base_path: "/menu", storefront_locale: "en" } })
  })

  it("opens the standalone shop in the chosen language through ?lng=, never a /{language} path (WT.QF0.2)", () => {
    expect(menuRoute({ ...base, host: "preview.vercel.app", language: "en" })).toEqual({ kind: "redirect", url: "https://bestellen.trattoria.de/gift-cards/checkout?value=2500&lng=en" })
    expect(menuRoute({ ...base, host: "preview.vercel.app", pathname: "/menu", search: "", language: "en" })).toEqual({ kind: "redirect", url: "https://bestellen.trattoria.de?lng=en" })
    expect(menuRoute({ ...base, host: "preview.vercel.app", pathname: "/menu", search: "", language: "de", siteLanguage: "en" })).toEqual({ kind: "redirect", url: "https://bestellen.trattoria.de?lng=de" })
    // The site's own language needs nothing: the shop opens in its own language.
    expect(menuRoute({ ...base, host: "preview.vercel.app", language: "de" })).toEqual({ kind: "redirect", url: "https://bestellen.trattoria.de/gift-cards/checkout?value=2500" })
  })
})
