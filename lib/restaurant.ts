// Derived views of the site API's data for the pages: the restaurant's own location, today's hours, featured
// products, dietary labels and the Google rating. Nothing here is restaurant data itself.
import { isOpenNow, localTime, weekHours } from "./hours"
import type { Company, Menu, Project } from "./studio-api"

/** Numbers, prices and dates follow the restaurant's region (de-DE), whatever language the site's texts are in. */
export const FORMAT_LOCALE = "de-DE"

/** The online shop is embedded under /menu. */
export const ORDER_PATH = "/menu"

/** The location that carries the project's own slug, else the first one. */
export function primaryCompany(project: Project | null, companies: Company[] | null): Company | null {
  return companies?.find((company) => company.slug === project?.slug) ?? companies?.[0] ?? null
}

/** All locations with the project's own one first. */
export function primaryFirst<T extends { slug: string }>(project: Project | null, companies: T[] | null): T[] {
  const list = companies ?? []
  return [...list.filter((company) => company.slug === project?.slug), ...list.filter((company) => company.slug !== project?.slug)]
}

export function fullAddress(company: Company): string {
  return [company.address, [company.zip_code, company.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")
}

export function todayHours(company: Company, language: string, now = new Date()): { open: boolean; label: string } {
  const { day } = localTime(now, company.timezone)
  const today = weekHours(company.opening_hours, language).find((entry) => entry.day === day)
  return {
    open: isOpenNow(company.opening_hours, company.timezone, now),
    label: today?.ranges.length ? today.ranges.join(", ") : "Closed today",
  }
}

const DIET_LABELS: Record<string, string> = {
  vegetarian: "Veggie",
  vegan: "Vegan",
  halal: "Halal",
  gluten_free: "Gluten free",
  dairy_free: "Dairy free",
  spicy: "Spicy",
}

export function dietLabel(key: string): string {
  return DIET_LABELS[key] ?? key.replace(/_/g, " ")
}

/** "Veggie, vegan, halal and gluten free" */
export function dietSentence(keys: string[]): string {
  const labels = keys.map((key, index) => {
    const label = dietLabel(key)
    return index === 0 ? label : label.charAt(0).toLowerCase() + label.slice(1)
  })
  if (labels.length <= 1) return labels.join("")
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
}

export type FeaturedProduct = { id: string; name: string; imageUrl: string; price: number | null; currency: string }

/** Real products that have a photo: a couple per category, so the slider shows variety. */
export function featuredProducts(menu: Menu | null, perCompany = 8, perCategory = 2): FeaturedProduct[] {
  if (!menu) return []
  const seen = new Set<string>()
  const result: FeaturedProduct[] = []
  for (const company of menu.companies) {
    let count = 0
    for (const group of company.menus) {
      for (const category of group.categories) {
        let inCategory = 0
        for (const product of category.products) {
          if (!product.image_url || inCategory >= perCategory || count >= perCompany || seen.has(product.name)) continue
          seen.add(product.name)
          inCategory += 1
          count += 1
          result.push({ id: `${company.company_uuid}-${product.id}`, name: product.name, imageUrl: product.image_url, price: product.price, currency: company.currency })
        }
      }
    }
  }
  return result
}

export type GoogleReview = { key: string; author: string; rating: number; text: string; language: string | null; date: string; place: string }

/** The latest Google reviews of all locations, newest first, four stars and up. */
export function latestReviews(companies: Company[] | null, limit = 6): GoogleReview[] {
  const reviews = (companies ?? []).flatMap((company) =>
    (company.google_place?.reviews ?? []).map((review) => ({
      key: `${company.uuid}-${review.author_name}-${review.published_at}`,
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      language: review.language,
      date: review.published_at,
      place: company.name,
    })),
  )
  return reviews
    .filter((review) => review.rating >= 4 && review.text.trim().length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}

/** Average rating and number of ratings over all locations' Google places, weighted by their ratings. */
export function googleRating(companies: Company[] | null): { rating: number; count: number } | null {
  const places = (companies ?? []).map((company) => company.google_place).filter((place) => place && place.rating && place.rates_count)
  const count = places.reduce((sum, place) => sum + (place?.rates_count ?? 0), 0)
  if (!count) return null
  const total = places.reduce((sum, place) => sum + (place?.rating ?? 0) * (place?.rates_count ?? 0), 0)
  return { rating: total / count, count }
}

/** dd.MM.yyyy */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const part = (value: number) => String(value).padStart(2, "0")
  return `${part(date.getUTCDate())}.${part(date.getUTCMonth() + 1)}.${date.getUTCFullYear()}`
}
