import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ReservationWidget } from "@/components/reservations/reservation-widget"
import { PageIntro } from "@/components/site/page-intro"
import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { reservationsOn } from "@/lib/modules"
import { pageMetadata } from "@/lib/seo"
import { getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  return pageMetadata({
    title: `${name} – Tisch reservieren in Berlin`,
    description: `Reserviere deinen Tisch in der ${name} in Berlin.`,
    path: localizedPath("reservations", SITE_LANGUAGE),
  })
}

export default async function ReservationsPage() {
  const project = await getProject()
  if (!reservationsOn(project) || !project?.reservation_url) notFound()
  return (
    <main data-slot="reservations" className="pb-24">
      <PageIntro kicker="Wir halten einen Platz für dich frei" title="Tisch reservieren" />
      <div className="mx-auto max-w-[900px] px-5 sm:px-8">
        <div className="frame">
          <ReservationWidget url={project.reservation_url} title={project.name} loadingLabel="Reservierung wird geladen …" />
        </div>
      </div>
    </main>
  )
}
