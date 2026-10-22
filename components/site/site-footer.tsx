// The site's footer. Keeps <LegalLinks /> (Impressum, privacy, cookies and the cookie settings) on every page.
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { LegalLinks } from "@/components/legal/legal-links"
import { ButtonLink } from "@/components/ui/button-link"
import { Checker, WaveEdge } from "@/components/ui/decor"
import { SITE_LANGUAGE } from "@/lib/config"
import { mapsUrl, weekHours } from "@/lib/hours"
import { onlineShopOn } from "@/lib/modules"
import { localizedPath } from "@/lib/localized-routes"
import { fullAddress, ORDER_PATH, primaryFirst } from "@/lib/restaurant"
import { getCompanies, getProject } from "@/lib/studio-api"

const SOCIAL_LABELS: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" }

export async function SiteFooter() {
  const [project, allCompanies] = await Promise.all([getProject(), getCompanies()])
  const companies = primaryFirst(project, allCompanies)
  const socials = Object.entries(project?.socials ?? {}).filter(([, url]) => Boolean(url))

  return (
    <footer className="texture-dots relative overflow-x-clip pb-28 text-background md:pb-0">
      <WaveEdge className="text-background" />
      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-24 sm:px-10 sm:pt-28">
        <Reveal className="flex flex-col items-center gap-8 text-center">
          <p className="font-heading text-[56px] uppercase leading-[0.9] sm:text-[80px]">Hungry?</p>
          {onlineShopOn(project) ? <ButtonLink href={ORDER_PATH}>Order online</ButtonLink> : null}
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {companies?.length ? (
            <>
              <Reveal index={0}>
                <h2 className="mb-4 font-heading text-2xl uppercase">Find us</h2>
                <ul className="flex flex-col gap-5">
                  {companies.map((company) => (
                    <li key={company.uuid}>
                      <p className="font-bold">{company.name}</p>
                      <address className="not-italic leading-relaxed">
                        {fullAddress(company)}
                        {company.phone_number ? (
                          <>
                            <br />
                            <a href={`tel:${company.phone_number.replace(/\s+/g, "")}`} className="underline underline-offset-4 hover:text-primary">
                              {company.phone_number}
                            </a>
                          </>
                        ) : null}
                      </address>
                      <a
                        href={mapsUrl(fullAddress(company))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold uppercase underline underline-offset-4 hover:text-primary"
                      >
                        Route
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal index={1}>
                <h2 className="mb-4 font-heading text-2xl uppercase">Opening hours</h2>
                <ul className="flex flex-col gap-5">
                  {companies.map((company) => (
                    <li key={company.uuid}>
                      <p className="mb-1 font-bold">{company.name}</p>
                      <dl className="grid grid-cols-[auto_1fr] gap-x-4 text-sm leading-relaxed">
                        {weekHours(company.opening_hours, SITE_LANGUAGE).map((day) => (
                          <div key={day.day} className="contents">
                            <dt>{day.name}</dt>
                            <dd>{day.ranges.length ? day.ranges.join(", ") : "Closed"}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </>
          ) : null}

          <Reveal index={2}>
            <h2 className="mb-4 font-heading text-2xl uppercase">Order and more</h2>
            <ul className="flex flex-col gap-2 font-bold">
              {onlineShopOn(project) ? (
                <li>
                  <a href={ORDER_PATH} className="underline underline-offset-4 hover:text-primary">
                    Order online
                  </a>
                </li>
              ) : null}
              <li>
                <Link href={localizedPath("our-menu", SITE_LANGUAGE)} className="underline underline-offset-4 hover:text-primary">
                  Our menu
                </Link>
              </li>
              <li>
                <Link href={localizedPath("location-and-hours", SITE_LANGUAGE)} className="underline underline-offset-4 hover:text-primary">
                  Locations and hours
                </Link>
              </li>
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                    {SOCIAL_LABELS[key] ?? key}
                  </a>
                </li>
              ))}
            </ul>
            <LegalLinks className="mt-6 text-sm [&_button]:underline [&_button]:underline-offset-4 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary [&_button:hover]:text-primary [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2" />
          </Reveal>
        </div>
      </div>

      <Checker />
      <div className="mx-auto max-w-[1440px] px-6 py-6 text-center text-sm sm:px-10 sm:text-left">
        © {new Date().getFullYear()} {project?.name}
      </div>
    </footer>
  )
}
