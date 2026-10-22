import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LocationMap } from "@/components/locations/location-map"
import { Reveal } from "@/components/reveal"
import { ButtonLink } from "@/components/ui/button-link"
import { PageHero } from "@/components/ui/page-hero"
import { SITE_LANGUAGE } from "@/lib/config"
import { isOpenNow, mapsUrl, weekHours } from "@/lib/hours"
import { localizedPath } from "@/lib/localized-routes"
import { onlineShopOn } from "@/lib/modules"
import { fullAddress, ORDER_PATH, primaryCompany, primaryFirst } from "@/lib/restaurant"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getLegal, getProject } from "@/lib/studio-api"
import { cn } from "@/lib/utils"

export async function generateMetadata(): Promise<Metadata> {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const city = primaryCompany(project, companies)?.city ?? ""
  return pageMetadata({
    title: `${project?.name ?? "Locations"} – Locations in ${city || "town"}`,
    description: `Find ${project?.name ?? "us"}${city ? ` in ${city}` : ""}: address, phone, opening hours and route for our burger shop. Pickup, delivery or eat in.`,
    path: localizedPath("location-and-hours", SITE_LANGUAGE),
  })
}

export default async function LocationsPage() {
  const [project, allCompanies, legal] = await Promise.all([getProject(), getCompanies(), getLegal()])
  if (!allCompanies?.length) notFound()
  const companies = primaryFirst(project, allCompanies)
  const orderOn = onlineShopOn(project)
  const now = new Date()

  return (
    <>
      <PageHero title="Find us">
        Come by for a smash burger, or order online for pickup and delivery from {project?.name}.
      </PageHero>
      <section data-slot="locations" className="bg-background pb-24 pt-16 sm:pt-20">
        <ul className="mx-auto flex max-w-[1160px] flex-col gap-12 px-6">
          {companies.map((company) => {
            const address = fullAddress(company)
            const open = isOpenNow(company.opening_hours, company.timezone, now)
            return (
              <li key={company.uuid}>
                <Reveal>
                  <article
                    data-slot="location"
                    data-open={open || undefined}
                    className="grid gap-8 rounded-[7px] border-2 border-charcoal bg-background p-6 shadow-[8px_8px_0_0_var(--color-primary)] sm:p-10 lg:grid-cols-2"
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h2 className="font-heading text-3xl uppercase leading-none sm:text-5xl">{company.name}</h2>
                        <span
                          className={cn(
                            "rounded-[7px] border-2 border-charcoal px-3 py-1 text-xs font-bold uppercase",
                            open ? "bg-primary text-background" : "bg-background text-charcoal",
                          )}
                        >
                          {open ? "Open now" : "Closed now"}
                        </span>
                      </div>
                      <address className="not-italic text-lg leading-relaxed">
                        {address}
                        {company.phone_number ? (
                          <>
                            <br />
                            <a href={`tel:${company.phone_number.replace(/\s+/g, "")}`} className="font-bold underline underline-offset-4 hover:text-primary">
                              {company.phone_number}
                            </a>
                          </>
                        ) : null}
                        {company.email ? (
                          <>
                            <br />
                            <a href={`mailto:${company.email}`} className="underline underline-offset-4 hover:text-primary">
                              {company.email}
                            </a>
                          </>
                        ) : null}
                      </address>
                      <dl data-slot="hours" className="divide-y-2 divide-charcoal/10 border-y-2 border-charcoal/10">
                        {weekHours(company.opening_hours, SITE_LANGUAGE).map((day) => (
                          <div key={day.day} className="flex justify-between gap-4 py-2">
                            <dt className="font-bold">{day.name}</dt>
                            <dd>{day.ranges.length ? day.ranges.join(", ") : "–"}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="flex flex-wrap gap-3">
                        {orderOn ? (
                          <ButtonLink href={ORDER_PATH} size="md">
                            Order now
                          </ButtonLink>
                        ) : null}
                        {address ? (
                          <ButtonLink href={mapsUrl(address)} variant="charcoal" size="md" external>
                            Route
                          </ButtonLink>
                        ) : null}
                      </div>
                    </div>
                    <div className="min-h-72 overflow-hidden rounded-[7px] border-2 border-charcoal bg-muted [&_iframe]:h-full [&_iframe]:min-h-72 [&_iframe]:w-full [&_iframe]:border-0">
                      <LocationMap
                        apiKey={project?.google_maps_api_key}
                        address={address}
                        language={SITE_LANGUAGE}
                        title={company.name}
                        consentLabel={legal?.consent_banner.settings ?? ""}
                      />
                    </div>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
