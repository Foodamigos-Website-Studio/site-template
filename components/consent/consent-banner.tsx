"use client"

// The cookie banner (texts from the site API's GET /legal). Restyle it to the site's design; keep both buttons equally
// prominent and the link to the cookie policy.
import { InlineText } from "@/components/legal/inline-text"
import type { ConsentBannerTexts } from "@/lib/studio-api"

import { useConsent } from "./consent-provider"

export function ConsentBanner({ texts }: { texts: ConsentBannerTexts | null }) {
  const { open, accept, decline } = useConsent()
  if (!open || !texts) return null
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={texts.settings}
      data-slot="consent-banner"
    >
      <div>
        <p>
          <InlineText text={texts.text} />
        </p>
        <div>
          <button type="button" onClick={accept}>{texts.accept}</button>
          <button type="button" onClick={decline}>{texts.decline}</button>
        </div>
      </div>
    </div>
  )
}
