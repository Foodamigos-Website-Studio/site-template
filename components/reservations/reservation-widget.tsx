"use client"

// The reservation service's booking widget (reservation_url from the site API) in an iframe: scripts, forms and its
// own popups need it unsandboxed; allow="payment" for deposits. Shows a loading state until it loaded. Unstyled: give
// the iframe the full width and at least 720px height in the site's CSS; mount it only when it is shown.
import { useState } from "react"

export function ReservationWidget({ url, title, loadingLabel }: { url: string; title: string; loadingLabel: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div data-slot="reservation-widget" data-loaded={loaded || undefined}>
      {!loaded ? <p data-slot="reservation-loading">{loadingLabel}</p> : null}
      <iframe src={url} title={title} allow="payment" onLoad={() => setLoaded(true)} />
    </div>
  )
}
