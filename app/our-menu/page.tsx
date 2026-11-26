import type { Metadata } from "next"
import Link from "next/link"

import { PageTitle } from "@/components/site/page-title"
import { SITE_LANGUAGE } from "@/lib/config"
import { formatPrice } from "@/lib/format"
import { localizedPath } from "@/lib/localized-routes"
import { onlineShopOn, reservationsOn } from "@/lib/modules"
import { pageMetadata } from "@/lib/seo"
import { getMenu, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Speisekarte – Trattoria Bella in Berlin",
    description: "Die Speisekarte der Trattoria Bella in Berlin Kreuzberg und Mitte: hausgemachte Pasta, Holzofenpizza und italienische Weine.",
    path: localizedPath("our-menu", SITE_LANGUAGE),
  })
}

export default async function MenuPage() {
  const [project, menu] = await Promise.all([getProject(), getMenu()])
  const companies = menu?.companies.filter((company) => company.menus.some((group) => group.categories.length > 0)) ?? []
  const shop = onlineShopOn(project)
  const reservations = reservationsOn(project)

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
    <>
      <PageTitle intro="Hausgemachte Pasta, Holzofenpizza und italienische Weine – frisch zubereitet in Kreuzberg und Mitte.">Speisekarte</PageTitle>

      <section data-slot="menu" className="bg-background px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          {companies.length === 0 ? (
            <div className="text-center">
              <h2 className="eyebrow text-balance text-lg text-secondary md:text-2xl">Die Karte wird gerade aktualisiert</h2>
              <p className="mx-auto mt-6 max-w-lg text-pretty">
                Unsere aktuellen Gerichte und Preise können wir Ihnen hier gerade nicht anzeigen. Schauen Sie bald wieder vorbei – oder bestellen Sie direkt online und reservieren Sie Ihren Tisch.
              </p>
            </div>
          ) : (
            companies.map((company) => (
              <div key={company.company_uuid} data-slot="menu-location" className="[&:not(:first-child)]:mt-24">
                {companies.length > 1 ? <h2 className="eyebrow text-balance text-center text-xl text-secondary md:text-3xl">{company.name}</h2> : null}
                {company.menus.map((group) => (
                  <div key={group.id} data-slot="menu-group" className="mt-12">
                    {company.menus.length > 1 ? <h3 className="eyebrow text-balance text-center text-lg text-primary">{group.name}</h3> : null}
                    {group.categories.map((category) => (
                      <section key={category.id} data-slot="menu-category" className="mt-14">
                        <h3 className="eyebrow border-b border-text-primary/30 pb-4 text-center text-base text-secondary md:text-lg">{category.name}</h3>
                        {category.description ? <p className="mt-4 text-center">{category.description}</p> : null}
                        <ul className="mt-6 flex flex-col gap-6">
                          {category.products.map((product) => (
                            <li key={product.id} data-slot="menu-item">
                              <div className="flex items-baseline justify-between gap-6">
                                <span className="font-serif text-lg text-secondary">{product.name}</span>
                                {product.price !== null ? (
                                  <span className="shrink-0 text-secondary">{formatPrice(product.price, company.currency, SITE_LANGUAGE)}</span>
                                ) : null}
                              </div>
                              {product.description ? <p className="mt-1 max-w-xl text-pretty text-sm">{product.description}</p> : null}
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}

          <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {shop ? (
              <Link href="/menu" className="btn">
                Jetzt bestellen
              </Link>
            ) : null}
            {reservations ? (
              <Link href={localizedPath("reservations", SITE_LANGUAGE)} className="btn btn-outline">
                Tisch reservieren
              </Link>
            ) : null}
          </div>
        </div>

        {companies.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        ) : null}
      </section>
    </>
  )
}
