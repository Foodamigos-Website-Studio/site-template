// The header's DE/EN switch (F-WT): the site's own language and the other of German and English. Keep it in the
// header (and the mobile menu); design it like the inspiration. Never build another language switcher: the page
// translates through <PageTranslation /> and /menu follows the choice.
"use client"

import { Fragment, useEffect, useState } from "react"

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
    // Another switch on the page (the header's and the mobile menu's) changed the language: show it here too.
    const follow = (event: Event) => setLanguage(chosenLanguage((event as CustomEvent<string>).detail, siteLanguage))
    window.addEventListener(LANGUAGE_CHANGE_EVENT, follow)
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, follow)
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

  // SV.QF0.7 (SV.1): unlike the rest of the template the switch comes with a neutral look, in the header's own text
  // colour: DE / EN apart with a separator, the chosen one at full strength and semibold, the other dimmed. Unstyled it
  // read "DEEN" with no visible choice on built sites, because Max doesn't always restyle it.
  return (
    <div
      data-slot="language-switch"
      role="group"
      aria-label="Language"
      translate="no"
      className="inline-flex items-center gap-1 text-sm leading-none"
    >
      {switchLanguages(siteLanguage).map((code, index) => (
        <Fragment key={code}>
          {index > 0 ? (
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
          ) : null}
          <button
            type="button"
            lang={code}
            aria-pressed={language === code}
            onClick={() => choose(code)}
            className="cursor-pointer border-0 bg-transparent px-1 py-2 text-inherit opacity-60 transition-opacity hover:opacity-100 aria-pressed:opacity-100 aria-pressed:font-semibold"
          >
            {code.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
