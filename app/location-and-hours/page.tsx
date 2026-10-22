// Locations and opening hours: every location with its address, phone, email, today's status, the week's hours, a
// route link and the map (after consent). Data from the site API; unstyled default markup v0 may replace, keeping the
// data and helpers (lib/hours.ts, LocationMap).
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LocationMap } from "@/components/locations/location-map"
import { SITE_LANGUAGE } from "@/lib/config"
import { isOpenNow, mapsUrl, weekHours } from "@/lib/hours"
import { localizedPath } from "@/lib/localized-routes"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getLegal, getProject, type Company } from "@/lib/studio-api"

const fullAddress = (company: Company) => [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")

export async function generateMetadata(): Promise<Metadata> {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const city = companies?.[0]?.city ?? ""
  return pageMetadata({
    title: [project?.name, city].filter(Boolean).join(" – "),
    description: [project?.name, city, project?.tagline].filter(Boolean).join(" · "),
    path: localizedPath("location-and-hours", SITE_LANGUAGE),
  })
}

export default async function LocationsPage() {
  const [project, companies, legal] = await Promise.all([getProject(), getCompanies(), getLegal()])
  if (!companies?.length) notFound()
  return (
    <section data-slot="locations">
      <h1>{project?.name}</h1>
      {companies.map((company) => {
        const address = fullAddress(company)
        return (
          <article key={company.uuid} data-slot="location" data-open={isOpenNow(company.opening_hours, company.timezone) || undefined}>
            <h2>{company.name}</h2>
            <address>
              {address}
              {company.phone_number ? (
                <>
                  <br />
                  <a href={`tel:${company.phone_number.replace(/\s+/g, "")}`}>{company.phone_number}</a>
                </>
              ) : null}
              {company.email ? (
                <>
                  <br />
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </>
              ) : null}
            </address>
            <dl data-slot="hours">
              {weekHours(company.opening_hours, SITE_LANGUAGE).map((day) => (
                <div key={day.day}>
                  <dt>{day.name}</dt>
                  <dd>{day.ranges.length ? day.ranges.join(", ") : "–"}</dd>
                </div>
              ))}
            </dl>
            {address ? (
              <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" data-slot="route-link">
                Google Maps
              </a>
            ) : null}
            <LocationMap
              apiKey={project?.google_maps_api_key}
              address={address}
              language={SITE_LANGUAGE}
              title={company.name}
              consentLabel={legal?.consent_banner.settings ?? ""}
            />
          </article>
        )
      })}
    </section>
  )
}
