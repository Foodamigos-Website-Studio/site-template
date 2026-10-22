import type { CSSProperties } from "react"

import { CtaLink } from "@/components/site/cta"
import { MEDIA } from "@/lib/media"
import { ROUTES } from "@/lib/routes"

import { HeroFan } from "./hero-fan"
import { HeroWords } from "./hero-words"

const WORDS = ["Smash Burger", "Hot Cheese Fries", "Oreo Shake", "Chicken Crunch"]

const FAN = [
  MEDIA.shake,
  MEDIA.bbq,
  MEDIA.fries,
  MEDIA.chilli,
  MEDIA.elGordo,
  MEDIA.hero,
  MEDIA.bbq,
  MEDIA.chilli,
  MEDIA.fries,
  MEDIA.shake,
  MEDIA.elGordo,
]

const step = (i: number) => ({ "--i": i }) as CSSProperties

export function Hero({ name, city, shopOn }: { name: string; city: string; shopOn: boolean }) {
  return (
    <section className="relative overflow-hidden bg-hero-background">
      <div className="container-x pt-6 text-center md:pt-10">
        <h1 className="display-heading text-[clamp(3rem,12vw,10.5rem)] text-background">
          <span className="sr-only">
            Ich hab Lust auf Smash Burger, Hot Cheese Fries, Oreo Shake und Chicken Crunch – {name}
            {city ? ` in ${city}` : ""}
          </span>
          <span className="hero-in block" style={step(0)} aria-hidden="true">
            Ich hab Lust auf
          </span>
          <span className="hero-in block min-h-[0.95em]" style={step(1)}>
            <HeroWords words={WORDS} />
          </span>
        </h1>
        {shopOn ? (
          <div className="hero-in mt-8" style={step(2)}>
            <CtaLink href={ROUTES.shop} size="lg">
              Jetzt bestellen
            </CtaLink>
          </div>
        ) : null}
      </div>
      <HeroFan photos={FAN} />
    </section>
  )
}
