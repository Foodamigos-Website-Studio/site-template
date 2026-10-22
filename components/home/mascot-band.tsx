import { Fragment } from "react"

import { Reveal } from "@/components/reveal"
import { Checker, Sparkle } from "@/components/ui/decor"
import { SafeImage } from "@/components/ui/safe-image"
import { MASCOT, type Media } from "@/lib/media"
import { cn } from "@/lib/utils"

const MASCOTS: Media[] = [MASCOT.burger, MASCOT.fries, MASCOT.shake, MASCOT.chili]
const TILT = ["-rotate-3", "rotate-3"]

export function MascotBand() {
  return (
    <section className="bg-charcoal text-background">
      <Checker />
      <div className="mx-auto max-w-[1160px] px-6 py-14 sm:py-20">
        <ul className="grid grid-cols-2 gap-5 md:flex md:items-center md:justify-center md:gap-0">
          {MASCOTS.map((mascot, index) => (
            <Fragment key={mascot.src}>
              <li>
                <Reveal index={index}>
                  <div
                    className={cn(
                      "mascot-bob relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-charcoal bg-background shadow-[6px_6px_0_0_var(--color-primary)] md:size-[200px]",
                      TILT[index % 2],
                    )}
                  >
                    <SafeImage src={mascot.src} alt={mascot.alt} eager contain fallbackIndex={index} className="mix-blend-multiply" />
                  </div>
                </Reveal>
              </li>
              {index < MASCOTS.length - 1 ? (
                <li aria-hidden="true" className="hidden px-6 md:block lg:px-10">
                  <Sparkle className={cn("text-primary", index % 2 ? "size-6" : "size-9")} />
                </li>
              ) : null}
            </Fragment>
          ))}
        </ul>
      </div>
      <Checker />
    </section>
  )
}
