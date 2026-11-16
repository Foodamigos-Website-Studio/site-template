import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { FramedPhoto } from "@/components/site/primitives"
import { PHOTOS } from "@/lib/media"
import { sitePaths } from "@/lib/nav"

export function Dessert() {
  return (
    <section data-section="6" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 md:grid-cols-2 md:gap-14">
        <Reveal>
          <FramedPhoto photo={PHOTOS.tiramisu} ratio="aspect-[4/3]" sizes="(min-width: 768px) 520px, 100vw" />
        </Reveal>
        <Reveal index={1} className="mx-auto max-w-[30rem] text-center">
          <p className="text-xl tracking-[0.08em]">Zum Schluss etwas Süßes</p>
          <h2 className="display-caps mt-3 text-2xl sm:text-3xl">Hausgemachtes Tiramisù</h2>
          <div aria-hidden="true" className="ornament-rule mt-5 text-2xl">
            <span>*</span>
          </div>
          <p className="justify mt-6 text-lg leading-relaxed">
            Ein Löffel Tiramisù gehört bei uns zum Abend wie der Espresso danach. Wir machen es selbst, so wie es zu Hause auf den Tisch kommt – cremig, leicht und genau richtig für einen guten Abschluss.
          </p>
          <Link href={sitePaths().menu} className="btn mt-8">
            Zur Speisekarte
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
