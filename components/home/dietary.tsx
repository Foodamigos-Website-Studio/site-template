import { Reveal } from "@/components/reveal"
import { Mascot, WaveEdge } from "@/components/ui/decor"
import { SectionHeading } from "@/components/ui/section-heading"
import { MASCOT } from "@/lib/media"
import { dietLabel, dietSentence } from "@/lib/restaurant"
import { cn } from "@/lib/utils"

const BADGE_STYLES = [
  "bg-primary text-background",
  "bg-background text-charcoal",
  "bg-charcoal text-background",
  "bg-background text-primary",
]

export function Dietary({ options }: { options: string[] }) {
  if (!options.length) return null
  return (
    <section className="relative overflow-x-clip bg-background pb-24 pt-24 sm:pb-32 sm:pt-32">
      <WaveEdge className="text-charcoal" />
      <div className="mx-auto max-w-[1160px] px-6 text-center">
        <Reveal>
          <SectionHeading sparkleClassName="text-primary">{dietSentence(options)}</SectionHeading>
        </Reveal>
        <Reveal index={1}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-xl leading-snug">
            Everyone at the table gets a proper burger. Ask us about our options when you order.
          </p>
        </Reveal>
        <ul className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-5">
          {options.map((option, index) => (
            <li key={option}>
              <Reveal index={index}>
                <span
                  className={cn(
                    "inline-block rounded-[7px] border-2 border-charcoal px-6 py-4 font-heading text-xl uppercase leading-none shadow-[4px_4px_0_0_var(--color-charcoal)] sm:text-3xl",
                    BADGE_STYLES[index % BADGE_STYLES.length],
                  )}
                >
                  {dietLabel(option)}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
      <Reveal direction="right" className="mx-auto mt-10 w-44 md:absolute md:bottom-10 md:right-6 md:mt-0 md:w-48 lg:right-16 lg:w-64">
        <Mascot media={MASCOT.chili} className="rotate-3" sizes="(min-width: 1024px) 256px, 176px" />
      </Reveal>
    </section>
  )
}
