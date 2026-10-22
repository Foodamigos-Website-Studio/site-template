"use client"

// The cookie banner (texts from the site API's GET /legal): a slim full-width bar at the very bottom of the viewport.
// Both buttons stay equally prominent and the link to the cookie policy stays in the text.
import { InlineText } from "@/components/legal/inline-text"
import type { ConsentBannerTexts } from "@/lib/studio-api"

import { useConsent } from "./consent-provider"

const button =
  "flex-1 rounded border-2 border-secondary bg-secondary px-4 py-1.5 font-heading text-lg uppercase leading-none tracking-wide text-primary transition-colors duration-[150ms] ease-in-out hover:bg-background hover:text-secondary sm:flex-none sm:px-5"

export function ConsentBanner({ texts }: { texts: ConsentBannerTexts | null }) {
  const { open, accept, decline } = useConsent()
  if (!open || !texts) return null
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={texts.settings}
      data-slot="consent-banner"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-secondary bg-primary px-4 py-2 text-secondary"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <p className="text-xs leading-snug sm:flex-1 [&_a]:underline [&_a]:underline-offset-4">
          <InlineText text={texts.text} />
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={accept} className={button}>
            {texts.accept}
          </button>
          <button type="button" onClick={decline} className={button}>
            {texts.decline}
          </button>
        </div>
      </div>
    </div>
  )
}
