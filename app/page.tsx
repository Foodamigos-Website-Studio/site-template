import type { Metadata } from "next"
import Link from "next/link"

import { GallerySlider } from "@/components/home/gallery-slider"
import { HeroSlider } from "@/components/home/hero-slider"
import { LocationsSection } from "@/components/home/locations-section"
import { ReservationTab } from "@/components/home/reservation-tab"
import { ReviewsSection } from "@/components/home/reviews-section"
import { SiteFaq } from "@/components/seo/site-faq"
import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { reservationsOn } from "@/lib/modules"
import { pageMetadata } from "@/lib/seo"
import { GALLERY_PHOTOS, HERO_SLIDES } from "@/lib/site-media"
import { getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Trattoria Bella | Italienisch in Berlin Kreuzberg & Mitte",
    description:
      "Familiengeführte Trattoria in Berlin: hausgemachte Pasta, Holzofenpizza und italienische Weine in Kreuzberg und Mitte. Jetzt Tisch reservieren oder bestellen.",
    path: "/",
  })
}

export default async function Home() {
  const project = await getProject()
  const reservations = reservationsOn(project)

  return (
    <>
      <div className="relative">
        <h1 className="sr-only">Trattoria Bella – italienische Trattoria mit Pasta und Pizza in Berlin Kreuzberg und Mitte</h1>
        <HeroSlider slides={HERO_SLIDES} />
        {reservations ? <ReservationTab /> : null}
      </div>

      <section aria-labelledby="statement-title" className="bg-secondary px-6 py-24 text-center md:py-32">
        <h2 id="statement-title" className="eyebrow mx-auto max-w-3xl text-balance text-xl leading-[1.9] text-paper md:text-3xl md:leading-[1.8]">
          Eine Familie, ein Tisch
          <br />
          Pasta von Hand gemacht
        </h2>
        {reservations ? (
          <Link href={localizedPath("reservations", SITE_LANGUAGE)} className="btn btn-sm mt-12">
            Reservieren
          </Link>
        ) : null}
      </section>

      <GallerySlider photos={GALLERY_PHOTOS} />

      <section aria-labelledby="craft-title" className="bg-text-primary px-6 py-20 text-center md:py-28">
        <h2 id="craft-title" className="eyebrow mx-auto max-w-5xl text-balance text-lg leading-[1.9] text-paper md:text-2xl">
          Guter Wein und italienisches Handwerk
        </h2>
      </section>

      <LocationsSection />
      <ReviewsSection />

      <section className="bg-background px-6 py-24 md:py-32">
        <SiteFaq />
      </section>
    </>
  )
}
