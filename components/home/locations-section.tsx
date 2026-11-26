import Link from "next/link"

import { SITE_LANGUAGE } from "@/lib/config"
import { localTime, mapsUrl, weekHours } from "@/lib/hours"
import { localizedPath } from "@/lib/localized-routes"
import { reservationsOn } from "@/lib/modules"
import { getCompanies, getProject } from "@/lib/studio-api"

export async function LocationsSection() {
  const [companies, project] = await Promise.all([getCompanies(), getProject()])
  if (!companies || companies.length === 0) return null
  const reservations = reservationsOn(project)

  return (
    <section aria-labelledby="locations-title" className="bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 id="locations-title" className="eyebrow text-balance text-center text-xl text-secondary md:text-3xl">
          Besuchen Sie uns in Berlin
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-center">
          Zwei Häuser, eine Familie: in Kreuzberg und in Mitte kochen wir täglich frische Pasta, backen Pizza im Holzofen und schenken italienische Weine aus.
        </p>

        <div className="mt-16 grid gap-px bg-text-primary/25 md:grid-cols-2">
          {companies.map((company) => {
            const now = localTime(new Date(), company.timezone)
            const today = weekHours(company.opening_hours, SITE_LANGUAGE).find((entry) => entry.day === now.day)
            const addressLine = [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")
            return (
              <article key={company.uuid} className="flex flex-col items-center bg-background px-6 py-12 text-center md:px-12">
                <h3 className="eyebrow text-balance text-lg text-secondary md:text-xl">{company.name}</h3>
                <address className="mt-6 not-italic">
                  {company.address ? <p className="text-secondary">{company.address}</p> : null}
                  <p className="text-secondary">{[company.zip_code, company.city].filter(Boolean).join(" ")}</p>
                </address>
                {company.phone_number ? (
                  <a
                    href={`tel:${company.phone_number}`}
                    className="mt-3 text-secondary underline decoration-primary underline-offset-4 transition-colors duration-200 hover:text-primary"
                  >
                    {company.phone_number}
                  </a>
                ) : null}
                <p className="mt-6 text-sm uppercase tracking-[0.18em]">
                  Heute{" "}
                  <span className="text-secondary">{today && today.ranges.length > 0 ? `${today.ranges.join(", ")} Uhr` : "geschlossen"}</span>
                </p>
                {addressLine ? (
                  <a
                    href={mapsUrl(`${company.name}, ${addressLine}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-sm uppercase tracking-[0.18em] text-secondary underline decoration-primary underline-offset-4 transition-colors duration-200 hover:text-primary"
                  >
                    Route
                  </a>
                ) : null}
                {company.google_place?.rating ? (
                  <p className="mt-6 text-sm">
                    Google {new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(company.google_place.rating)} von 5
                    {company.google_place.rates_count ? ` · ${company.google_place.rates_count} Bewertungen` : ""}
                  </p>
                ) : null}
              </article>
            )
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={localizedPath("location-and-hours", SITE_LANGUAGE)} className="btn btn-outline">
            Alle Standorte &amp; Zeiten
          </Link>
          {reservations ? (
            <Link href={localizedPath("reservations", SITE_LANGUAGE)} className="btn">
              Tisch reservieren
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
