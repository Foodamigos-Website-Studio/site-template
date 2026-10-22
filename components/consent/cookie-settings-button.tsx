"use client"

import { useConsent } from "./consent-provider"

/** The footer link that reopens the cookie banner. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  const { openSettings } = useConsent()
  return (
    <button type="button" onClick={openSettings} className={className} data-slot="cookie-settings">
      {label}
    </button>
  )
}
