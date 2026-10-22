import { Reveal } from "@/components/reveal"
import { ButtonLink } from "@/components/ui/button-link"
import { WaveEdge } from "@/components/ui/decor"
import { SafeImage } from "@/components/ui/safe-image"
import { SectionHeading } from "@/components/ui/section-heading"
import { MASCOT, PHOTO, type Media } from "@/lib/media"
import { ORDER_PATH } from "@/lib/restaurant"
import { cn } from "@/lib/utils"

type Tile = { media: Media; mascot?: boolean }

const TILES: Tile[] = [
  { media: PHOTO.ingredients },
  { media: MASCOT.burger, mascot: true },
  { media: PHOTO.bbq },
  { media: PHOTO.cheese },
  { media: MASCOT.fries, mascot: true },
  { media: PHOTO.shake },
  { media: PHOTO.chilli },
  { media: MASCOT.shake, mascot: true },
  { media: PHOTO.gordo },
  { media: PHOTO.fries },
  { media: MASCOT.chili, mascot: true },
  { media: PHOTO.hero },
]

export function Gallery({ orderOn }: { orderOn: boolean }) {
  return (
    <section className="relative overflow-x-clip bg-background pb-24 pt-24 sm:pb-32 sm:pt-32">
      <WaveEdge className="text-primary" />
      <div className="mx-auto max-w-[1160px] px-6">
        <Reveal>
          <SectionHeading size="xl" className="text-charcoal" sparkleClassName="text-primary">
            Stay saucy!
          </SectionHeading>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-5 md:grid-cols-4">
          {TILES.map((tile, index) => (
            <li key={tile.media.src}>
              <Reveal index={index % 4}>
                <figure
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-[7px] border-2 border-charcoal bg-background transition-transform duration-[150ms] ease-[ease] hover:-translate-y-1",
                  )}
                >
                  <SafeImage
                    src={tile.media.src}
                    alt={tile.media.alt}
                    eager
                    contain={tile.mascot}
                    fallbackIndex={index}
                    className={cn(tile.mascot && "mix-blend-multiply")}
                  />
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
        {orderOn ? (
          <Reveal className="mt-12 flex justify-center">
            <ButtonLink href={ORDER_PATH}>Order now</ButtonLink>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
