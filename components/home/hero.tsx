import Image from "next/image"
import Link from "next/link"

import { PHOTOS } from "@/lib/media"
import { reservationLink } from "@/lib/nav"
import type { Project } from "@/lib/studio-api"

export function Hero({ project }: { project: Project | null }) {
  const reserve = reservationLink(project)
  const name = project?.name ?? "Trattoria Bella"

  return (
    <section aria-label="Willkommen" className="on-dark relative isolate flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden bg-ink">
      <Image src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} fill priority sizes="100vw" className="hero-zoom -z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/40" />

      <h1 className={project?.tagline ? "label max-w-xl px-8 text-center leading-loose tracking-[0.3em] text-background sm:text-sm" : "sr-only"}>
        {project?.tagline ?? `${name} – italienisches Restaurant in Berlin`}
      </h1>

      {reserve ? (
        <Link
          href={reserve.href}
          className="label fixed right-0 top-1/2 z-30 -translate-y-1/2 rounded-l-[4px] bg-accent px-3 py-6 text-ink [writing-mode:vertical-rl] hover:bg-ink hover:text-background"
        >
          Reservieren
        </Link>
      ) : null}
    </section>
  )
}
