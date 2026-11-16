// The site's default navigation, until v0 designs the header like the inspiration. The menu item opens the online
// shop under /menu (embedded on the site's real domain, forwarded to the shop everywhere else): the site has no menu
// page of its own, so "Speisekarte" never links anywhere else.
import { onlineShopOn } from "./modules"
import type { Project } from "./studio-api"

export type NavItem = { label: string; href: string }

const MENU_LABEL: Record<string, string> = { de: "Speisekarte", en: "Menu", fr: "Carte", es: "Carta", it: "Menù" }

/** The menu item: the shop under /menu, labelled in the site's language. */
export function menuNavItem(language: string): NavItem {
  return { label: MENU_LABEL[language] ?? MENU_LABEL.en, href: "/menu" }
}

/** The default navigation's items: the menu while the online shop is on. */
export function siteNavigation(language: string, project: Project | null): NavItem[] {
  return onlineShopOn(project) ? [menuNavItem(language)] : []
}
