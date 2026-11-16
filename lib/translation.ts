// The DE/EN switch (F-WT): visitors read the site in its own language or the other of German and English. The server
// HTML stays in the site's language (search engines see that); the browser translates the visible text in place
// through the site API's POST /translations (Google behind a shared cache and a daily budget). No /en paths: the
// choice lives in localStorage and a cookie, which /menu passes on to the shop (proxy.ts).

export const LANGUAGE_STORAGE_KEY = "site_language"
export const LANGUAGE_COOKIE = "site_language"
export const LANGUAGE_CHANGE_EVENT = "site-language-change"

export type SwitchLanguage = "de" | "en"

/** The switch's two languages: the site's own and the other of German and English (an English site offers DE). */
export function switchLanguages(siteLanguage: string): [string, SwitchLanguage] {
  return [siteLanguage, siteLanguage === "en" ? "de" : "en"]
}

/** The visitor's stored choice when it is one of the switch's languages, else the site's language. */
export function chosenLanguage(stored: string | null | undefined, siteLanguage: string): string {
  return stored && switchLanguages(siteLanguage).includes(stored) ? stored : siteLanguage
}

/** The language /menu opens the shop in: a valid cookie choice (de or en), else the site's language. */
export function menuLanguage(cookie: string | null | undefined, siteLanguage: string): string {
  return cookie === "de" || cookie === "en" ? cookie : siteLanguage
}

/** The cookie that carries the choice to /menu, for a year. */
export function languageCookie(language: string): string {
  return `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`
}

// --- Translating texts -------------------------------------------------------------------------------------------

const MAX_TEXTS = 128
const MAX_CHARACTERS = 30_000

type TranslateBatch = (texts: string[], target: SwitchLanguage) => Promise<(string | null)[]>

/** POST /translations of the site API; any failure leaves the texts as they are. */
export function siteApiTranslate(baseUrl: string, fetchImpl: typeof fetch = fetch): TranslateBatch {
  return async (texts, target) => {
    try {
      const response = await fetchImpl(`${baseUrl}/translations`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ texts, target }),
      })
      if (!response.ok) return texts.map(() => null)
      const json = (await response.json()) as { translations?: (string | null)[]; data?: { translations?: (string | null)[] } }
      const translations = json.translations ?? json.data?.translations
      return Array.isArray(translations) && translations.length === texts.length ? translations : texts.map(() => null)
    } catch {
      return texts.map(() => null)
    }
  }
}

/**
 * Translates texts once per language and page load: each text is asked for once (repeats share the answer), in as
 * few requests as the API allows (128 texts, 30,000 characters). A text the API could not translate stays as it is.
 */
export function createTranslator(translateBatch: TranslateBatch) {
  const cache = new Map<string, Promise<string>>()
  return async function translate(texts: readonly string[], target: SwitchLanguage): Promise<string[]> {
    const missing = [...new Set(texts)].filter((text) => !cache.has(`${target}\u0000${text}`))
    for (const batch of batches(missing)) {
      const answer = translateBatch(batch, target)
      batch.forEach((text, index) => cache.set(`${target}\u0000${text}`, answer.then((translations) => translations[index] ?? text)))
    }
    return Promise.all(texts.map((text) => cache.get(`${target}\u0000${text}`)!))
  }
}

function batches(texts: readonly string[]): string[][] {
  const result: string[][] = []
  let current: string[] = []
  let characters = 0
  for (const text of texts) {
    if (current.length > 0 && (current.length >= MAX_TEXTS || characters + text.length > MAX_CHARACTERS)) {
      result.push(current)
      current = []
      characters = 0
    }
    current.push(text)
    characters += text.length
  }
  if (current.length > 0) result.push(current)
  return result
}

// --- The page ------------------------------------------------------------------------------------------------------

const SKIPPED = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "SVG", "TEMPLATE", "IFRAME"])
const ATTRIBUTES = ["placeholder", "alt", "title", "aria-label"] as const

type Original = { text: Map<Text, string>; attributes: Map<Element, Map<string, string>> }

/**
 * What the page showed in the site's language, so switching back restores it exactly. The page keeps changing after a
 * translation (React rewrites text and attributes in place: opening state, counters, form hints), so the last value
 * written to each text and attribute is kept too: a value that differs from it was written by the page, and becomes
 * that node's new original (WT.2 review).
 */
