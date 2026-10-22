import { Star } from "lucide-react"

import { Reveal } from "@/components/reveal"
import type { Company } from "@/lib/studio-api"

const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" })
const ratingFormat = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value} von 5 Sternen`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`size-5 ${index < Math.round(value) ? "fill-primary stroke-secondary" : "fill-transparent stroke-secondary/40"}`}
        />
      ))}
    </span>
  )
}

export function Reviews({ companies }: { companies: Company[] }) {
  const places = companies.filter((company) => company.google_place?.rating)
  const reviews = companies
    .flatMap((company) => (company.google_place?.reviews ?? []).map((review) => ({ ...review, city: company.city })))
    .filter((review) => review.rating >= 4 && review.text.trim().length > 0)
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, 6)

  if (reviews.length === 0 && places.length === 0) return <div className="bg-hero-background pb-16" />

  return (
    <section className="bg-hero-background pb-24 pt-16 md:pb-32 md:pt-24">
      <div className="container-x flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <Reveal>
            <h2 className="display-heading overflow-visible pt-[0.15em] text-[clamp(3.25rem,9vw,8rem)] leading-[1.1]! text-background">
              Das sagen unsere Gäste
            </h2>
          </Reveal>
          {places.length > 0 ? (
            <ul className="flex flex-wrap gap-3">
              {places.map((company, index) => (
                <li key={company.uuid}>
                  <Reveal index={index}>
                    <div className="flex items-center gap-3 rounded bg-background px-4 py-2 text-secondary">
                      <span className="font-heading text-3xl leading-none">{ratingFormat.format(company.google_place?.rating ?? 0)}</span>
                      <Stars value={company.google_place?.rating ?? 0} />
                      <span className="text-sm font-semibold">
                        {company.city}
                        {company.google_place?.rates_count
                          ? ` · ${company.google_place.rates_count.toLocaleString("de-DE")} Google-Bewertungen`
                          : ""}
                      </span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {reviews.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <li key={`${review.author_name}-${review.published_at}`} className="flex">
                <Reveal index={index % 3} className="flex w-full">
                  <figure className="flex w-full flex-col gap-4 rounded bg-background p-6 text-secondary shadow-[0_18px_30px_-18px_rgb(7_92_64_/_0.6)] transition-transform duration-[150ms] ease-in-out hover:-translate-y-1">
                    <Stars value={review.rating} />
                    <blockquote className="line-clamp-6 flex-1 text-base leading-relaxed">{review.text}</blockquote>
                    <figcaption className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xl"
                      >
                        {review.author_name.trim().charAt(0).toUpperCase()}
                      </span>
                      <span className="flex flex-col text-sm">
                        <span className="font-bold">{review.author_name}</span>
                        <span className="opacity-80">
                          {[review.city, dateFormat.format(new Date(review.published_at))].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
