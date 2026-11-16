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
    description: `${name} in Berlin Mitte und Kreuzberg: Adressen, Telefonnummern und Öffnungszeiten unseres italienischen Restaurants mit hausgemachter Pasta.`,
    path: localizedPath("location-and-hours", SITE_LANGUAGE),
  })
}

export default async function LocationsPage() {
  const [project, companies, legal] = await Promise.all([getProject(), getCompanies(), getLegal()])
  if (!companies?.length) notFound()
  return (
    <main data-slot="locations" className="pb-24">
      <PageIntro kicker="Zwei Orte, ein Herz für gutes Essen" title="Standorte und Öffnungszeiten" />
      <div className="mx-auto flex max-w-[1240px] flex-col gap-20 px-5 sm:px-8">
        {companies.map((company) => {
          const address = fullAddress(company)
          const open = isOpenNow(company.opening_hours, company.timezone)
          return (
            <article key={company.uuid} id={company.slug} data-slot="location" data-open={open || undefined} className="grid scroll-mt-8 gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <span className="eyebrow">{open ? "Gerade geöffnet" : "Aktuell geschlossen"}</span>
                <h2 className="display mt-3 text-3xl sm:text-4xl">{company.name}</h2>
                <address className="mt-5 text-lg not-italic leading-relaxed">
                  {address}
                  {company.phone_number ? (
                    <>
                      <br />
                      <a className="underline underline-offset-4" href={`tel:${company.phone_number.replace(/\s+/g, "")}`}>
                        {company.phone_number}
                      </a>
                    </>
                  ) : null}
                  {company.email ? (
                    <>
                      <br />
                      <a className="underline underline-offset-4" href={`mailto:${company.email}`}>
                        {company.email}
                      </a>
                    </>
                  ) : null}
                </address>
                <dl data-slot="hours" className="mt-6 max-w-[26rem] text-lg">
                  {weekHours(company.opening_hours, SITE_LANGUAGE).map((day) => (
                    <div key={day.day} className="flex justify-between gap-4 border-b border-text-primary/15 py-2">
                      <dt>{day.name}</dt>
                      <dd>{day.ranges.length ? day.ranges.join(", ") : "geschlossen"}</dd>
                    </div>
                  ))}
                </dl>
                {address ? (
                  <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" data-slot="route-link" className="btn mt-8">
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
