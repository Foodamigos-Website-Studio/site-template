// The site's footer: design it like the inspiration. It must keep <LegalLinks /> (Impressum, privacy, cookies and the
// cookie settings) on every page.
import { LegalLinks } from "@/components/legal/legal-links"
import { getProject } from "@/lib/studio-api"

export async function SiteFooter() {
  const project = await getProject()
  return (
    <footer>
      <div>
        <span>© {new Date().getFullYear()} {project?.name}</span>
        <LegalLinks />
      </div>
    </footer>
  )
}
