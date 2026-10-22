"use client"

// The cookie banner (texts from the site API's GET /legal): a compact card at the bottom left on desktop, a full-width bottom bar on mobile.
// Both buttons stay equally prominent and the link to the cookie policy stays in the text.
import { InlineText } from "@/components/legal/inline-text"
import type { ConsentBannerTexts } from "@/lib/studio-api"

import { useConsent } from "./consent-provider"

const button =
  "flex h-10 items-center justify-center rounded border-2 border-secondary bg-secondary px-3 font-heading text-lg uppercase leading-none tracking-wide text-primary transition-colors duration-[150ms] ease-in-out hover:bg-background hover:text-secondary"

export function ConsentBanner({ texts }: { texts: ConsentBannerTexts | null }) {
  const { open, accept, decline } = useConsent()
  if (!open || !texts) return null
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={texts.settings}
      data-slot="consent-banner"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-secondary bg-primary px-4 py-3 text-secondary md:inset-x-auto md:bottom-4 md:left-4 md:max-w-[420px] md:rounded md:border-2 md:p-4 md:shadow-[0_12px_32px_-8px_rgb(7_92_64_/_0.45)]"
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs leading-snug [&_a]:underline [&_a]:underline-offset-4">
          <InlineText text={texts.text} />
        </p>
        <div className="grid grid-cols-2 gap-2">
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
