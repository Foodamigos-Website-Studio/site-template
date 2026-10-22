import type { Metadata } from "next"

import { fullAddress } from "@/components/home/locations-block"
import { LocationMap } from "@/components/locations/location-map"
import { Reveal } from "@/components/reveal"
import { CtaLink } from "@/components/site/cta"
import { Marquee } from "@/components/site/marquee"
import { StatusPill } from "@/components/site/status-pill"
import { SITE_LANGUAGE } from "@/lib/config"
import { mapsUrl, weekHours } from "@/lib/hours"
import { onlineShopOn } from "@/lib/modules"
import { openStatus } from "@/lib/open-status"
import { seoDescription, seoTitle } from "@/lib/page-text"
import { ROUTES, telHref } from "@/lib/routes"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getLegal, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  return pageMetadata({
    title: seoTitle(project, companies, "Standorte & Öffnungszeiten"),
    description: seoDescription(project, companies, "Adressen, Öffnungszeiten und Karte unserer Burger-Standorte. Online bestellen"),
    path: ROUTES.locations,
  })
}

const textLink = "underline underline-offset-4 transition-colors duration-[150ms] ease-in-out hover:text-secondary"

export default async function StandortePage() {
  const [project, companies, legal] = await Promise.all([getProject(), getCompanies(), getLegal()])
  const shopOn = onlineShopOn(project)
  const today = new Date().getDay()

  return (
    <>
      <section className="bg-hero-background pb-16 pt-8 md:pb-24">
        <div className="container-x">
          <h1 className="display-heading hero-in text-[clamp(3.5rem,13vw,11rem)] text-background">Standorte</h1>
          <p className="hero-in mt-4 max-w-2xl text-lg leading-relaxed text-secondary" style={{ ["--i" as string]: 1 }}>
            Smash Burger, Hot Cheese Fries und Shakes: frisch gemacht an jedem unserer Standorte. Hier findest du Adressen,
            Öffnungszeiten und den Weg zu uns.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <ul className="container-x flex flex-col gap-24">
          {(companies ?? []).map((company, index) => {
            const address = fullAddress(company)
            const status = openStatus(company.opening_hours, company.timezone, SITE_LANGUAGE)
            return (
              <li key={company.uuid}>
                <article className="grid gap-10 lg:grid-cols-2">
                  <div className="flex flex-col items-start gap-5">
                    <Reveal>
                      <h2 className="display-heading text-[clamp(3.5rem,9vw,8rem)] text-secondary">{company.city ?? company.name}</h2>
                    </Reveal>
                    <Reveal index={1} className="flex flex-col items-start gap-3">
                      <p className="font-heading text-3xl uppercase tracking-wide text-secondary">{company.name}</p>
                      <address className="flex flex-col gap-1 text-lg not-italic text-secondary">
                        <span>{address}</span>
                        {company.phone_number ? (
                          <a href={telHref(company.phone_number)} className={textLink}>
                            {company.phone_number}
                          </a>
                        ) : null}
                        {address ? (
                          <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" className={textLink}>
                            Route mit Google Maps
                          </a>
                        ) : null}
                      </address>
                      {status ? <StatusPill status={status} /> : null}
                    </Reveal>
                    <Reveal index={2} className="w-full max-w-md">
                      <h3 className="mb-2 font-heading text-3xl uppercase tracking-wide text-secondary">Öffnungszeiten</h3>
                      <dl className="divide-y-2 divide-secondary/15 border-y-2 border-secondary/15 text-secondary">
                        {weekHours(company.opening_hours, SITE_LANGUAGE).map((day) => (
                          <div key={day.day} className={`flex justify-between gap-4 py-2 ${day.day === today ? "font-bold" : ""}`}>
                            <dt>{day.name}</dt>
                            <dd>{day.ranges.length ? day.ranges.join(", ") + " Uhr" : "Geschlossen"}</dd>
                          </div>
                        ))}
                      </dl>
                    </Reveal>
                    {shopOn ? (
                      <Reveal index={3}>
                        <CtaLink href={ROUTES.shop}>Jetzt bestellen</CtaLink>
                      </Reveal>
                    ) : null}
                  </div>
                  <Reveal index={index} className="h-[420px] overflow-hidden rounded border-4 border-secondary bg-hero-background lg:self-start [&_iframe]:size-full [&_button]:rounded [&_button]:border-2 [&_button]:border-secondary [&_button]:bg-primary [&_button]:px-6 [&_button]:py-3 [&_button]:font-heading [&_button]:text-2xl [&_button]:uppercase [&_button]:text-secondary">
                    <LocationMap
                      apiKey={project?.google_maps_api_key}
                      address={address}
                      language={SITE_LANGUAGE}
                      title={`Karte: ${company.name}, ${address}`}
                      consentLabel={legal?.consent_banner.settings ?? "Karte anzeigen"}
                    />
                  </Reveal>
                </article>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="overflow-hidden bg-background py-12 md:py-16">
        <div className="-mx-[5%] flex h-[150px] -rotate-2 items-center bg-secondary">
          <Marquee text="Zeit für deinen Burger!" className="w-full text-[clamp(3.5rem,8vw,6.5rem)] text-primary" />
        </div>
      </div>
    </>
  )
}
