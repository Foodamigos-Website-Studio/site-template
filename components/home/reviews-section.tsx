import { Star } from "lucide-react"

import { getCompanies, type GoogleReview } from "@/lib/studio-api"

const number = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" })

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`size-4 ${n <= Math.round(value) ? "fill-primary text-primary" : "text-text-primary/40"}`} strokeWidth={1.25} aria-hidden="true" />
      ))}
    </span>
  )
}

export async function ReviewsSection() {
  const companies = await getCompanies()
  const places = (companies ?? []).flatMap((company) => (company.google_place?.rating ? [company.google_place] : []))
  if (places.length === 0) return null

  const total = places.reduce((sum, place) => sum + (place.rates_count ?? 0), 0)
  const allSame = places.every((place) => place.rating === places[0].rating && place.rates_count === places[0].rates_count)
  const rating = allSame || total === 0 ? (places[0].rating ?? 0) : places.reduce((sum, place) => sum + (place.rating ?? 0) * (place.rates_count ?? 0), 0) / total
  const count = allSame ? (places[0].rates_count ?? 0) : total

  const seen = new Set<string>()
  const reviews: GoogleReview[] = places
    .flatMap((place) => place.reviews)
    .filter((review) => {
      const key = `${review.author_name}|${review.text}`
      if (!review.text || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, 3)

  return (
    <section aria-labelledby="reviews-title" className="bg-paper px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 id="reviews-title" className="eyebrow text-balance text-center text-xl text-secondary md:text-3xl">
          Das sagen unsere Gäste
        </h2>
        <div className="mt-8 flex flex-col items-center gap-2">
          <Stars value={rating} />
          <p className="text-secondary">
            <span className="font-serif text-2xl">{number.format(rating)}</span> von 5
            {count > 0 ? ` · ${count} Google-Bewertungen` : ""}
          </p>
        </div>
        {reviews.length > 0 ? (
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {reviews.map((review) => (
              <li key={`${review.author_name}-${review.published_at}`} className="flex flex-col items-center text-center">
                <Stars value={review.rating} />
                <blockquote className="mt-5 text-pretty">„{review.text}“</blockquote>
                <p className="mt-5 text-sm uppercase tracking-[0.18em] text-secondary">{review.author_name}</p>
                <p className="text-sm">
                  <time dateTime={review.published_at}>{dateFormat.format(new Date(review.published_at))}</time>
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
