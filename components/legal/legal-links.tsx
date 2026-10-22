// The legal links every page's footer shows: Impressum, privacy policy, cookie policy and cookie settings. Put it in
// the site's footer and style it; never remove a link.
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button"
import { getLegal } from "@/lib/studio-api"

export async function LegalLinks({ className }: { className?: string }) {
  const legal = await getLegal()
  if (!legal) return null
  return (
    <nav aria-label="Legal" className={className} data-slot="legal-links">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {legal.pages.map((page) => (
          <li key={page.page}>
            <a href={page.slug} className="hover:underline">
              {page.label}
            </a>
          </li>
        ))}
        <li>
          <CookieSettingsButton label={legal.consent_banner.settings} className="hover:underline" />
        </li>
      </ul>
    </nav>
  )
}
