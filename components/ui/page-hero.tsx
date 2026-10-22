import type { ReactNode } from "react"

import { Reveal } from "@/components/reveal"

import { Checker } from "./decor"
import { SectionHeading } from "./section-heading"

/** The charcoal banner that opens every page except the home page. */
export function PageHero({ title, children, actions }: { title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  return (
    <section className="texture-dots relative overflow-x-clip text-background">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pb-24 pt-16 text-center sm:pt-20">
        <SectionHeading as="h1" className="text-background" sparkleClassName="text-primary">
          {title}
        </SectionHeading>
        {children ? <p className="max-w-2xl text-pretty text-lg leading-relaxed sm:text-xl">{children}</p> : null}
        {actions ? <Reveal className="flex flex-wrap justify-center gap-4">{actions}</Reveal> : null}
      </div>
      <Checker className="absolute inset-x-0 bottom-0" />
    </section>
  )
}
