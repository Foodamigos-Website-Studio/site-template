import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { CtaLink } from "@/components/site/cta"
import { StatusPill } from "@/components/site/status-pill"
import { SITE_LANGUAGE } from "@/lib/config"
import { mapsUrl } from "@/lib/hours"
import { openStatus, todayHours } from "@/lib/open-status"
import { ROUTES, telHref } from "@/lib/routes"
import type { Company } from "@/lib/studio-api"

export const fullAddress = (company: Company) =>
  [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")

const textLink = "underline underline-offset-4 transition-colors duration-[150ms] ease-in-out hover:text-primary"

export function LocationsBlock({ companies, shopOn }: { companies: Company[]; shopOn: boolean }) {
  if (companies.length === 0) return null
  return (
    <section className="bg-secondary py-20 text-background md:py-28">
      <div className="container-x flex flex-col gap-14">
        <Reveal>
          <h2 className="display-heading text-[clamp(3.25rem,9vw,8rem)] text-background">Hier findest du uns</h2>
        </Reveal>
        <ul className="grid gap-12 md:grid-cols-2">
          {companies.map((company, index) => {
            const address = fullAddress(company)
            const status = openStatus(company.opening_hours, company.timezone, SITE_LANGUAGE)
            const hours = todayHours(company, SITE_LANGUAGE)
            return (
              <li key={company.uuid}>
                <Reveal index={index}>
                  <article className="flex flex-col items-start gap-4 border-t-4 border-primary pt-6">
                    <h3 className="display-heading text-[clamp(4rem,9vw,7.5rem)] text-primary">{company.city ?? company.name}</h3>
                    <p className="font-heading text-2xl uppercase tracking-wide">{company.name}</p>
                    <address className="flex flex-col gap-1 text-lg not-italic">
                      <span>{address}</span>
                      {address ? (
                        <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" className={textLink}>
                          Route
                        </a>
                      ) : null}
                      {company.phone_number ? (
                        <a href={telHref(company.phone_number)} className={textLink}>
                          {company.phone_number}
                        </a>
                      ) : null}
                    </address>
                    {hours ? (
                      <p className="text-base">
                        Heute: <strong>{hours} Uhr</strong>
                      </p>
                    ) : null}
                    {status ? <StatusPill status={status} className="border-background" /> : null}
                    {shopOn ? (
                      <CtaLink href={ROUTES.shop} variant="onDark" size="md">
                        Bestellen
                      </CtaLink>
                    ) : null}
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ul>
        <Link href={ROUTES.locations} className="self-start font-heading text-3xl uppercase tracking-wide text-primary underline underline-offset-8 transition-colors duration-[150ms] ease-in-out hover:text-background">
          Alle Standorte &amp; Öffnungszeiten
        </Link>
      </div>
    </section>
  )
}
