import Image from "next/image"
import Link from "next/link"

import { PHOTOS } from "@/lib/media"
import { reservationLink, sitePaths } from "@/lib/nav"
import type { Project } from "@/lib/studio-api"

export function Hero({ project }: { project: Project | null }) {
  const name = project?.name ?? ""
  const reserve = reservationLink(project)
  const paths = sitePaths()

  return (
    <section data-section="1" className="tone-dark relative flex min-h-[100svh] flex-col items-center bg-ink px-5 pb-20 pt-28 sm:pt-32 lg:pb-28">
      <h1 className="label text-center text-xs tracking-[0.28em] opacity-80 sm:text-sm">
        {name} – italienisches Restaurant in Berlin
      </h1>

      <div className="relative mt-6 w-full max-w-[920px] overflow-hidden rounded-[3px] border border-background/30">
        <div className="relative aspect-[4/5] sm:aspect-[16/10]">
          <Image src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} fill priority sizes="(min-width: 1024px) 920px, 100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12">
            <p className="hero-fade display max-w-[22ch] text-center text-3xl text-background sm:text-5xl">
              Schön, dass du da bist. Der Tisch ist gedeckt.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {reserve ? (
          <Link href={reserve.href} className="btn">
            {reserve.label}
          </Link>
        ) : null}
        <Link href={paths.menu} className="btn">
          Speisekarte ansehen
        </Link>
      </div>

      <p className="display mt-16 max-w-[1040px] text-center text-2xl leading-snug text-background/35 sm:mt-24 sm:text-4xl lg:text-[2.75rem]">
        Eine Trattoria für die ganze Familie – mit hausgemachter Pasta, Holzofenpizza und vielen vegetarischen, veganen und glutenfreien Gerichten.
      </p>
    </section>
  )
}
