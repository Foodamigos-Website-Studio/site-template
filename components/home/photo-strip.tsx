import { Reveal } from "@/components/reveal"
import { ButtonLink } from "@/components/ui/button-link"
import { Checker } from "@/components/ui/decor"
import { SafeImage } from "@/components/ui/safe-image"
import { SectionHeading } from "@/components/ui/section-heading"
import { PHOTO, type Media } from "@/lib/media"
import { ORDER_PATH } from "@/lib/restaurant"

const PHOTOS: Media[] = [PHOTO.fries, PHOTO.chilli, PHOTO.bbq, PHOTO.shake, PHOTO.ingredients, PHOTO.cheese]

export function PhotoStrip({ orderOn }: { orderOn: boolean }) {
  return (
    <section className="overflow-hidden bg-charcoal text-background">
      <Checker />
      <div className="mx-auto max-w-[1160px] px-6 py-16 sm:py-24">
        <Reveal>
          <SectionHeading sparkleClassName="text-primary">Fresh off the grill</SectionHeading>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-6">
          {PHOTOS.map((photo, index) => (
            <li key={photo.src}>
              <Reveal index={index % 2}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[7px] border-2 border-background bg-background">
                  <SafeImage src={photo.src} alt={photo.alt} eager fallbackIndex={index} />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        {orderOn ? (
          <Reveal className="mt-12 flex justify-center">
            <ButtonLink href={ORDER_PATH} className="rounded-full">
              Order online
            </ButtonLink>
          </Reveal>
        ) : null}
      </div>
      <Checker />
    </section>
  )
}
