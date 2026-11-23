// The site's footer: design it like the inspiration. It must keep <LegalLinks /> (Impressum, privacy, cookies and the
// cookie settings) on every page, and <SocialLinks /> (an icon per set social profile, nothing when none is set).
import { LegalLinks } from "@/components/legal/legal-links"
import { SocialLinks } from "@/components/site/social-links"
import { getProject } from "@/lib/studio-api"

export async function SiteFooter() {
  const project = await getProject()
  return (
    <footer>
      <div>
        <span>© {new Date().getFullYear()} {project?.name}</span>
        <SocialLinks socials={project?.socials} slot="footer-social-links" />
        <LegalLinks />
      </div>
    </footer>
  )
}
