import { Reveal } from "@/components/reveal"
import { FramedPhoto } from "@/components/site/primitives"
import { PHOTOS } from "@/lib/media"
import type { Project } from "@/lib/studio-api"

export function Editorial({ project }: { project: Project | null }) {
  const name = project?.name ?? "Unsere Trattoria"
  return (
    <section data-section="2" className="px-5 pb-24 pt-20 sm:px-8 lg:px-10 lg:pb-32 lg:pt-28">
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <h2 className="display text-3xl leading-snug text-text-primary/35 sm:text-5xl">
            <span className="block">{name} ist ein Familienbetrieb –</span>
            <span className="mt-3 block sm:ml-[14%] lg:ml-[22%]">
              mit frischer Pasta von Hand, Pizza aus dem Holzofen und viel Platz für alle, die gern gut essen.
            </span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-10 lg:mt-24">
          <Reveal>
            <FramedPhoto photo={PHOTOS.room} ratio="aspect-[4/5]" caption="Gemütlich, lebendig und immer ein Platz für dich" sizes="(min-width: 768px) 520px, 100vw" />
          </Reveal>

          <div className="flex flex-col justify-between gap-14">
            <Reveal index={1} className="md:mx-auto md:max-w-[26rem] md:pt-2">
              <p className="justify text-lg leading-relaxed">
                So viele Hände, so viele Rezepte, so viele Geschichten kommen an unseren Tischen zusammen. In Berlin-Mitte und Kreuzberg kochen wir, wie es in einer italienischen Familie üblich ist: Pasta machen wir von Hand, die Pizza kommt aus dem Holzofen, und wer vegetarisch, vegan oder glutenfrei isst, findet bei uns genauso viel zum Schwelgen.
              </p>
              <p className="justify mt-5 text-lg leading-relaxed">
                Komm vorbei, nimm Platz und lass dich verwöhnen – zum schnellen Mittagsmenü genauso wie zum langen Abend mit Wein.
              </p>
            </Reveal>
            <Reveal index={2} className="self-end">
              <div className="w-[min(100%,20rem)]">
                <FramedPhoto photo={PHOTOS.tables} ratio="aspect-[4/5]" caption="Gastraum mit Tischen" captionLabel="Rechts" side="right" sizes="320px" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
