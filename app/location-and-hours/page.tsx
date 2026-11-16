import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LocationMap } from "@/components/locations/location-map"
import { PageIntro } from "@/components/site/page-intro"
import { SITE_LANGUAGE } from "@/lib/config"
import { isOpenNow, mapsUrl, weekHours } from "@/lib/hours"
import { localizedPath } from "@/lib/localized-routes"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getLegal, getProject, type Company } from "@/lib/studio-api"

const fullAddress = (company: Company) => [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  return pageMetadata({
    title: `${name} – Standorte und Öffnungszeiten`,
    description: `Adressen, Telefonnummern und Öffnungszeiten der ${name} in Berlin.`,
    path: localizedPath("location-and-hours", SITE_LANGUAGE),
  })
}

export default async function LocationsPage() {
  const [project, companies, legal] = await Promise.all([getProject(), getCompanies(), getLegal()])
  if (!companies?.length) notFound()
  return (
    <main data-slot="locations" className="pb-32">
      <PageIntro kicker="Besuche uns" title="Standorte" />
      <div className="mx-auto flex max-w-[1240px] flex-col gap-28 px-5 sm:px-8">
        {companies.map((company) => {
          const address = fullAddress(company)
          const open = isOpenNow(company.opening_hours, company.timezone)
          return (
            <article key={company.uuid} id={company.slug} data-slot="location" data-open={open || undefined} className="grid scroll-mt-20 gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="label text-accent">{open ? "Gerade geöffnet" : "Aktuell geschlossen"}</span>
                <h2 className="display-caps mt-4 text-xl sm:text-3xl">{company.name}</h2>
                <address className="mt-6 text-lg not-italic leading-relaxed">
                  {address}
                  {company.phone_number ? (
                    <>
                      <br />
                      <a className="hover:text-accent" href={`tel:${company.phone_number.replace(/\s+/g, "")}`}>
                        {company.phone_number}
                      </a>
                    </>
                  ) : null}
                  {company.email ? (
                    <>
                      <br />
                      <a className="hover:text-accent" href={`mailto:${company.email}`}>
                        {company.email}
                      </a>
                    </>
                  ) : null}
                </address>
                <dl data-slot="hours" className="mt-8 max-w-[26rem]">
                  {weekHours(company.opening_hours, SITE_LANGUAGE).map((day) => (
                    <div key={day.day} className="flex justify-between gap-4 border-b border-accent/30 py-2 text-sm">
                      <dt>{day.name}</dt>
                      <dd>{day.ranges.length ? day.ranges.join(", ") : "geschlossen"}</dd>
                    </div>
                  ))}
                </dl>
                {address ? (
                  <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" data-slot="route-link" className="link-thin mt-10">
                    Route
                  </a>
                ) : null}
              </div>
              <div className="min-h-[20rem]">
                <LocationMap apiKey={project?.google_maps_api_key} address={address} language={SITE_LANGUAGE} title={company.name} consentLabel={legal?.consent_banner.settings ?? ""} />
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
