// Whether a module's page and links exist: switched on in the brief (NEXT_PUBLIC_SITE_MODULES) and set up for the
// restaurant (the site API).
import { hasModule } from "./config"
import type { Project } from "./studio-api"

export function reservationsOn(project: Project | null): boolean {
  return hasModule("reservations") && Boolean(project?.has_reservations && project.reservation_url)
}

/** Gift cards are bought in the online shop's checkout under /menu: they need the online shop too. */
export function giftCardsOn(project: Project | null): boolean {
  return hasModule("gift_cards") && Boolean(project?.has_gift_cards) && onlineShopOn(project)
}

export function onlineShopOn(project: Project | null): boolean {
  return hasModule("online_shop") && Boolean(project?.has_online_shop && project.online_shop_url)
}
