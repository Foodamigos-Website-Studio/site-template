import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { CtaLink } from "@/components/site/cta"
import { Marquee } from "@/components/site/marquee"
import { MEDIA } from "@/lib/media"
import { ROUTES } from "@/lib/routes"

function CurvedArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 130" fill="none" className={className} aria-hidden="true">
      <path d="M118 6 C 138 50, 100 100, 24 108" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M46 88 L 22 108 L 50 124" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Showcase({ city, shopOn }: { city: string; shopOn: boolean }) {
  return (
    <section className="overflow-hidden bg-background pb-24 pt-20 md:pb-32 md:pt-32">
      <div className="container-x grid items-center gap-16 md:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="-rotate-3 overflow-hidden rounded border-4 border-secondary shadow-[12px_12px_0_0_var(--color-primary)]">
            <Image
              src={MEDIA.cheese.src}
              alt={MEDIA.cheese.alt}
              width={MEDIA.cheese.width}
              height={MEDIA.cheese.height}
              sizes="(min-width: 768px) 448px, 90vw"
              className="h-auto w-full"
            />
          </div>
          <div className="absolute -right-2 -top-10 flex rotate-6 flex-col items-start text-secondary md:-right-24 md:-top-6">
            <span className="font-heading text-4xl uppercase leading-none md:text-5xl">Frisch &amp; lecker</span>
            <CurvedArrow className="-mt-1 ml-6 size-20 -scale-x-100 rotate-[200deg] md:size-28" />
          </div>
        </Reveal>

        <div className="flex flex-col items-start gap-6">
          <Reveal index={0}>
            <h2 className="display-heading text-[clamp(3.25rem,8vw,7rem)] text-secondary">
              Smash Burger, wie er sein soll
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="max-w-lg text-lg leading-relaxed">
              Bei uns{city ? ` in ${city}` : ""} wird jeder Burger frisch gesmasht, mit hausgemachten Saucen verfeinert und
              heiß serviert. Schnell online bestellt, zum Mitnehmen, zum Liefern lassen oder direkt vor Ort genossen.
            </p>
          </Reveal>
          {shopOn ? (
            <Reveal index={2}>
              <CtaLink href={ROUTES.shop} size="lg">
                Jetzt bestellen
              </CtaLink>
            </Reveal>
          ) : null}
        </div>
      </div>

      <div className="mt-28 pb-8 md:mt-40 md:pb-12">
        <div className="-mx-[10%] -rotate-[4deg] bg-hero-background py-6">
          <Marquee text="Zeit für deinen Burger!" className="text-[clamp(4.5rem,11vw,10rem)] text-primary" />
        </div>
      </div>
    </section>
  )
}
