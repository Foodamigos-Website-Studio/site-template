import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { Marquee } from "@/components/site/marquee"
import { MEDIA } from "@/lib/media"

const CARDS = [
  { photo: MEDIA.chilli, label: "Chilli Cheese Burger", offset: "md:translate-y-0" },
  { photo: MEDIA.fries, label: "Hot Cheese Fries", offset: "md:translate-y-12" },
  { photo: MEDIA.elGordo, label: "El Gordo Burger", offset: "md:translate-y-4" },
  { photo: MEDIA.shake, label: "Oreo Milchshake", offset: "md:translate-y-16" },
]

const bandText = "text-[length:var(--band-text)] text-blue-deep"

export function GuestCards({ city }: { city: string }) {
  return (
    <section className="relative overflow-hidden bg-hero-background py-16 md:py-24">
      <h2 className="sr-only">Frische Burger, Fries und Shakes{city ? ` in ${city}` : ""}</h2>

      <div className="relative [--band-text:clamp(4.5rem,14vw,13rem)]">
        <div
          className="pointer-events-none absolute inset-y-0 -left-[10%] -right-[10%] flex -rotate-3 flex-col justify-between bg-background"
          aria-hidden="true"
        >
          <Marquee text="Für alle. Frisch. Schnell." className={bandText} textClassName="px-6" />
          <Marquee text="Für alle. Frisch. Schnell." direction="right" className={bandText} textClassName="px-6" />
        </div>

        <div className="container-x relative py-[calc(var(--band-text)*1.15)]">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {CARDS.map((card, index) => (
              <li key={card.label}>
                <Reveal index={index}>
                  <figure
                    className={`relative aspect-[3/4] overflow-hidden rounded border-4 border-background bg-background shadow-[0_24px_40px_-18px_rgb(7_92_64_/_0.55)] transition-transform duration-[150ms] ease-in-out hover:-translate-y-2 ${card.offset}`}
                  >
                    <Image
                      src={card.photo.src}
                      alt={card.photo.alt}
                      fill
                      sizes="(min-width: 1320px) 300px, (min-width: 768px) 25vw, 50vw"
                      className="object-cover"
                    />
                    <figcaption className="absolute bottom-3 left-3 right-3 rounded bg-primary px-3 py-1.5 font-heading text-xl uppercase leading-none text-secondary md:text-2xl">
                      {card.label}
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
