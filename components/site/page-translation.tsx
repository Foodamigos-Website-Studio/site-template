// Translates the page in the browser when the visitor chose the other language (F-WT, lib/translation.ts): once on
// load, on every switch, and when the page changes (client navigation, content added later). Renders nothing; keep it
// in the root layout. The server HTML stays in the site's language.
"use client"

import { useEffect } from "react"

import { PROJECT_UUID, SITE_LANGUAGE, STUDIO_API_URL } from "@/lib/config"
import {
  chosenLanguage,
  createPageTranslation,
  createTranslator,
  LANGUAGE_CHANGE_EVENT,
  LANGUAGE_STORAGE_KEY,
  siteApiTranslate,
  TRANSLATED_ATTRIBUTES,
} from "@/lib/translation"

function storedLanguage(): string | null {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {
    return null
  }
}

export function PageTranslation({ siteLanguage = SITE_LANGUAGE, apiUrl = `${STUDIO_API_URL}/api/projects/${PROJECT_UUID}` }: { siteLanguage?: string; apiUrl?: string }) {
  useEffect(() => {
    const page = createPageTranslation(() => document.body, createTranslator(siteApiTranslate(apiUrl)))
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

  return null
}
