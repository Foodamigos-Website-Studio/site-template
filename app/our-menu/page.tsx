import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageIntro } from "@/components/site/page-intro"
import { SITE_LANGUAGE } from "@/lib/config"
import { formatPrice } from "@/lib/format"
import { localizedPath } from "@/lib/localized-routes"
import { ORDER_PATH, reservationLink } from "@/lib/nav"
import { pageMetadata } from "@/lib/seo"
import { getMenu, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  return pageMetadata({
    title: `${name} – Speisekarte in Berlin`,
    description: `Speisekarte der ${name}: hausgemachte Pasta, Holzofenpizza, vegetarische, vegane und glutenfreie Gerichte in Berlin Mitte und Kreuzberg.`,
    path: localizedPath("our-menu", SITE_LANGUAGE),
  })
}

export default async function MenuPage() {
  const [project, menu] = await Promise.all([getProject(), getMenu()])
  const companies = menu?.companies.filter((company) => company.menus.some((group) => group.categories.length > 0)) ?? []
  if (companies.length === 0) notFound()
  const reserve = reservationLink(project)

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
    <main data-slot="menu" className="pb-24">
      <PageIntro kicker="Hausgemacht, frisch und mit Liebe gekocht" title="Speisekarte">
        <p>Pasta, Holzofenpizza, vegetarische, vegane und glutenfreie Gerichte – such dir aus, worauf du Lust hast.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={ORDER_PATH} className="btn btn-solid">
            Jetzt bestellen
          </Link>
          {reserve ? (
            <Link href={reserve.href} className="btn">
              {reserve.label}
            </Link>
          ) : null}
        </div>
      </PageIntro>

      <div className="mx-auto max-w-[980px] px-5 sm:px-8">
        {companies.map((company) => (
          <div key={company.company_uuid} data-slot="menu-location">
            {companies.length > 1 ? <h2 className="display-caps mt-16 border-t border-text-primary/25 pt-10 text-center text-2xl">{company.name}</h2> : null}
            {company.menus.map((group) => (
              <div key={group.id} data-slot="menu-group">
                {company.menus.length > 1 ? <h2 className="display mt-14 text-center text-3xl">{group.name}</h2> : null}
                {group.categories.map((category) => (
                  <section key={category.id} data-slot="menu-category" className="mt-16">
                    <h3 className="display-caps text-center text-2xl sm:text-3xl">{category.name}</h3>
                    {category.description ? <p className="mx-auto mt-3 max-w-[34rem] text-center italic">{category.description}</p> : null}
                    <div aria-hidden="true" className="ornament-rule mt-5 text-xl">
                      <span>*</span>
                    </div>
                    <ul className="mt-8 flex flex-col gap-7">
                      {category.products.map((product) => (
                        <li key={product.id} data-slot="menu-item">
                          <div className="flex items-baseline gap-4">
                            <span className="display text-xl sm:text-2xl">{product.name}</span>
                            <span aria-hidden="true" className="min-w-6 flex-1 border-b border-dotted border-text-primary/40" />
                            {product.price !== null ? <span className="text-lg font-bold">{formatPrice(product.price, company.currency, SITE_LANGUAGE)}</span> : null}
                          </div>
                          {product.description ? <p className="mt-1 max-w-[40rem] text-base leading-relaxed">{product.description}</p> : null}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  )
}
