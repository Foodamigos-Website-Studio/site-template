import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"
import { fullAddress } from "@/components/home/locations-block"
import { Reveal } from "@/components/reveal"
import { CtaLink } from "@/components/site/cta"
import { onlineShopOn } from "@/lib/modules"
import { seoDescription, seoTitle } from "@/lib/page-text"
import { ROUTES, telHref } from "@/lib/routes"
import { mapsUrl } from "@/lib/hours"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  return pageMetadata({
    title: seoTitle(project, companies, "Kontakt"),
    description: seoDescription(project, companies, "Telefon, E-Mail und Adresse. Schreib uns eine Nachricht oder bestell direkt online"),
    path: ROUTES.contact,
  })
}

const link = "underline underline-offset-4 transition-colors duration-[150ms] ease-in-out hover:text-secondary"

export default async function KontaktPage() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const shopOn = onlineShopOn(project)

  return (
    <>
      <section className="bg-hero-background pb-16 pt-8 md:pb-24">
        <div className="container-x">
          <h1 className="display-heading hero-in text-[clamp(3.5rem,13vw,11rem)] text-background">Kontakt</h1>
          <p className="hero-in mt-4 max-w-2xl text-lg leading-relaxed text-secondary" style={{ ["--i" as string]: 1 }}>
            Eine Frage, Lob oder eine Bestellung für die ganze Gruppe? Ruf uns an, schreib uns oder komm vorbei.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container-x flex flex-col gap-16">
          <ul className="grid gap-5 md:grid-cols-2">
            {(companies ?? []).map((company, index) => {
              const address = fullAddress(company)
              return (
                <li key={company.uuid} className="flex">
                  <Reveal index={index} className="flex w-full">
                    <article className="flex w-full flex-col items-start gap-4 rounded border-2 border-secondary bg-primary p-6 text-secondary md:p-8">
                      <h2 className="display-heading text-5xl md:text-7xl">{company.city ?? company.name}</h2>
                      <p className="font-heading text-2xl uppercase tracking-wide">{company.name}</p>
                      <ul className="flex flex-col gap-3 text-lg">
                        {company.phone_number ? (
                          <li className="flex items-center gap-3">
                            <Phone className="size-5 shrink-0" aria-hidden="true" />
                            <a href={telHref(company.phone_number)} className={link}>
                              {company.phone_number}
                            </a>
                          </li>
                        ) : null}
                        {company.email ? (
                          <li className="flex items-center gap-3">
                            <Mail className="size-5 shrink-0" aria-hidden="true" />
                            <a href={`mailto:${company.email}`} className={link}>
                              {company.email}
                            </a>
                          </li>
                        ) : null}
                        {address ? (
                          <li className="flex items-start gap-3">
                            <MapPin className="mt-1 size-5 shrink-0" aria-hidden="true" />
                            <span className="flex flex-col">
                              <address className="not-italic">{address}</address>
                              <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" className={link}>
                                Route
                              </a>
                            </span>
                          </li>
                        ) : null}
                      </ul>
                    </article>
                  </Reveal>
                </li>
              )
            })}
          </ul>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <h2 className="display-heading text-[clamp(3rem,7vw,6rem)] text-secondary">Schreib uns</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed">
                Wir melden uns so schnell wie möglich. Hunger? Dann geht&apos;s online noch schneller.
              </p>
              {shopOn ? (
                <div className="mt-6">
                  <CtaLink href={ROUTES.shop}>Jetzt bestellen</CtaLink>
                </div>
              ) : null}
            </Reveal>
            <Reveal index={1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
