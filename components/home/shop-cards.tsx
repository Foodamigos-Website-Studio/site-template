import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { WaveEdge } from "@/components/ui/decor"
import { SectionHeading } from "@/components/ui/section-heading"
import { PHOTO, type Media } from "@/lib/media"

const CARDS: { title: string; media: Media }[] = [
  { title: "Burgers", media: PHOTO.gordo },
  { title: "Crispy chicken and fries", media: PHOTO.fries },
  { title: "Shakes and sweets", media: PHOTO.shake },
]

export function ShopCards({ href }: { href: string }) {
  return (
    <section className="texture-dots-red relative overflow-x-clip pb-24 pt-24 text-background sm:pb-28 sm:pt-32">
      <WaveEdge className="text-background" />
      <div className="mx-auto max-w-[1160px] px-6">
        <Reveal>
          <SectionHeading sparkleClassName="text-background">Shop the menu</SectionHeading>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:mt-16 md:grid-cols-3">
          {CARDS.map((card, index) => (
            <li key={card.title}>
              <Reveal index={index}>
                <a
                  href={href}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[7px] border-2 border-charcoal bg-charcoal shadow-[6px_6px_0_0_var(--color-charcoal)] transition-transform duration-[150ms] ease-[ease] hover:-translate-y-1"
                >
                  <Image
                    src={card.media.src}
                    alt={card.media.alt}
                    fill
                    sizes="(min-width: 768px) 380px, 100vw"
                    className="object-cover transition-transform duration-[362ms] ease-out group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 font-heading text-3xl uppercase leading-none sm:text-4xl">
                    {card.title}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
