import Link from "next/link"
import { Mail, Phone } from "lucide-react"

import { LegalLinks } from "@/components/legal/legal-links"
import { onlineShopOn } from "@/lib/modules"
import { mainCompany } from "@/lib/open-status"
import { ROUTES, telHref } from "@/lib/routes"
import { getCompanies, getProject } from "@/lib/studio-api"

import { CtaLink } from "./cta"

const SOCIAL_LABELS: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" }

const footerLink = "underline-offset-4 transition-colors duration-[150ms] ease-in-out hover:text-primary hover:underline"

export async function SiteFooter() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const company = mainCompany(project, companies)
  const email = company?.email ?? company?.business_profile?.email ?? null
  const phone = company?.phone_number ?? null
  const socials = Object.entries(project?.socials ?? {}).filter(([key, url]) => SOCIAL_LABELS[key] && url)
  const year = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-background" data-slot="site-footer">
      <div className="container-x flex flex-col gap-10 py-14 md:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <p className="display-heading text-5xl text-primary md:text-6xl">{project?.name}</p>
            <ul className="flex flex-col gap-2 text-base md:flex-row md:flex-wrap md:items-center md:gap-x-8">
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className={`flex items-center gap-2 ${footerLink}`}>
                    <Mail className="size-4" aria-hidden="true" />
                    {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a href={telHref(phone)} className={`flex items-center gap-2 ${footerLink}`}>
                    <Phone className="size-4" aria-hidden="true" />
                    {phone}
                  </a>
                </li>
              ) : null}
              <li>
                <Link href={ROUTES.contact} className={footerLink}>
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href={ROUTES.locations} className={footerLink}>
                  Standorte
                </Link>
              </li>
              <li>
                <Link href={ROUTES.about} className={footerLink}>
                  Über uns
                </Link>
              </li>
            </ul>
            {socials.length > 0 ? (
              <ul className="flex flex-wrap gap-3" aria-label="Social Media">
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded border-2 border-primary px-3 py-1 text-sm font-bold text-primary transition-colors duration-[150ms] ease-in-out hover:bg-primary hover:text-secondary"
                    >
                      {SOCIAL_LABELS[key]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {onlineShopOn(project) ? (
            <CtaLink href={ROUTES.shop} variant="onDark" size="lg" className="self-start lg:self-auto">
              Jetzt bestellen
            </CtaLink>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-background/25 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <LegalLinks className="[&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:duration-[150ms] [&_a:hover]:text-primary [&_a:hover]:underline [&_button]:underline-offset-4 [&_button]:transition-colors [&_button]:duration-[150ms] [&_button:hover]:text-primary [&_button:hover]:underline [&_ul]:flex [&_ul]:flex-wrap [&_ul]:gap-x-6 [&_ul]:gap-y-2" />
          <p>
            © {year} {project?.name}. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}
