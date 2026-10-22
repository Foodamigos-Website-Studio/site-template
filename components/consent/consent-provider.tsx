"use client"

// The visitor's cookie choice for the whole site. The layout reads the cookie on the server, so the banner never
// flashes for someone who already chose. When the server saw no choice, the browser is asked once (the cookie, or the
// copy in local storage, for previews whose proxy drops cookies and iframes that block them); the banner opens only
// after that. Declining after accepting reloads the page, so loaded trackers are gone.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import { CONSENT_COOKIE, consentCookie, consentInBrowser, isGranted, type ConsentCategory, type ConsentStatus } from "@/lib/consent"

function storedChoice(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_COOKIE)
  } catch {
    return null
  }
}

function storeChoice(accepted: boolean) {
  try {
    window.localStorage.setItem(CONSENT_COOKIE, String(accepted))
  } catch {
    // No storage (private mode, blocked): the cookie alone keeps the choice.
  }
}

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
  // Whether a pending choice was checked in the browser yet; a choice the server knew needs no check.
  const [checked, setChecked] = useState(initial !== "pending")

  useEffect(() => {
    if (checked) return
    const choice = consentInBrowser(document.cookie, storedChoice())
    if (choice !== "pending") setStatus(choice)
    setChecked(true)
  }, [checked])

  const choose = useCallback(
    (accepted: boolean) => {
      document.cookie = consentCookie(accepted, window.location.protocol === "https:")
      storeChoice(accepted)
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
      open: (status === "pending" && checked) || reopened,
      accept: () => choose(true),
      decline: () => choose(false),
      openSettings: () => setReopened(true),
      granted: (category) => isGranted(status, category),
    }),
    [status, reopened, checked, choose],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent(): ConsentValue {
  const value = useContext(ConsentContext)
  if (!value) throw new Error("useConsent must be used inside ConsentProvider (app/layout.tsx).")
  return value
}
