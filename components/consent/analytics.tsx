"use client"

// Umami analytics, only after the visitor accepted cookies and only when the restaurant has an Umami website.
import Script from "next/script"

import { UMAMI_SCRIPT_URL } from "@/lib/config"

import { useConsent } from "./consent-provider"

export function Analytics({ umamiWebsiteId }: { umamiWebsiteId: string | null | undefined }) {
  const { granted } = useConsent()
  if (!umamiWebsiteId || !granted("analytics")) return null
  return <Script src={UMAMI_SCRIPT_URL} data-website-id={umamiWebsiteId} strategy="afterInteractive" />
}
