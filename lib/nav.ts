import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { giftCardsOn, reservationsOn } from "@/lib/modules"
import type { Project } from "@/lib/studio-api"

export const ORDER_PATH = "/menu"
export const ABOUT_PATH = "/ueber-uns"
export const CONTACT_PATH = "/kontakt"

export function sitePaths() {
  return {
    menu: localizedPath("our-menu", SITE_LANGUAGE),
    locations: localizedPath("location-and-hours", SITE_LANGUAGE),
    reservations: localizedPath("reservations", SITE_LANGUAGE),
    giftCards: localizedPath("gift-cards", SITE_LANGUAGE),
    order: ORDER_PATH,
    about: ABOUT_PATH,
    contact: CONTACT_PATH,
  }
}

export type NavLink = { href: string; label: string }

/** The main navigation: module pages only when their module is on. */
export function mainNav(project: Project | null): NavLink[] {
  const paths = sitePaths()
  return [
    { href: paths.menu, label: "Menü" },
    { href: paths.locations, label: "Standorte" },
    ...(giftCardsOn(project) ? [{ href: paths.giftCards, label: "Gutscheine" }] : []),
    { href: paths.about, label: "Über uns" },
  ]
}

export function reservationLink(project: Project | null): NavLink | null {
  return reservationsOn(project) && project?.reservation_url ? { href: sitePaths().reservations, label: "Tisch reservieren" } : null
}
