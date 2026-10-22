"use client"

// A map of one location: Google's Maps Embed API with the project's browser key (google_maps_api_key from the site
// API; it works only on the custom domain and the v0/Vercel previews). Google sets cookies, so it shows only after
// consent (embedded_media); before that, a placeholder that reopens the banner. Unstyled: size it in the site's CSS.
import { useConsent } from "@/components/consent/consent-provider"
import { ButtonLink } from "@/components/ui/button-link"
import { mapsUrl } from "@/lib/hours"
import { MASCOT } from "@/lib/media"

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
  if (!address) return null
  if (!apiKey || !granted("embedded_media")) {
    return (
      <div
        data-slot="map-placeholder"
        className="relative flex size-full min-h-72 flex-col items-center justify-center gap-4 overflow-hidden bg-charcoal p-6 text-center text-background"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-slot="map-placeholder-mascot"
          src={MASCOT.chili.src}
          alt=""
          aria-hidden="true"
          loading="eager"
          referrerPolicy="no-referrer"
          className="pointer-events-none absolute inset-0 size-full object-contain p-4 opacity-[0.14] mix-blend-screen [filter:grayscale(1)_invert(1)]"
        />
        <address className="relative max-w-xs text-balance not-italic text-lg font-bold leading-snug">{address}</address>
        <ButtonLink href={mapsUrl(address)} external className="relative">
          Open in Google Maps
        </ButtonLink>
        {apiKey ? (
          <p className="relative text-sm leading-relaxed">
            Accept cookies to see the map here.{" "}
            <button type="button" onClick={openSettings} className="font-bold underline underline-offset-4 hover:text-primary">
              {consentLabel || "Cookie settings"}
            </button>
          </p>
        ) : null}
      </div>
    )
  }
  return (
    <iframe data-slot="map" title={title} src={mapEmbedUrl(apiKey, address, language)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
  )
}
