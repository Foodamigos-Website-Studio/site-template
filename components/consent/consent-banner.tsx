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
      className="fixed inset-x-0 bottom-0 z-50 p-3 md:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded border-2 border-secondary bg-primary p-5 text-secondary shadow-[6px_6px_0_0_var(--color-secondary)] md:flex-row md:items-center md:gap-8">
        <p className="text-sm leading-relaxed md:flex-1 [&_a]:underline [&_a]:underline-offset-4">
          <InlineText text={texts.text} />
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={accept}
            className="flex-1 rounded border-2 border-secondary bg-secondary px-6 py-3 font-heading text-xl uppercase leading-none tracking-wide text-primary transition-colors duration-[150ms] ease-in-out hover:bg-background hover:text-secondary md:flex-none"
          >
            {texts.accept}
          </button>
          <button
            type="button"
            onClick={decline}
            className="flex-1 rounded border-2 border-secondary bg-secondary px-6 py-3 font-heading text-xl uppercase leading-none tracking-wide text-primary transition-colors duration-[150ms] ease-in-out hover:bg-background hover:text-secondary md:flex-none"
          >
            {texts.decline}
          </button>
        </div>
      </div>
    </div>
  )
}
