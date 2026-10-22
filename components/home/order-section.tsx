import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { ButtonLink } from "@/components/ui/button-link"
import { Mascot, WaveEdge } from "@/components/ui/decor"
import { SectionHeading } from "@/components/ui/section-heading"
import { mapsUrl } from "@/lib/hours"
import { MASCOT, PHOTO } from "@/lib/media"
import { fullAddress, ORDER_PATH } from "@/lib/restaurant"
import type { Company } from "@/lib/studio-api"

export function OrderSection({ companies, orderOn }: { companies: Company[]; orderOn: boolean }) {
  return (
    <section className="texture-dots relative overflow-x-clip pb-24 pt-24 text-background sm:pb-32 sm:pt-32">
      <WaveEdge className="text-primary" />
      <div className="mx-auto max-w-[1160px] px-6">
        <Reveal>
          <SectionHeading sparkleClassName="text-background">Order pickup and delivery</SectionHeading>
        </Reveal>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:items-stretch">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[7px] border-2 border-background">
              <Image
                src={PHOTO.hero.src}
                alt={PHOTO.hero.alt}
                fill
                sizes="(min-width: 768px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <Reveal direction="right" className="absolute -bottom-8 right-4 w-32 sm:-right-3 sm:w-44 md:-right-8">
              <Mascot media={MASCOT.shake} sticker className="rotate-6" sizes="176px" />
            </Reveal>
          </Reveal>

          <div className="flex min-w-0 flex-col justify-center gap-8">
            {orderOn ? (
              <Reveal className="flex flex-wrap gap-4">
                <ButtonLink href={ORDER_PATH} size="md" className="h-12">
                  Order pickup
                </ButtonLink>
                <ButtonLink href={ORDER_PATH} size="md" className="h-12">
                  Order delivery
                </ButtonLink>
              </Reveal>
            ) : null}
            <ul className="flex flex-col gap-6">
              {companies.map((company, index) => (
                <li key={company.uuid}>
                  <Reveal index={index}>
                    <p className="font-heading text-[32px] uppercase leading-tight">{company.name}</p>
                    <p className="mt-1 text-lg leading-relaxed">{fullAddress(company)}</p>
                    <a
                      href={mapsUrl(fullAddress(company))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-bold uppercase underline underline-offset-4 transition-colors hover:text-primary"
                    >
                      Route
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