export function createPageTranslation(root: () => Element | null, translate: (texts: readonly string[], target: SwitchLanguage) => Promise<string[]>) {
  const original: Original = { text: new Map(), attributes: new Map() }
  const written = { text: new Map<Text, string>(), attributes: new Map<Element, Map<string, string>>() }
  let run = 0

  const excluded = (element: Element | null): boolean => {
    for (let node = element; node; node = node.parentElement) {
      if (SKIPPED.has(node.tagName.toUpperCase()) || node.hasAttribute("data-no-translate") || node.getAttribute("translate") === "no") return true
    }
    return false
  }

  const writeText = (node: Text, value: string) => {
    written.text.set(node, value)
    if (node.data !== value) node.data = value
  }
  const writeAttribute = (el: Element, name: string, value: string) => {
    const saved = written.attributes.get(el) ?? new Map<string, string>()
    saved.set(name, value)
    written.attributes.set(el, saved)
    if (el.getAttribute(name) !== value) el.setAttribute(name, value)
  }

  /** Remembers every visible text and translatable attribute in the site's language: new ones, and ones the page changed. */
  const collect = (element: Element) => {
    const walker = element.ownerDocument.createTreeWalker(element, 4 /* NodeFilter.SHOW_TEXT */)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node as Text
      if (text.data.trim() === "" || excluded(text.parentElement)) continue
      const expected = written.text.get(text) ?? original.text.get(text)
      if (expected === undefined || text.data !== expected) {
        original.text.set(text, text.data)
        written.text.delete(text)
      }
    }
    for (const el of [element, ...element.querySelectorAll("*")]) {
      if (excluded(el)) continue
      for (const name of ATTRIBUTES) {
        const value = el.getAttribute(name)
        if (!value?.trim()) continue
        const saved = original.attributes.get(el) ?? new Map<string, string>()
        const expected = written.attributes.get(el)?.get(name) ?? saved.get(name)
        if (expected === undefined || value !== expected) {
          saved.set(name, value)
          written.attributes.get(el)?.delete(name)
        }
        original.attributes.set(el, saved)
      }
    }
  }

  /** True when a mutation only shows what this translation wrote itself (so it is no change of the page). */
  function isOwnWrite(record: { type: string; target: Node; attributeName?: string | null }): boolean {
    if (record.type === "characterData") return written.text.get(record.target as Text) === (record.target as Text).data
    if (record.type === "attributes" && record.attributeName) {
      const el = record.target as Element
      return written.attributes.get(el)?.get(record.attributeName) === el.getAttribute(record.attributeName)
    }
    return false
  }

  /** Shows the page in `language`: the originals for the site's language, translations for the other one. */
  async function apply(language: string, siteLanguage: string): Promise<void> {
    const element = root()
    if (!element) return
    const current = ++run
    element.ownerDocument.documentElement.lang = language
    collect(element)
    for (const [node] of original.text) if (!node.isConnected) (original.text.delete(node), written.text.delete(node))
    for (const [el] of original.attributes) if (!el.isConnected) (original.attributes.delete(el), written.attributes.delete(el))

    if (language === siteLanguage || (language !== "de" && language !== "en")) {
      for (const [node, text] of original.text) writeText(node, text)
      for (const [el, saved] of original.attributes) for (const [name, value] of saved) writeAttribute(el, name, value)
      return
    }

    const textNodes = [...original.text]
    const attributes = [...original.attributes].flatMap(([el, saved]) => [...saved].map(([name, value]) => ({ el, name, value })))
    const translated = await translate([...textNodes.map(([, text]) => text.trim()), ...attributes.map(({ value }) => value.trim())], language)
    if (current !== run) return // a newer switch or page change won

    let index = 0
    for (const [node, text] of textNodes) {
      const value = translated[index++]!
      // The page changed this text while it was being translated: leave it, the next pass translates the new one.
      if (node.data !== (written.text.get(node) ?? text)) continue
      const [, lead, , trail] = text.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? ["", "", text, ""]
      writeText(node, `${lead}${value}${trail}`)
    }
    for (const { el, name, value } of attributes) {
      const translation = translated[index++]!
      if (el.getAttribute(name) !== (written.attributes.get(el)?.get(name) ?? value)) continue
      writeAttribute(el, name, translation)
    }
  }

  return { apply, isOwnWrite }
}

/** The attributes the page translation translates (for a MutationObserver's attributeFilter). */
export const TRANSLATED_ATTRIBUTES: readonly string[] = ATTRIBUTES
