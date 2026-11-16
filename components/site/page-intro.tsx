import type { ReactNode } from "react"

import { Diamonds } from "@/components/site/primitives"

/** Centred page head used on every inner page: diamonds, small line, uppercase heading (the page's one h1). */
export function PageIntro({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="px-5 pb-12 pt-16 text-center sm:px-8 lg:pt-24">
      <Diamonds />
      <p className="mt-10 text-lg tracking-[0.12em] sm:text-xl">{kicker}</p>
      <h1 className="display-caps mt-2 text-3xl sm:text-5xl">{title}</h1>
      {children ? <div className="mx-auto mt-6 max-w-[38rem] text-lg leading-relaxed">{children}</div> : null}
    </div>
  )
}
