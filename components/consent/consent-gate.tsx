"use client"

// Embedded videos, iframes and the restaurant's own scripts load only after consent. Wrap every embed:
// <ConsentGate category="embedded_media" label="YouTube">…</ConsentGate>.
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
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
    <div data-slot="consent-placeholder" className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center text-sm">
      <span>{label}</span>
      <Button variant="outline" onClick={openSettings}>
        {settingsLabel}
      </Button>
    </div>
  )
}
