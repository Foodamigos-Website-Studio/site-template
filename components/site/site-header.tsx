import Link from "next/link"

import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { onlineShopOn, reservationsOn } from "@/lib/modules"
import { getProject } from "@/lib/studio-api"

import { HeaderMenu, type MenuLink } from "./header-menu"

export async function SiteHeader() {
  const project = await getProject()
  const name = project?.name ?? ""
  const reservations = reservationsOn(project)
  const shop = onlineShopOn(project)
  const reservationHref = localizedPath("reservations", SITE_LANGUAGE)

  const links: MenuLink[] = [
    { href: "/", label: "Start" },
    { href: localizedPath("our-menu", SITE_LANGUAGE), label: "Speisekarte" },
    { href: localizedPath("location-and-hours", SITE_LANGUAGE), label: "Standorte" },
    ...(reservations ? [{ href: reservationHref, label: "Reservieren" }] : []),
    ...(shop ? [{ href: "/menu", label: "Jetzt bestellen" }] : []),
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-height)] bg-secondary text-paper">
      <div className="mx-auto grid h-full max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
        <div className="flex items-center">
          <HeaderMenu links={links} name={name} />
        </div>
        <Link href="/" className="eyebrow whitespace-nowrap text-[0.6875rem] text-paper transition-colors duration-200 hover:text-primary sm:text-sm">
          {name}
        </Link>
        <div className="flex items-center justify-end gap-2 md:gap-3">
          {reservations ? (
            <Link href={reservationHref} className="btn btn-light btn-sm">
              Reservieren
            </Link>
          ) : null}
          {shop ? (
            <Link href="/menu" className="btn btn-sm hidden md:inline-flex">
              Jetzt bestellen
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}
