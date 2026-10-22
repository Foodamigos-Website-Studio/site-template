import { Star } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { WaveEdge } from "@/components/ui/decor"
import { SectionHeading } from "@/components/ui/section-heading"
import { formatDate, FORMAT_LOCALE, type GoogleReview } from "@/lib/restaurant"

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-primary" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className="size-5" strokeWidth={2.5} fill={index < rating ? "currentColor" : "none"} aria-hidden="true" />
      ))}
    </span>
  )
}

export function Reviews({ reviews, rating }: { reviews: GoogleReview[]; rating: { rating: number; count: number } | null }) {
  if (!reviews.length) return null
  return (
    <section className="texture-dots-red relative overflow-x-clip pb-24 pt-24 text-background sm:pb-32 sm:pt-32">
      <WaveEdge className="text-charcoal" />
      <div className="mx-auto max-w-[1160px] px-6">
        <Reveal>
          <SectionHeading sparkleClassName="text-background">Loved by locals</SectionHeading>
        </Reveal>
        {rating ? (
          <Reveal index={1}>
            <p className="mt-6 text-center text-xl font-bold">
              {new Intl.NumberFormat(FORMAT_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(rating.rating)} out of 5 on
              Google · {new Intl.NumberFormat(FORMAT_LOCALE).format(rating.count)} ratings
            </p>
          </Reveal>
        ) : null}
        <ul className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <li key={review.key}>
              <Reveal index={index % 3} className="h-full">
                <article className="flex h-full flex-col gap-3 rounded-[7px] border-2 border-charcoal bg-background p-6 text-charcoal shadow-[6px_6px_0_0_var(--color-charcoal)]">
                  <Stars rating={review.rating} />
                  <h3 className="font-heading text-xl uppercase leading-tight">{review.author}</h3>
                  <blockquote lang={review.language || undefined} className="line-clamp-6 text-base leading-relaxed">
                    {review.text}
                  </blockquote>
                  <p className="mt-auto pt-2 text-sm font-bold">
                    {review.place} · {formatDate(review.date)}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
