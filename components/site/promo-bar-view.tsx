"use client"

// The promo bar's markup (F-PB): design it like the inspiration's top bar, keep the /menu link, the close button and
// the dismissal for the visit.
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
    <div data-slot="promo-bar" role="region" aria-label={texts.label}>
      <ul>
        {codes.map((promo) => (
          <li key={promo.code}>
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
