import { Reveal } from "@/components/reveal"
import { dietLabels } from "@/lib/page-text"
import type { Project } from "@/lib/studio-api"

const TONES = [
  "bg-primary text-secondary",
  "bg-hero-background text-secondary",
  "bg-secondary text-primary",
  "bg-background text-secondary",
]

export function DietaryStrip({ project }: { project: Project | null }) {
  const labels = dietLabels(project)
  if (labels.length === 0) return null
  return (
    <section className="bg-background pb-8 pt-4 md:pb-12">
      <div className="container-x flex flex-col items-center gap-8 text-center">
        <Reveal>
          <h2 className="display-heading text-4xl text-secondary md:text-6xl">Für jeden Geschmack</h2>
        </Reveal>
        <ul className="flex flex-wrap justify-center gap-3 md:gap-5">
          {labels.map((label, index) => (
            <li key={label}>
              <Reveal index={index}>
                <span
                  className={`inline-block rounded-full border-2 border-secondary px-7 py-3 font-heading text-3xl uppercase leading-none md:px-10 md:py-4 md:text-5xl ${TONES[index % TONES.length]}`}
                  style={{ rotate: `${index % 2 === 0 ? -2 : 2}deg` }}
                >
                  {label}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
