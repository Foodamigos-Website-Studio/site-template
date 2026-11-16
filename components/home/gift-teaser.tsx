import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { giftCardsOn } from "@/lib/modules"
import { PHOTOS } from "@/lib/media"
import { sitePaths } from "@/lib/nav"
import type { Project } from "@/lib/studio-api"

export function GiftTeaser({ project }: { project: Project | null }) {
  if (!giftCardsOn(project)) return null
  return (
    <section data-section="8" className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-ink sm:min-h-[44rem] sm:items-end">
      <Image src={PHOTOS.tables.src} alt={PHOTOS.tables.alt} fill sizes="100vw" className="-z-10 object-cover" />
      <div className="w-full px-4 pb-6 sm:px-8 sm:pb-10">
        <Reveal from="left" className="max-w-[28rem]">
          <div className="card-label !text-left !p-7 sm:!p-9">
            <span className="label block text-xs">Gutscheine</span>
            <h2 className="display-caps mt-3 text-2xl tracking-[0.14em] sm:text-3xl">Für alle, die gern schenken</h2>
            <p className="mt-4 text-base leading-relaxed">Ein Abend mit Pasta, Pizza und einem Glas Wein: Verschenke einen Gutschein für unsere Trattoria.</p>
            <Link href={sitePaths().giftCards} className="label mt-5 inline-block border-b-2 border-text-primary pb-1 text-sm hover:opacity-60">
              Gutschein verschenken
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
