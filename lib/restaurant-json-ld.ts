// The restaurant's schema.org JSON-LD (components/site/restaurant-json-ld.tsx renders it once per page): name, url,
// image, cuisine, contact, address, opening hours of the first location, and sameAs with its social profiles (SO.4).
import { sameAs } from "./socials"
import type { Company, Project } from "./studio-api"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const clock = (hour: number, minute: number) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`

export function restaurantJsonLd({ project, company, origin, cuisine }: { project: Project; company: Company; origin: string; cuisine?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: project.name,
    url: origin,
    image: project.og_image_url ? [project.og_image_url] : undefined,
    servesCuisine: cuisine,
    telephone: company.phone_number ?? undefined,
    email: company.email ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address ?? undefined,
      postalCode: company.zip_code ?? undefined,
      addressLocality: company.city ?? undefined,
      addressCountry: company.country ?? undefined,
    },
    openingHoursSpecification: company.opening_hours.map((period) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAYS[period.open.day]}`,
      opens: clock(period.open.hour, period.open.minute),
      closes: clock(period.close.hour, period.close.minute),
    })),
    sameAs: sameAs(project.socials),
  }
}
