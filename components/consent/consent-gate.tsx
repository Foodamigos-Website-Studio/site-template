"use client"

// Embedded videos, iframes and the restaurant's own scripts load only after consent. Wrap every embed:
// <ConsentGate category="embedded_media" label="YouTube">…</ConsentGate>.
import type { ReactNode } from "react"

import type { ConsentCategory } from "@/lib/consent"

import { useConsent } from "./consent-provider"

export function ConsentGate({
  category,
  label,
  settingsLabel,
  children,
}: {
  category: ConsentCategory
  /** The provider shown in the placeholder, e.g. "YouTube". */
  label: string
  /** The footer's cookie settings label (GET /legal consent_banner.settings). */
  settingsLabel: string
  children: ReactNode
}) {
  const { granted, openSettings } = useConsent()
  if (granted(category)) return <>{children}</>
  return (
    <div data-slot="consent-placeholder">
      <span>{label}</span>
      <button type="button" onClick={openSettings}>
        {settingsLabel}
      </button>
    </div>
  )
}
