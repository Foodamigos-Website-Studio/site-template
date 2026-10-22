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
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-charcoal/45" />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pt-24 text-center [text-shadow:0_2px_12px_rgb(0_0_0/0.45)]">
        <p className="flex items-center justify-center gap-3 font-heading text-sm uppercase tracking-widest sm:text-lg">
          <Sparkle className="size-5 shrink-0 text-primary" />
          <span className="whitespace-normal text-center text-[14px] sm:text-lg">
            {name}
            {city ? ` · ${city}` : null}
          </span>
          <Sparkle className="size-5 shrink-0 text-primary" />
        </p>
        <h1 className="max-w-5xl text-balance font-heading text-5xl uppercase leading-[0.9] sm:text-7xl lg:text-[120px]">
          Fresh smash burgers, made to order
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
          Burgers, crispy chicken, loaded fries and creamy shakes{city ? ` in ${city}` : ""}. Pickup, delivery or eat in.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-3 px-6 pb-28 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:pb-20">
        {orderOn ? (
          <ButtonLink href={ORDER_PATH} className="w-full sm:w-auto">
            Order online
          </ButtonLink>
        ) : null}
        <ButtonLink href={localizedPath("our-menu", SITE_LANGUAGE)} variant="charcoal" className="w-full sm:w-auto">
          See the menu
        </ButtonLink>
        <ButtonLink href={localizedPath("location-and-hours", SITE_LANGUAGE)} variant="light" className="w-full sm:w-auto">
          Find us
        </ButtonLink>
      </div>
      <Checker className="absolute inset-x-0 bottom-0" />
    </section>
  )
}
