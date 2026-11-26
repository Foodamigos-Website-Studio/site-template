import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { LocationMap } from "@/components/locations/location-map"
import { PageTitle } from "@/components/site/page-title"
import { SITE_LANGUAGE } from "@/lib/config"
import { isOpenNow, mapsUrl, weekHours } from "@/lib/hours"
import { localizedPath } from "@/lib/localized-routes"
import { reservationsOn } from "@/lib/modules"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getLegal, getProject, type Company } from "@/lib/studio-api"

const fullAddress = (company: Company) => [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Standorte & Öffnungszeiten – Trattoria Bella Berlin",
    description: "Trattoria Bella in Berlin Kreuzberg (Oranienstraße 42) und Mitte (Torstraße 101): Adressen, Telefon und Öffnungszeiten, täglich 12 bis 23 Uhr.",
    path: localizedPath("location-and-hours", SITE_LANGUAGE),
  })
}

export default async function LocationsPage() {
  const [project, companies, legal] = await Promise.all([getProject(), getCompanies(), getLegal()])
  if (!companies?.length) notFound()
  const reservations = reservationsOn(project)

  return (
    <>
      <PageTitle intro="Zwei Häuser in Berlin, täglich für Sie geöffnet.">Standorte &amp; Öffnungszeiten</PageTitle>

      <section data-slot="locations" className="bg-background px-6 py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-24">
          {companies.map((company) => {
            const address = fullAddress(company)
            const open = isOpenNow(company.opening_hours, company.timezone)
            return (
              <article key={company.uuid} data-slot="location" data-open={open || undefined} className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <h2 className="eyebrow text-balance text-xl text-secondary md:text-3xl">{company.name}</h2>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-primary">{open ? "Jetzt geöffnet" : "Aktuell geschlossen"}</p>
                  <address className="mt-6 not-italic leading-loose">
                    <span className="text-secondary">{address}</span>
                    {company.phone_number ? (
                      <>
                        <br />
                        <a href={`tel:${company.phone_number.replace(/\s+/g, "")}`} className="text-secondary underline decoration-primary underline-offset-4 transition-colors duration-200 hover:text-primary">
                          {company.phone_number}
                        </a>
                      </>
                    ) : null}
                    {company.email ? (
                      <>
                        <br />
                        <a href={`mailto:${company.email}`} className="text-secondary underline decoration-primary underline-offset-4 transition-colors duration-200 hover:text-primary">
                          {company.email}
                        </a>
                      </>
                    ) : null}
                  </address>
                  <h3 className="eyebrow mt-10 text-sm text-secondary">Öffnungszeiten</h3>
                  <dl data-slot="hours" className="mt-4 max-w-sm">
                    {weekHours(company.opening_hours, SITE_LANGUAGE).map((day) => (
                      <div key={day.day} className="flex justify-between gap-6 border-b border-text-primary/20 py-2">
                        <dt>{day.name}</dt>
                        <dd className="text-secondary">{day.ranges.length ? `${day.ranges.join(", ")} Uhr` : "geschlossen"}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    {reservations ? (
                      <Link href={localizedPath("reservations", SITE_LANGUAGE)} className="btn">
                        Reservieren
                      </Link>
                    ) : null}
                    {address ? (
                      <a href={mapsUrl(`${company.name}, ${address}`)} target="_blank" rel="noopener noreferrer" data-slot="route-link" className="btn btn-outline">
                        Route
                      </a>
                    ) : null}
                  </div>
                </div>
                <div>
                  <LocationMap
                    apiKey={project?.google_maps_api_key}
                    address={address}
                    language={SITE_LANGUAGE}
                    title={company.name}
                    consentLabel={legal?.consent_banner.settings ?? ""}
                  />
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
