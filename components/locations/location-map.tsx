"use client"

// A map of one location: Google's Maps Embed API with the project's browser key (google_maps_api_key from the site
// API; it works only on the custom domain and the v0/Vercel previews). Google sets cookies, so it shows only after
// consent (embedded_media); before that, a placeholder that reopens the banner. Unstyled: size it in the site's CSS.
import { MapPin } from "lucide-react"

import { useConsent } from "@/components/consent/consent-provider"

export function mapEmbedUrl(apiKey: string, address: string, language: string): string {
  const params = new URLSearchParams({ key: apiKey, q: address, language })
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`
}

export function LocationMap({
  apiKey,
  address,
  language,
  title,
  consentLabel,
}: {
  apiKey: string | null | undefined
  address: string
  language: string
  title: string
  /** The placeholder's button (GET /legal consent_banner.settings). */
  consentLabel: string
}) {
  const { granted, openSettings } = useConsent()
  if (!apiKey || !address) return null
  if (!granted("embedded_media")) {
    return (
      <div data-slot="map-placeholder" className="flex size-full flex-col items-center justify-center gap-3 px-6 text-center text-secondary">
        <MapPin className="size-12" strokeWidth={1.75} aria-hidden="true" />
        <p className="text-lg font-semibold leading-snug">Die Karte wird nach deiner Zustimmung geladen</p>
        <p className="mb-3 text-base leading-snug">{address}</p>
        <button type="button" onClick={openSettings}>
          {consentLabel}
        </button>
      </div>
    )
  }
  return (
    <iframe data-slot="map" title={title} src={mapEmbedUrl(apiKey, address, language)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
  )
}
