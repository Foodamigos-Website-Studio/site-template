import type { ReactNode } from "react"

/** Centred page head used on every inner page: small brass line, uppercase serif heading (the page's one h1). */
export function PageIntro({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="px-5 pb-14 pt-20 text-center sm:px-8 lg:pb-20 lg:pt-32">
      <p className="label text-accent">{kicker}</p>
      <h1 className="display-caps mt-6 text-2xl sm:text-4xl lg:text-5xl">{title}</h1>
      <span aria-hidden="true" className="mx-auto mt-8 block h-px w-14 bg-accent" />
      {children ? <div className="mx-auto mt-8 max-w-[38rem] text-lg leading-relaxed">{children}</div> : null}
    </div>
  )
}
