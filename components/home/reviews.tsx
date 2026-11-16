import { Star } from "lucide-react"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { siteLocale } from "@/lib/format"
import { SITE_LANGUAGE } from "@/lib/config"
import { sitePaths } from "@/lib/nav"
import type { Company, GoogleReview } from "@/lib/studio-api"

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`size-4 ${index < Math.round(rating) ? "fill-current" : "opacity-30"}`} aria-hidden="true" />
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
    <section data-section="9" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <span className="label block">Google-Bewertungen</span>
          <h2 className="display mt-1 text-3xl sm:text-4xl">Gäste, die gern wiederkommen</h2>
          <p className="mt-5 flex items-center gap-3 text-lg">
            <span className="display text-5xl">{format.format(rating)}</span>
            <span className="flex flex-col gap-1">
              <Stars rating={rating} />
              <span className="text-sm">{count ? `bei ${count} Bewertungen` : "bei Google"}</span>
            </span>
          </p>
          <Link href={sitePaths().locations} className="btn mt-8">
            Unsere Standorte
          </Link>
        </Reveal>

        <ul className="grid gap-6 sm:grid-cols-2">
          {reviews.slice(0, 4).map((review, index) => (
            <li key={`${review.author_name}${review.published_at}`}>
              <Reveal index={index}>
                <figure className="card-label !p-6 !text-left">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-3 text-base leading-relaxed">{review.text}</blockquote>
                  <figcaption className="label mt-4 text-xs">{review.author_name}</figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
