import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { PHOTOS } from "@/lib/media"
import { reservationLink } from "@/lib/nav"
import type { Project } from "@/lib/studio-api"

export function WinePanel({ project }: { project: Project | null }) {
  const reserve = reservationLink(project)

  return (
    <section aria-label="Italienische Weine" className="on-dark img-zoom relative isolate flex min-h-[80svh] items-center justify-center overflow-hidden bg-ink px-5 py-24">
      <Image src={PHOTOS.wine.src} alt={PHOTOS.wine.alt} fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/45" />
      <Reveal className="flex max-w-3xl flex-col items-center text-center">
        <h2 className="display-caps text-2xl sm:text-4xl lg:text-5xl">Italienische Weine, die zum Bleiben einladen</h2>
        {reserve ? (
          <Link href={reserve.href} className="btn btn-lg mt-12" style={{ color: "var(--color-background)" }}>
            Tisch reservieren
          </Link>
        ) : null}
      </Reveal>
    </section>
  )
}
