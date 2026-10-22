import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { MEDIA } from "@/lib/media"
import { ROUTES } from "@/lib/routes"

const FADE = "linear-gradient(to bottom, #000 calc(100% - 80px), transparent)"

export function Statement() {
  return (
    <section className="relative isolate overflow-hidden py-24 text-center md:py-40">
      <Image
        src={MEDIA.ingredients.src}
        alt={MEDIA.ingredients.alt}
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-30"
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
      />
      <div className="container-x">
        <div className="mx-auto w-fit">
          <Reveal>
            <h2 className="display-heading text-[clamp(4rem,14vw,12rem)] text-secondary">
              <span className="block text-[0.55em]">Bei uns gilt:</span>
              <span className="text-outline block">Frisch ist</span>
              <span className="block">am besten</span>
            </h2>
          </Reveal>
        </div>
        <Reveal index={1} className="mt-10 flex justify-center md:absolute md:right-[6%] md:top-[10%] md:mt-0">
          <Link
            href={ROUTES.about}
            aria-label="Das macht uns aus"
            className="group relative flex size-32 items-center justify-center rounded-full border-2 border-secondary bg-primary text-secondary transition-colors duration-[150ms] ease-in-out hover:bg-secondary hover:text-primary md:size-[140px]"
          >
              <svg viewBox="0 0 200 200" className="sticker-ring absolute inset-0 size-full" aria-hidden="true">
                <defs>
                  <path id="sticker-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
                </defs>
                <text className="font-heading uppercase" fill="currentColor" fontSize="27">
                  <textPath href="#sticker-circle" textLength="440" lengthAdjust="spacing">
                    Das macht uns aus • Das macht uns aus •
                  </textPath>
                </text>
              </svg>
            <ArrowUpRight className="size-12 md:size-14" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
