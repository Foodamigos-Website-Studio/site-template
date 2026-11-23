"use client"

// The promo bar's markup (F-PB): design it like the inspiration's top bar, keep the /menu link, the close button and
// the dismissal for the visit. SV.QF0.4 (SV.1): unlike the rest of the template it comes with a neutral look,
// one centred line in the page's own colours swapped (its text colour as the background; the browser's own text and
// page colours, CanvasText and Canvas, while the site has no --foreground and --background), with the close button
// at the right end, because no build step restyles it and unstyled it looked broken on every page.
import { useEffect, useState } from "react"

import { dismissPromoBar, promoBarDismissed, type PromoBarTexts } from "@/lib/promo-bar"
import type { PromoCode } from "@/lib/studio-api"

function sessionStore(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function PromoBarView({ codes, texts }: { codes: PromoCode[]; texts: PromoBarTexts }) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (promoBarDismissed(sessionStore())) setOpen(false)
  }, [])

  if (!open || codes.length === 0) return null

  return (
    <div
      data-slot="promo-bar"
      role="region"
      aria-label={texts.label}
      className="relative bg-[var(--foreground,CanvasText)] py-2 pr-11 pl-4 text-center text-[13px] leading-snug text-[var(--background,Canvas)] sm:px-12 sm:text-sm"
    >
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 [&_a]:text-inherit [&_a]:no-underline [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:tracking-wide">
        {codes.map((promo) => (
          <li key={promo.code} className="m-0 list-none">
            {/* /menu is the online shop (proxy.ts), not a page of this app: a plain link, like the menu item. */}
            <a href="/menu">
              {promo.text ? <span>{promo.text}</span> : null} <span>{texts.label}:</span>{" "}
              {/* SV.QF0.2: the code is never translated (Google could turn SOMMER into SUMMER, a code that doesn't exist). */}
              <strong translate="no" data-no-translate="">{promo.code}</strong>
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent text-xl leading-none text-inherit opacity-80 hover:opacity-100 sm:right-3"
        aria-label={texts.close}
        onClick={() => {
          dismissPromoBar(sessionStore())
          setOpen(false)
        }}
      >
        ×
      </button>
    </div>
  )
}
