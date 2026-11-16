import { Reveal } from "@/components/reveal"
import { PhotoFigure } from "@/components/site/primitives"
import { PHOTOS } from "@/lib/media"

export function ImageDuo() {
  return (
    <section aria-label="Zutaten und Handwerk" className="px-5 pb-28 sm:px-8 lg:px-10 lg:pb-44">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <PhotoFigure photo={PHOTOS.tomatoes} ratio="aspect-[4/5]" sizes="(min-width: 1024px) 58vw, 100vw" title="Frische Zutaten">
            Reife Tomaten, Basilikum und gutes Olivenöl: Bei uns kommt auf den Teller, was nach Sonne schmeckt.
          </PhotoFigure>
        </Reveal>
        <Reveal index={1} className="lg:col-span-5 lg:mt-72">
          <PhotoFigure photo={PHOTOS.flour} ratio="aspect-[4/5]" sizes="(min-width: 1024px) 40vw, 100vw" title="Pasta von Hand">
            Mehl, Eier und ein Nudelholz: Unsere Pasta entsteht in Handarbeit, Tag für Tag.
          </PhotoFigure>
        </Reveal>
      </div>
    </section>
  )
}
