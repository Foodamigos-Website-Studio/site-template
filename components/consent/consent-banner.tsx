"use client"

// The cookie banner (texts from the site API's GET /legal). Restyle it to the site's design; keep both buttons equally
// prominent and the link to the cookie policy.
import { InlineText } from "@/components/legal/inline-text"
import { Button } from "@/components/ui/button"
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
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 shadow-lg sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <p className="text-sm">
          <InlineText text={texts.text} />
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={accept}>{texts.accept}</Button>
          <Button onClick={decline}>{texts.decline}</Button>
        </div>
      </div>
    </div>
  )
}
