import { Reveal } from "@/components/reveal"
import { ButtonLink } from "@/components/ui/button-link"
import { Mascot } from "@/components/ui/decor"
import { MASCOT } from "@/lib/media"
import { ORDER_PATH } from "@/lib/restaurant"

export function Intro({ about, orderOn }: { about: string | null; orderOn: boolean }) {
  return (
    <section className="relative overflow-x-clip bg-background">
      <Reveal direction="left" className="absolute -left-10 top-6 z-0 w-40 md:top-1/2 md:-left-12 md:w-72 md:-translate-y-1/2 lg:w-[400px]">
        <Mascot media={MASCOT.burger} className="-rotate-6" sizes="(min-width: 1024px) 400px, 288px" />
      </Reveal>
      <Reveal direction="right" className="absolute -right-10 bottom-6 z-0 w-40 md:bottom-auto md:top-1/2 md:-right-12 md:w-72 md:-translate-y-1/2 lg:w-[400px]">
        <Mascot media={MASCOT.fries} className="rotate-6" sizes="(min-width: 1024px) 400px, 288px" />
      </Reveal>

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[550px] flex-col items-center justify-center gap-8 px-6 py-52 text-center md:py-32">
        {about ? (
          <Reveal>
            <p className="text-pretty text-xl font-medium leading-snug sm:text-2xl">{about}</p>
          </Reveal>
        ) : null}
        <Reveal index={1}>
          <ButtonLink href={orderOn ? ORDER_PATH : "/our-menu"}>{orderOn ? "Order now" : "See the menu"}</ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
