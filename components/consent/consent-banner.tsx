"use client"

// The cookie banner (texts from the site API's GET /legal). Both buttons are equally prominent; it sits above the
// mobile order bar.
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
      className="fixed inset-x-3 bottom-[4.75rem] z-[70] md:inset-x-auto md:bottom-5 md:right-5 md:max-w-md"
    >
      <div className="card-label !text-left !p-5">
        <p className="text-sm leading-relaxed [&_a]:underline">
          <InlineText text={texts.text} />
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={decline} className="btn btn-lg !px-3 !py-2.5 !text-sm">
            {texts.decline}
          </button>
          <button type="button" onClick={accept} className="btn btn-lg !px-3 !py-2.5 !text-sm">
            {texts.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
