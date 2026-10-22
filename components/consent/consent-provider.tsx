"use client"

// The visitor's cookie choice for the whole site. The layout reads the cookie on the server, so the banner never
// flashes for someone who already chose. Declining after accepting reloads the page, so loaded trackers are gone.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

import { consentCookie, isGranted, type ConsentCategory, type ConsentStatus } from "@/lib/consent"

type ConsentValue = {
  status: ConsentStatus
  /** The banner is open: no choice yet, or the visitor reopened it from the footer. */
  open: boolean
  accept: () => void
  decline: () => void
  openSettings: () => void
  granted: (category: ConsentCategory) => boolean
}

const ConsentContext = createContext<ConsentValue | null>(null)

export function ConsentProvider({ initial, children }: { initial: ConsentStatus; children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>(initial)
  const [reopened, setReopened] = useState(false)

  const choose = useCallback(
    (accepted: boolean) => {
      document.cookie = consentCookie(accepted, window.location.protocol === "https:")
      const revoked = status === "accepted" && !accepted
      setStatus(accepted ? "accepted" : "declined")
      setReopened(false)
      if (revoked) window.location.reload()
    },
    [status],
  )

  const value = useMemo<ConsentValue>(
    () => ({
      status,
      open: status === "pending" || reopened,
      accept: () => choose(true),
      decline: () => choose(false),
      openSettings: () => setReopened(true),
      granted: (category) => isGranted(status, category),
    }),
    [status, reopened, choose],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent(): ConsentValue {
  const value = useContext(ConsentContext)
  if (!value) throw new Error("useConsent must be used inside ConsentProvider (app/layout.tsx).")
  return value
}
