import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { ConsentGate } from "@/components/consent/consent-gate"
import { shortLocationName } from "@/lib/hours-groups"
import { PHOTOS, TOUR_VIDEO } from "@/lib/media"
import { sitePaths } from "@/lib/nav"
import { getLegal, type Company, type Project } from "@/lib/studio-api"

import { ParallaxList } from "./parallax-list"

export async function LocationBand({ project, companies }: { project: Project | null; companies: Company[] }) {
  const legal = await getLegal()
  const paths = sitePaths()
  const items = companies.map((company) => ({
    href: `${paths.locations}#${company.slug}`,
    label: shortLocationName(company, project?.name),
  }))

  return (
    <section data-section="5" className="tone-dark relative isolate flex min-h-[44rem] items-end overflow-hidden bg-ink lg:min-h-[52rem]">
      <Image src={PHOTOS.view.src} alt={PHOTOS.view.alt} fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 flex items-end justify-center pb-4">
        <ConsentGate category="embedded_media" label={TOUR_VIDEO.label} settingsLabel={legal?.consent_banner.settings ?? ""}>
          <video
            src={TOUR_VIDEO.src}
            aria-label={TOUR_VIDEO.label}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 size-full object-cover"
          />
        </ConsentGate>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-ink/55" />

      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-12 px-5 pb-16 pt-32 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:pb-20">
        <div className="max-w-[28rem]">
          <p className="display text-2xl leading-snug tracking-[0.06em] sm:text-3xl">
            Nimm Platz bei uns: an zwei Orten in Berlin, mit Pasta, Pizza und viel Zeit füreinander.
          </p>
          <Link href={paths.locations} className="label mt-6 inline-flex items-center gap-3 text-sm hover:opacity-70">
            Standorte ansehen
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>

        {items.length ? (
          <ParallaxList items={items} heading="Standorte" />
        ) : null}
      </div>
    </section>
  )
}
