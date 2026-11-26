import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ReservationWidget } from "@/components/reservations/reservation-widget"
import { PageTitle } from "@/components/site/page-title"
import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { reservationsOn } from "@/lib/modules"
import { pageMetadata } from "@/lib/seo"
import { getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Tisch reservieren – Trattoria Bella Berlin",
    description: "Reservieren Sie Ihren Tisch in der Trattoria Bella in Berlin Kreuzberg oder Mitte: italienische Küche mit hausgemachter Pasta.",
    path: localizedPath("reservations", SITE_LANGUAGE),
  })
}

export default async function ReservationsPage() {
  const project = await getProject()
  if (!reservationsOn(project) || !project?.reservation_url) notFound()
  return (
    <>
      <PageTitle intro="Wählen Sie Tag, Uhrzeit und Personenzahl – wir freuen uns auf Sie.">Tisch reservieren</PageTitle>
      <section data-slot="reservations" className="bg-background px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <ReservationWidget url={project.reservation_url} title={project.name} loadingLabel="Reservierung wird geladen …" />
        </div>
      </section>
    </>
  )
}
