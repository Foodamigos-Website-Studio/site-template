import type { ReactNode } from "react"

export function PageTitle({ children, intro }: { children: ReactNode; intro?: ReactNode }) {
  return (
    <section className="bg-secondary px-6 py-20 text-center md:py-28">
      <h1 className="eyebrow mx-auto max-w-4xl text-balance text-2xl text-paper md:text-4xl">{children}</h1>
      {intro ? <p className="mx-auto mt-6 max-w-xl text-pretty text-paper/80">{intro}</p> : null}
    </section>
  )
}
