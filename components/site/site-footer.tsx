// The site's footer: design it like the inspiration. It must keep <LegalLinks /> (Impressum, privacy, cookies and the
// cookie settings) on every page.
import { LegalLinks } from "@/components/legal/legal-links"
import { getProject } from "@/lib/studio-api"

export async function SiteFooter() {
  const project = await getProject()
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm">© {new Date().getFullYear()} {project?.name}</span>
        <LegalLinks />
      </div>
    </footer>
  )
}
