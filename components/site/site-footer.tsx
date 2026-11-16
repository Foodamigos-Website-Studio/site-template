import { LegalLinks } from "@/components/legal/legal-links"
import { FooterHours } from "@/components/site/footer-hours"
import { groupedHours } from "@/lib/hours-groups"
import { getCompanies, getProject } from "@/lib/studio-api"

export async function SiteFooter() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const locations = companies ?? []
  const instagram = project?.socials?.instagram

  return (
    <footer className="on-dark bg-ink px-5 pb-12 pt-24 sm:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-16 text-center">
        {locations.length ? (
          <div className="grid w-full gap-20 md:grid-cols-2 md:gap-16">
            {locations.map((company) => (
              <div key={company.uuid} className="flex flex-col items-center gap-10">
                <address className="display-caps text-sm not-italic leading-loose sm:text-base">
                  <span className="block">{company.name}</span>
                  <span className="mt-2 block">{company.address}</span>
                  <span className="block">{[company.zip_code, company.city].filter(Boolean).join(" ")}</span>
                </address>
                <FooterHours timezone={company.timezone} groups={groupedHours(company)} />
              </div>
            ))}
          </div>
        ) : null}

        {instagram ? (
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="link-thin">
            Instagram
          </a>
        ) : null}

        <div className="flex w-full flex-col items-center gap-5 border-t border-accent/30 pt-8">
          <LegalLinks className="label [&_a]:hover:text-accent [&_button]:hover:text-accent [&_ul]:flex [&_ul]:flex-wrap [&_ul]:justify-center [&_ul]:gap-x-8 [&_ul]:gap-y-2" />
          <span className="text-sm">
            © {new Date().getFullYear()} {project?.name}
          </span>
        </div>
      </div>
    </footer>
  )
}
