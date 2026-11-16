import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { LocationHours } from "@/components/site/hours-board"
import { mapsUrl } from "@/lib/hours"
import { groupedHours } from "@/lib/hours-groups"
import { reservationLink } from "@/lib/nav"
import type { Company, Project } from "@/lib/studio-api"

export function Locations({ project, companies }: { project: Project | null; companies: Company[] }) {
  const reserve = reservationLink(project)

  return (
    <section aria-labelledby="standorte-heading" className="px-5 py-28 sm:px-8 lg:px-10 lg:py-44">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="text-center">
          <p className="label text-accent">Besuche uns</p>
          <h2 id="standorte-heading" className="display-caps mt-6 text-2xl sm:text-4xl">
            Standorte
          </h2>
        </Reveal>

        {companies.length === 0 ? <p className="mx-auto mt-12 max-w-[32rem] text-center text-lg leading-relaxed">Unsere Standorte und Öffnungszeiten findest du hier in Kürze.</p> : null}

        <div className="mt-20 grid gap-20 md:grid-cols-2 md:gap-16">
          {companies.map((company, index) => {
            const city = [company.zip_code, company.city].filter(Boolean).join(" ")
            const address = [company.address, city].filter(Boolean).join(", ")
            return (
              <Reveal key={company.uuid} index={index}>
                <article className="flex h-full flex-col">
                  <h3 className="display-caps text-lg sm:text-xl">{company.name}</h3>
                  <address className="mt-6 not-italic leading-relaxed">
                    {company.address}
                    <br />
                    {city}
                    {company.phone_number ? (
                      <>
                        <br />
                        <a href={`tel:${company.phone_number.replace(/\s+/g, "")}`} className="hover:text-accent">
                          {company.phone_number}
                        </a>
                      </>
                    ) : null}
                  </address>
                  <div className="mt-8">
                    <LocationHours timezone={company.timezone} groups={groupedHours(company)} />
                  </div>
                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    {address ? (
                      <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" className="link-thin">
                        Route
                      </a>
                    ) : null}
                    {reserve ? (
                      <Link href={reserve.href} className="btn">
                        Tisch reservieren
                      </Link>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
