import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { Diamonds } from "@/components/site/primitives"
import { PHOTOS, type Photo } from "@/lib/media"
import { reservationLink, sitePaths } from "@/lib/nav"
import { giftCardsOn } from "@/lib/modules"
import type { Project } from "@/lib/studio-api"

type Card = { href: string; title: string; text: string; photo: Photo }

export function EntryCards({ project }: { project: Project | null }) {
  const paths = sitePaths()
  const reserve = reservationLink(project)
  const cards: Card[] = [
    { href: paths.menu, title: "Menü", text: "Pasta, Pizza und Tiramisù", photo: PHOTOS.pasta },
    ...(reserve ? [{ href: reserve.href, title: "Tisch reservieren", text: "Für zwei oder die ganze Familie", photo: PHOTOS.tables }] : []),
    ...(giftCardsOn(project) ? [{ href: paths.giftCards, title: "Gutscheine", text: "Ein Abend zum Verschenken", photo: PHOTOS.kitchen }] : []),
  ]

  return (
    <section data-section="3" className="px-4 pb-24 pt-8 sm:px-8 lg:pb-32">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <Diamonds />
          <p className="mt-14 text-center text-lg tracking-[0.12em] sm:text-xl">Hausgemacht, herzlich, mitten in Berlin</p>
          <h2 className="display-caps mt-2 text-center text-2xl sm:text-4xl">Komm an unseren Tisch</h2>
        </Reveal>

        <ul className={`mt-12 grid gap-6 ${cards.length >= 3 ? "md:grid-cols-3" : cards.length === 2 ? "md:grid-cols-2" : "mx-auto max-w-md"}`}>
          {cards.map((card, index) => (
            <li key={card.href + card.title}>
              <Reveal index={index}>
                <Link href={card.href} className="group relative block aspect-[4/5] overflow-hidden rounded-[3px] bg-ink">
                  <Image
                    src={card.photo.src}
                    alt={card.photo.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                  <span className="card-label absolute inset-x-5 bottom-6 block group-hover:opacity-90">
                    <span className="display-caps block text-xl tracking-[0.18em] sm:text-2xl">{card.title}</span>
                    <span className="mt-1 block text-base italic">{card.text}</span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
