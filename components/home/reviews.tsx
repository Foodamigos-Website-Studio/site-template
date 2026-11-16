import { Star } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SITE_LANGUAGE } from "@/lib/config"
import { siteLocale } from "@/lib/format"
import type { Company, GoogleReview } from "@/lib/studio-api"

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-accent" role="img" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`size-3.5 ${index < Math.round(rating) ? "fill-current" : "opacity-30"}`} aria-hidden="true" />
      ))}
    </span>
  )
}

export function Reviews({ companies }: { companies: Company[] }) {
  const places = companies.map((company) => company.google_place).filter((place): place is NonNullable<Company["google_place"]> => Boolean(place?.rating))
  if (!places.length) return null

  const seen = new Set<string>()
  const reviews: GoogleReview[] = []
  for (const review of places.flatMap((place) => place.reviews)) {
    const key = `${review.author_name}|${review.text}`
    if (seen.has(key)) continue
    seen.add(key)
    reviews.push(review)
  }
  reviews.sort((a, b) => b.published_at.localeCompare(a.published_at))

  const count = places.reduce((sum, place) => sum + (place.rates_count ?? 0), 0)
  const rating = places.reduce((sum, place) => sum + (place.rating ?? 0) * (place.rates_count ?? 1), 0) / places.reduce((sum, place) => sum + (place.rates_count ?? 1), 0)
  const format = new Intl.NumberFormat(siteLocale(SITE_LANGUAGE), { maximumFractionDigits: 1, minimumFractionDigits: 1 })

  return (
    <section aria-labelledby="reviews-heading" className="px-5 pb-28 sm:px-8 lg:px-10 lg:pb-44">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="flex flex-col items-center text-center">
          <p className="label text-accent">Google-Bewertungen</p>
          <h2 id="reviews-heading" className="display mt-6 text-5xl sm:text-6xl">
            {format.format(rating)}
          </h2>
          <div className="mt-4 flex flex-col items-center gap-2">
            <Stars rating={rating} />
            <span className="label">{count ? `bei ${count} Bewertungen` : "bei Google"}</span>
          </div>
        </Reveal>

        <ul className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {reviews.slice(0, 4).map((review, index) => (
            <li key={`${review.author_name}${review.published_at}`}>
              <Reveal index={index}>
                <figure className="border-t border-accent/40 pt-8">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-5 leading-relaxed">{review.text}</blockquote>
                  <figcaption className="label mt-6 text-ink">{review.author_name}</figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
