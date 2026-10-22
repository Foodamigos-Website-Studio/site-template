// The site's own menu page (/menu is the online shop's): every location's menus, categories and products with prices,
// from the site API, plus Menu JSON-LD. Unstyled default markup v0 may replace, keeping the data and formatPrice.
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SITE_LANGUAGE } from "@/lib/config"
import { formatPrice } from "@/lib/format"
import { localizedPath } from "@/lib/localized-routes"
import { pageMetadata } from "@/lib/seo"
import { getMenu, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  return pageMetadata({
    title: project?.name ?? "",
    description: [project?.name, project?.tagline].filter(Boolean).join(" · "),
    path: localizedPath("our-menu", SITE_LANGUAGE),
  })
}

export default async function MenuPage() {
  const [project, menu] = await Promise.all([getProject(), getMenu()])
  const companies = menu?.companies.filter((company) => company.menus.some((group) => group.categories.length > 0)) ?? []
  if (companies.length === 0) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": companies.flatMap((company) =>
      company.menus.map((group) => ({
        "@type": "Menu",
        name: group.name,
        hasMenuSection: group.categories.map((category) => ({
          "@type": "MenuSection",
          name: category.name,
          hasMenuItem: category.products.map((product) => ({
            "@type": "MenuItem",
            name: product.name,
            description: product.description ?? undefined,
            offers: product.price !== null ? { "@type": "Offer", price: product.price.toFixed(2), priceCurrency: company.currency } : undefined,
          })),
        })),
      })),
    ),
  }

  return (
    <section data-slot="menu">
      <h1>{project?.name}</h1>
      {companies.map((company) => (
        <div key={company.company_uuid} data-slot="menu-location">
          {companies.length > 1 ? <h2>{company.name}</h2> : null}
          {company.menus.map((group) => (
            <div key={group.id} data-slot="menu-group">
              {company.menus.length > 1 ? <h2>{group.name}</h2> : null}
              {group.categories.map((category) => (
                <section key={category.id} data-slot="menu-category">
                  <h3>{category.name}</h3>
                  {category.description ? <p>{category.description}</p> : null}
                  <ul>
                    {category.products.map((product) => (
                      <li key={product.id} data-slot="menu-item">
                        <span>{product.name}</span>
                        {product.price !== null ? <span>{formatPrice(product.price, company.currency, SITE_LANGUAGE)}</span> : null}
                        {product.description ? <p>{product.description}</p> : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ))}
        </div>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  )
}
