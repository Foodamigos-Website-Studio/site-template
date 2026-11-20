// The site's header: design it like the inspiration (logo, navigation, the "Order online" link to /menu when the
// online shop module is on). A placeholder until v0 builds it; the menu item ("Speisekarte") always links to /menu.
// The menu (the mobile menu too) keeps <SocialLinks />: an icon per set social profile, nothing when none is set.
import Link from "next/link"

import { SocialLinks } from "@/components/site/social-links"

import { SITE_LANGUAGE } from "@/lib/config"
import { siteNavigation } from "@/lib/navigation"
import { getProject } from "@/lib/studio-api"

export async function SiteHeader() {
  const project = await getProject()
  const items = siteNavigation(SITE_LANGUAGE, project)
  return (
    <header>
      <div>
        <Link href="/">
          {project?.name}
        </Link>
      </div>
      {items.length > 0 ? (
        <nav>
          {items.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
      <SocialLinks socials={project?.socials} slot="menu-social-links" />
    </header>
  )
}
