// Restaurant JSON-LD for every page, from the site API (rendered once in the root layout).
import { getSiteUrl } from "@/lib/seo"
import { getCompanies, getProject } from "@/lib/studio-api"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const clock = (hour: number, minute: number) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`

export async function RestaurantJsonLd({ cuisine }: { cuisine?: string }) {
  const [project, companies, origin] = await Promise.all([getProject(), getCompanies(), getSiteUrl()])
  const company = companies?.[0]
  if (!project || !company) return null
  const data = {
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
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
