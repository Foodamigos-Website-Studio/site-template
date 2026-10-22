import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { onlineShopOn } from "@/lib/modules"
import { ORDER_PATH } from "@/lib/restaurant"
import { getCompanies, getMenu, getProject } from "@/lib/studio-api"

import { HeaderBar } from "./header-bar"

export async function SiteHeader() {
  const [project, companies, menu] = await Promise.all([getProject(), getCompanies(), getMenu()])
  const links = [
    { href: "/", label: "Home" },
    ...(menu?.companies.length ? [{ href: localizedPath("our-menu", SITE_LANGUAGE), label: "Menu" }] : []),
    ...(companies?.length ? [{ href: localizedPath("location-and-hours", SITE_LANGUAGE), label: "Locations" }] : []),
  ]
  return (
    <HeaderBar
      name={project?.name ?? ""}
      logoUrl={project?.logo_url ?? null}
      links={links}
      orderHref={onlineShopOn(project) ? ORDER_PATH : null}
    />
  )
}
