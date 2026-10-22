// Table reservations: the reservation service's widget (reservation_url from the site API), only when the module is
// on. Unstyled default markup v0 may replace, keeping ReservationWidget (or opening it in a dialog from the header).
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ReservationWidget } from "@/components/reservations/reservation-widget"
import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { reservationsOn } from "@/lib/modules"
import { pageMetadata } from "@/lib/seo"
import { getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  return pageMetadata({ title: project?.name ?? "", description: project?.tagline ?? project?.name ?? "", path: localizedPath("reservations", SITE_LANGUAGE) })
}

export default async function ReservationsPage() {
  const project = await getProject()
  if (!reservationsOn(project) || !project?.reservation_url) notFound()
  return (
    <section data-slot="reservations">
      <h1>{project.name}</h1>
      <ReservationWidget url={project.reservation_url} title={project.name} loadingLabel="…" />
    </section>
  )
}
