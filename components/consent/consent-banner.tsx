"use client"

// The cookie banner (texts from the site API's GET /legal): both buttons are equally prominent.
import { InlineText } from "@/components/legal/inline-text"
import { buttonClasses } from "@/components/ui/button-link"
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
      className="fixed inset-x-4 bottom-4 z-[60] rounded-[7px] border-2 border-charcoal bg-background p-5 text-charcoal shadow-[6px_6px_0_0_var(--color-charcoal)] sm:left-auto sm:max-w-md"
    >
      <p className="text-sm leading-relaxed [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-4">
        <InlineText text={texts.text} />
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={accept} className={buttonClasses("red", "sm")}>
          {texts.accept}
        </button>
        <button type="button" onClick={decline} className={buttonClasses("charcoal", "sm")}>
          {texts.decline}
        </button>
      </div>
    </div>
  )
}
