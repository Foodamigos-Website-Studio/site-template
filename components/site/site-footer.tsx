import Link from "next/link"

import { LegalLinks } from "@/components/legal/legal-links"
import { giftCardsOn } from "@/lib/modules"
import { groupedHours, shortLocationName } from "@/lib/hours-groups"
import { mapsUrl } from "@/lib/hours"
import { reservationLink, sitePaths } from "@/lib/nav"
import { getCompanies, getProject } from "@/lib/studio-api"

import { HoursBoard } from "./hours-board"

export async function SiteFooter() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const paths = sitePaths()
  const reserve = reservationLink(project)
  const locations = companies ?? []
  const instagram = project?.socials?.instagram
  const facebook = project?.socials?.facebook
  const tiktok = project?.socials?.tiktok

  const links = [
    { href: paths.menu, label: "Speisekarte" },
    { href: paths.order, label: "Jetzt bestellen" },
    ...(reserve ? [reserve] : []),
    ...(giftCardsOn(project) ? [{ href: paths.giftCards, label: "Gutscheine" }] : []),
    { href: paths.locations, label: "Standorte" },
    { href: paths.about, label: "Über uns" },
    { href: paths.contact, label: "Kontakt" },
  ]

  return (
    <footer data-section="11" className="border-t border-text-primary/20 px-5 pb-10 pt-16 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-14">
        <div>
          <h2 className="label">Besuche uns</h2>
          <p className="display mt-2 text-3xl sm:text-5xl">Öffnungszeiten</p>
          <div className="mt-8">
            <HoursBoard
              todayLabel="Heute"
              locations={locations.map((company) => ({
                slug: company.slug,
                name: shortLocationName(company, project?.name),
                timezone: company.timezone,
                groups: groupedHours(company),
              }))}
            />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-6 md:col-span-2 md:flex-row md:gap-14">
            {locations.map((company) => {
              const address = [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")
              return (
                <address key={company.uuid} className="not-italic">
                  <p className="display text-2xl">{shortLocationName(company, project?.name)}</p>
                  <p className="mt-2 text-base leading-relaxed">
                    {company.address}
                    <br />
                    {[company.zip_code, company.city].filter(Boolean).join(" ")}
                    {company.phone_number ? (
                      <>
                        <br />
                        <a href={`tel:${company.phone_number.replace(/\s+/g, "")}`} className="underline underline-offset-4 hover:opacity-70">
                          {company.phone_number}
                        </a>
                      </>
                    ) : null}
                  </p>
                  {address ? (
                    <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" className="label mt-3 inline-block text-xs underline underline-offset-4 hover:opacity-70">
                      Route
                    </a>
                  ) : null}
                </address>
              )
            })}
          </div>
          <nav aria-label="Seiten" className="grid grid-cols-2 gap-x-6 gap-y-2 text-lg md:grid-cols-1">
            {links.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="hover:opacity-60">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 border-t border-text-primary/20 pt-6 text-base md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="label text-xs">Folge uns</span>
            {instagram ? (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:opacity-60">
                Instagram
              </a>
            ) : null}
            {facebook ? (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:opacity-60">
                Facebook
              </a>
            ) : null}
            {tiktok ? (
              <a href={tiktok} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:opacity-60">
                TikTok
              </a>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <LegalLinks className="[&_button]:hover:opacity-60 [&_a]:hover:opacity-60 [&_ul]:flex [&_ul]:flex-wrap [&_ul]:gap-x-5 [&_ul]:gap-y-1" />
            <span className="text-sm">
              © {new Date().getFullYear()} {project?.name}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
