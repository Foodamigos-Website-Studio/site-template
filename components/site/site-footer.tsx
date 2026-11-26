import Image from "next/image"
import Link from "next/link"

import { LegalLinks } from "@/components/legal/legal-links"
import { SITE_LANGUAGE } from "@/lib/config"
import { mapsUrl } from "@/lib/hours"
import { localizedPath } from "@/lib/localized-routes"
import { GALLERY_PHOTOS } from "@/lib/site-media"
import { getCompanies, getProject } from "@/lib/studio-api"

import { InstagramIcon } from "./instagram-icon"

export async function SiteFooter() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const instagram = project?.socials?.instagram
  const tiles = [
    { photo: GALLERY_PHOTOS[1], href: localizedPath("our-menu", SITE_LANGUAGE), label: "Speisekarte" },
    { photo: GALLERY_PHOTOS[0], href: localizedPath("location-and-hours", SITE_LANGUAGE), label: "Standorte" },
  ]

  return (
    <footer>
      <div className="grid md:grid-cols-2">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="group relative block h-72 overflow-hidden md:h-96">
            <Image src={tile.photo.src} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
            <span className="absolute inset-0 flex items-center justify-center bg-secondary/35 transition-colors duration-300 group-hover:bg-secondary/50">
              <span className="eyebrow text-lg text-paper md:text-2xl">{tile.label}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="bg-text-primary px-6 py-16 text-center text-paper md:py-20">
        <p className="eyebrow text-base md:text-xl">{project?.name}</p>
        {companies && companies.length > 0 ? (
          <ul className="mt-8 flex flex-col items-center gap-3">
            {companies.map((company) => {
              const line = [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(" · ")
              if (!line) return null
              return (
                <li key={company.uuid}>
                  <a
                    href={mapsUrl(`${company.name}, ${line.replace(" · ", ", ")}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eyebrow text-pretty text-sm leading-relaxed text-paper transition-opacity duration-200 hover:opacity-70 md:text-base"
                  >
                    {line}
                  </a>
                </li>
              )
            })}
          </ul>
        ) : null}
        {instagram ? (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Trattoria Bella auf Instagram"
            className="mx-auto mt-8 flex size-11 items-center justify-center rounded-full bg-paper text-text-primary transition-colors duration-200 hover:bg-secondary hover:text-paper"
          >
            <InstagramIcon className="size-5" />
          </a>
        ) : null}
        <LegalLinks className="mt-10" />
      </div>

      <div className="bg-secondary px-6 pb-[calc(1.5rem+var(--order-bar-height))] pt-6 text-center md:pb-6">
        <p className="eyebrow text-xs text-paper">
          © {new Date().getFullYear()} {project?.name} · Familiengeführt in Berlin
        </p>
      </div>
    </footer>
  )
}
