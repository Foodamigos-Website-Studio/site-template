// The header's DE/EN switch (F-WT): the site's own language and the other of German and English. Keep it in the
// header (and the mobile menu); design it like the inspiration. Never build another language switcher: the page
// translates through <PageTranslation /> and /menu follows the choice.
"use client"

import { useEffect, useState } from "react"

import { SITE_LANGUAGE } from "@/lib/config"
import { chosenLanguage, LANGUAGE_CHANGE_EVENT, LANGUAGE_STORAGE_KEY, languageCookie, switchLanguages } from "@/lib/translation"

export function LanguageSwitch({ siteLanguage = SITE_LANGUAGE }: { siteLanguage?: string }) {
  const [language, setLanguage] = useState(siteLanguage)

  useEffect(() => {
    try {
      setLanguage(chosenLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY), siteLanguage))
    } catch {
      // storage blocked: the site's language
    }
  }, [siteLanguage])

  const choose = (next: string) => {
    setLanguage(next)
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
    } catch {
      // storage blocked: the choice lasts for this page
    }
    document.cookie = languageCookie(next)
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: next }))
  }

  return (
    <div data-slot="language-switch" role="group" aria-label="Language" translate="no">
      {switchLanguages(siteLanguage).map((code) => (
        <button key={code} type="button" lang={code} aria-pressed={language === code} onClick={() => choose(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
