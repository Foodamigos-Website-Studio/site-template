// Restaurant JSON-LD for every page, from the site API (rendered once in the root layout).
import { getSiteUrl } from "@/lib/seo"
import { restaurantJsonLd } from "@/lib/restaurant-json-ld"
import { getCompanies, getProject } from "@/lib/studio-api"

export async function RestaurantJsonLd({ cuisine }: { cuisine?: string }) {
  const [project, companies, origin] = await Promise.all([getProject(), getCompanies(), getSiteUrl()])
  const company = companies?.[0]
  if (!project || !company) return null
  const data = restaurantJsonLd({ project, company, origin, cuisine })
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
