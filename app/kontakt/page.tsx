import type { Metadata } from "next"

import { PageIntro } from "@/components/site/page-intro"
import { mapsUrl } from "@/lib/hours"
import { CONTACT_PATH } from "@/lib/nav"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  return pageMetadata({
    title: `${name} – Kontakt`,
    description: `So erreichst du die ${name}: Telefon, E-Mail und Adressen unserer Standorte in Berlin.`,
    path: CONTACT_PATH,
  })
}

export default async function ContactPage() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const instagram = project?.socials?.instagram

  return (
    <main className="pb-32">
      <PageIntro kicker="Wir freuen uns auf dich" title="Kontakt">
        <p>Ruf uns an, schreib uns oder komm einfach vorbei.</p>
      </PageIntro>
      {companies?.length ? null : <p className="mx-auto max-w-[32rem] px-5 text-center text-lg leading-relaxed">Unsere Kontaktdaten findest du hier in Kürze.</p>}
      <div className="mx-auto grid max-w-[1000px] gap-16 px-5 sm:px-8 md:grid-cols-2">
        {(companies ?? []).map((company) => {
          const address = [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")
          return (
            <section key={company.uuid} className="border-t border-accent/40 pt-10">
              <h2 className="display-caps text-lg sm:text-xl">{company.name}</h2>
              <address className="mt-6 text-lg not-italic leading-loose">
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
              {address ? (
                <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" className="link-thin mt-8">
                  Route
                </a>
              ) : null}
            </section>
          )
        })}
      </div>
      {instagram ? (
        <p className="mt-20 text-center">
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="link-thin">
            Instagram
          </a>
        </p>
      ) : null}
    </main>
  )
}
