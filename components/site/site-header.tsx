import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

import { SITE_LANGUAGE } from "@/lib/config"
import { onlineShopOn } from "@/lib/modules"
import { mainCompany, openStatus } from "@/lib/open-status"
import { ROUTES, telHref } from "@/lib/routes"
import { getCompanies, getProject } from "@/lib/studio-api"
import { cn } from "@/lib/utils"

import { CtaLink } from "./cta"
import { MobileNav } from "./mobile-nav"
import { StatusPill } from "./status-pill"

const linkClass =
  "font-heading text-xl uppercase tracking-wide text-secondary underline-offset-8 transition-colors duration-[150ms] ease-in-out hover:text-background hover:underline"

export async function SiteHeader() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const company = mainCompany(project, companies)
  const status = company ? openStatus(company.opening_hours, company.timezone, SITE_LANGUAGE) : null
  const shopOn = onlineShopOn(project)
  const name = project?.name ?? ""
  const phone = company?.phone_number ?? null

  const links = [
    { href: ROUTES.about, label: "Über uns" },
    ...(shopOn ? [{ href: ROUTES.shop, label: "Speisekarte" }] : []),
    { href: ROUTES.locations, label: "Standorte" },
    { href: ROUTES.contact, label: "Kontakt" },
  ]

  const wordmark = project?.logo_url ? (
    <Image src={project.logo_url} alt={name} width={180} height={64} className="h-12 w-auto lg:h-14" priority unoptimized />
  ) : (
    <span className="display-heading block text-[2rem] text-secondary sm:text-4xl xl:text-[2.6rem]">{name}</span>
  )

  return (
    <header className="relative z-30 bg-hero-background" data-slot="site-header">
      <div className="container-x flex h-20 items-center justify-between xl:grid xl:h-28 xl:grid-cols-[1fr_auto_1fr]">
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-6 whitespace-nowrap xl:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} prefetch={link.href !== ROUTES.shop} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href={ROUTES.home} aria-label={`${name} – Startseite`} className="shrink-0 text-center">
          {wordmark}
        </Link>

        <div className="hidden items-center justify-end gap-4 xl:flex">
          {phone ? (
            <a href={telHref(phone)} className={cn(linkClass, "flex items-center gap-2 no-underline")} aria-label={`Anrufen: ${phone}`}>
              <Phone className="size-5" aria-hidden="true" />
              <span>Anrufen</span>
              <span className="sr-only">{phone}</span>
            </a>
          ) : null}
          {status ? <StatusPill status={status} /> : null}
          {shopOn ? (
            <CtaLink href={ROUTES.shop} size="sm">
              Jetzt bestellen
            </CtaLink>
          ) : null}
        </div>

        <div className="flex items-center gap-3 xl:hidden">
          {shopOn ? (
            <CtaLink href={ROUTES.shop} size="sm" className="hidden sm:inline-flex">
              Jetzt bestellen
            </CtaLink>
          ) : null}
          <MobileNav
            links={links}
            phone={phone}
            status={status}
            orderHref={shopOn ? ROUTES.shop : null}
          />
        </div>
      </div>
    </header>
  )
}
