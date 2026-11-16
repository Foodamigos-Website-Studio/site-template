import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { sitePaths } from "@/lib/nav"

export function Statement() {
  return (
    <section aria-label="Unsere Trattoria" className="px-5 py-28 sm:px-8 lg:py-44">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="display-caps text-xl sm:text-3xl lg:text-4xl">
          Eine Trattoria, die der Familie gehört: hausgemachte Pasta, Holzofenpizza und italienische Weine, geführt von Giulia Rossi.
        </h2>
        <Link href={sitePaths().menu} className="link-thin mt-14">
          Zur Speisekarte
        </Link>
      </Reveal>
    </section>
  )
}
