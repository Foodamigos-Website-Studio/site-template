import Link from "next/link"
import type { ReactNode } from "react"

import { Reveal } from "@/components/reveal"
import { FramedPhoto } from "@/components/site/primitives"
import type { Photo } from "@/lib/media"

type Action = { href: string; label: string }
type Shot = { photo: Photo; caption: string }

/** Image + text section: double-rule eyebrow, serif heading, justified text, outlined buttons, three framed photos. */
export function FeatureSection({
  section,
  eyebrow,
  heading,
  children,
  actions,
  big,
  small,
  from = "below",
  large = false,
}: {
  section: number
  eyebrow: string
  heading: string
  children: ReactNode
  actions: Action[]
  big: Shot
  small: [Shot, Shot]
  from?: "below" | "left"
  large?: boolean
}) {
  return (
    <section data-section={section} className={`px-5 sm:px-8 lg:px-10 ${large ? "py-24 lg:py-36" : "py-20 lg:py-28"}`}>
      <div className="mx-auto grid max-w-[1240px] items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal from={from} className="lg:pt-24">
          <div className="max-w-[28rem]">
            <span className="eyebrow">{eyebrow}</span>
            <h2 className={`display mt-3 ${large ? "text-4xl sm:text-5xl lg:text-[3.5rem]" : "text-3xl sm:text-4xl"}`}>{heading}</h2>
            <div className="justify mt-6 flex flex-col gap-5 text-lg leading-relaxed">{children}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link key={action.href + action.label} href={action.href} className={`btn ${large ? "btn-lg" : ""}`}>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-10">
          <Reveal index={1}>
            <FramedPhoto photo={big.photo} caption={big.caption} ratio={large ? "aspect-[4/3]" : "aspect-square"} />
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            {small.map((shot, index) => (
              <Reveal key={shot.photo.src} index={index + 2}>
                <FramedPhoto photo={shot.photo} caption={shot.caption} ratio="aspect-square" sizes="(min-width: 1024px) 340px, 100vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
