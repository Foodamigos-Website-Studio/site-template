import Image from "next/image"

import { ButtonLink } from "@/components/ui/button-link"
import { Checker, Sparkle } from "@/components/ui/decor"
import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { PHOTO } from "@/lib/media"
import { ORDER_PATH } from "@/lib/restaurant"

export function Hero({ name, city, orderOn }: { name: string; city: string | null; orderOn: boolean }) {
  return (
    <section className="relative isolate flex h-[100svh] max-h-[900px] min-h-[640px] flex-col overflow-hidden bg-charcoal text-background">
      <Image
        src={PHOTO.hero.src}
        alt={PHOTO.hero.alt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-charcoal/70" />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pt-24 text-center">
        <p className="flex items-center gap-3 font-heading text-sm uppercase tracking-widest sm:text-lg">
          <Sparkle className="size-5 text-primary" />
          {name}
          {city ? <span> · {city}</span> : null}
          <Sparkle className="size-5 text-primary" />
        </p>
        <h1 className="max-w-5xl text-balance font-heading text-5xl uppercase leading-[0.9] sm:text-7xl lg:text-[120px]">
          Fresh smash burgers, made to order
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
          Burgers, crispy chicken, loaded fries and creamy shakes{city ? ` in ${city}` : ""}. Pickup, delivery or eat in.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 px-6 pb-28 sm:gap-5 sm:pb-20">
        {orderOn ? <ButtonLink href={ORDER_PATH}>Order online</ButtonLink> : null}
        <ButtonLink href={localizedPath("our-menu", SITE_LANGUAGE)} variant="charcoal">
          See the menu
        </ButtonLink>
        <ButtonLink href={localizedPath("location-and-hours", SITE_LANGUAGE)} variant="light">
          Find us
        </ButtonLink>
      </div>
      <Checker className="absolute inset-x-0 bottom-0" />
    </section>
  )
}
