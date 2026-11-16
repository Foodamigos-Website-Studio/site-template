// Translates the page in the browser when the visitor chose the other language (F-WT, lib/translation.ts): once on
// load, on every switch, and when the page changes (client navigation, content added later). It also adds the choice
// to every /menu link the visitor follows (?lng=), so the shop opens in it where /menu can't read the cookie (WT.QF0.5).
// Renders nothing; keep it in the root layout. The server HTML stays in the site's language.
"use client"

import { useEffect, useRef } from "react"

import { PROJECT_UUID, SITE_LANGUAGE, STUDIO_API_URL } from "@/lib/config"
import {
  chosenLanguage,
  createPageTranslation,
  createTranslator,
  LANGUAGE_CHANGE_EVENT,
  LANGUAGE_STORAGE_KEY,
  menuLinkWithLanguage,
  siteApiTranslate,
  switchLanguages,
  TRANSLATED_ATTRIBUTES,
} from "@/lib/translation"

function storedLanguage(): string | null {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {
    return null
  }
}

function openPage(url: string) {
  window.location.assign(url)
}

export function PageTranslation({
  siteLanguage = SITE_LANGUAGE,
  apiUrl = `${STUDIO_API_URL}/api/projects/${PROJECT_UUID}`,
  navigate = openPage,
}: {
  siteLanguage?: string
  apiUrl?: string
  navigate?: (url: string) => void
}) {
  // Made once and kept across the effect's runs: React StrictMode (v0 previews, next dev) runs the effect twice, and a
  // page translation made on the second run would take the first run's English for the page's originals, translate
  // it again and never restore German (WT.QF0.1). Kept, the second run supersedes the first's pending translation and
  // shares its request.
  const translator = useRef<{ apiUrl: string; translate: ReturnType<typeof createTranslator> } | null>(null)
  const pageTranslation = useRef<ReturnType<typeof createPageTranslation> | null>(null)

  useEffect(() => {
    if (translator.current?.apiUrl !== apiUrl) translator.current = { apiUrl, translate: createTranslator(siteApiTranslate(apiUrl)) }
    const page = (pageTranslation.current ??= createPageTranslation(() => document.body, (texts, target) => translator.current!.translate(texts, target)))
    let language = chosenLanguage(storedLanguage(), siteLanguage)
    let pending: ReturnType<typeof setTimeout> | null = null

    const apply = () => page.apply(language, siteLanguage)

    const onChange = (event: Event) => {
      language = chosenLanguage((event as CustomEvent<string>).detail, siteLanguage)
      void apply()
    }
    // New content (a client-side page change, a section loading later) and text or attributes the page rewrites in
    // place (opening state, counters, form hints): translate them too. The translation's own writes are recognised and
    // ignored, so it never triggers itself.
    const observer = new MutationObserver((records) => {
      if (language === siteLanguage || records.every((record) => page.isOwnWrite(record))) return
      if (pending) clearTimeout(pending)
      pending = setTimeout(() => void apply(), 150)
    })

    window.addEventListener(LANGUAGE_CHANGE_EVENT, onChange)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...TRANSLATED_ATTRIBUTES] })
    if (language !== siteLanguage) void apply()
    else document.documentElement.lang = siteLanguage

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, onChange)
      observer.disconnect()
      if (pending) clearTimeout(pending)
    }
  }, [siteLanguage, apiUrl])

  // WT.QF0.5: a /menu link the visitor follows carries their choice as ?lng= (proxy.ts reads it before the cookie, which
  // v0's preview proxy drops). Done on the click, so the markup (and any <Link>'s href) stays as rendered. Runs in the
  // capture phase on window, before React: a plain click becomes a full page load (a <Link> would otherwise route to
  // /menu without lng); a click that opens a new tab or window gets the href for that click only.
  useEffect(() => {
    const stored = storedLanguage()
    let choice = stored && switchLanguages(siteLanguage).includes(stored) ? stored : null
    const onChange = (event: Event) => {
      choice = chosenLanguage((event as CustomEvent<string>).detail, siteLanguage)
    }
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!link || event.defaultPrevented || (event.type === "auxclick" && event.button !== 1)) return
      const href = menuLinkWithLanguage(link.getAttribute("href")!, window.location.href, choice)
      if (!href) return
      const sameTab = event.type === "click" && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
      if (sameTab && (!link.target || link.target === "_self") && !link.hasAttribute("download")) {
        event.preventDefault()
        navigate(href)
        return
      }
      const original = link.getAttribute("href")!
      link.setAttribute("href", href)
      setTimeout(() => link.setAttribute("href", original), 0)
    }
    window.addEventListener(LANGUAGE_CHANGE_EVENT, onChange)
    window.addEventListener("click", onClick, true)
    window.addEventListener("auxclick", onClick, true)
    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, onChange)
      window.removeEventListener("click", onClick, true)
      window.removeEventListener("auxclick", onClick, true)
    }
  }, [siteLanguage, navigate])

  return null
}
