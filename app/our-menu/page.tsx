import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { Reveal } from "@/components/reveal"
import { ButtonLink } from "@/components/ui/button-link"
import { WaveEdge } from "@/components/ui/decor"
import { PageHero } from "@/components/ui/page-hero"
import { SITE_LANGUAGE } from "@/lib/config"
import { formatPrice } from "@/lib/format"
import { localizedPath } from "@/lib/localized-routes"
import { onlineShopOn } from "@/lib/modules"
import { ORDER_PATH, primaryCompany } from "@/lib/restaurant"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getMenu, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const city = primaryCompany(project, companies)?.city
  return pageMetadata({
    title: `${project?.name ?? "Menu"} – Burger menu${city ? ` in ${city}` : ""}`,
    description: `Smash burgers, crispy chicken, fries, shakes and desserts${city ? ` in ${city}` : ""}, with vegetarian, vegan, halal and gluten-free options. See every price.`,
    path: localizedPath("our-menu", SITE_LANGUAGE),
  })
}

export default async function MenuPage() {
  const [project, menu, allCompanies] = await Promise.all([getProject(), getMenu(), getCompanies()])
  const primaryUuid = primaryCompany(project, allCompanies)?.uuid
  const companies = [...(menu?.companies ?? [])]
    .sort((a, b) => Number(b.company_uuid === primaryUuid) - Number(a.company_uuid === primaryUuid))
    .filter((company) => company.menus.some((group) => group.categories.some((category) => category.products.length > 0)))
  if (companies.length === 0) notFound()
  const orderOn = onlineShopOn(project)

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
      <PageHero
        title="Our menu"
        actions={orderOn ? <ButtonLink href={ORDER_PATH}>Order online</ButtonLink> : undefined}
      >
        Fresh smash burgers, crispy chicken, loaded fries and creamy shakes, made to order at {project?.name}.
      </PageHero>

      <div data-slot="menu">
        {companies.map((company) => (
          <div key={company.company_uuid} data-slot="menu-location" className="relative bg-background pb-20 pt-16 sm:pt-20">
            <div className="mx-auto max-w-[1160px] px-6">
              {companies.length > 1 ? (
                <h2 className="mb-10 text-center font-heading text-4xl uppercase leading-none text-primary sm:text-6xl">{company.name}</h2>
              ) : null}
              {company.menus.map((group) => (
                <div key={group.id} data-slot="menu-group" className="flex flex-col gap-16">
                  {company.menus.length > 1 ? <h2 className="font-heading text-3xl uppercase">{group.name}</h2> : null}
                  {group.categories
                    .filter((category) => category.products.length > 0)
                    .map((category) => (
                      <section key={category.id} data-slot="menu-category" aria-labelledby={`cat-${category.id}`}>
                        <Reveal>
                          <h3 id={`cat-${category.id}`} className="font-heading text-3xl uppercase leading-none text-primary sm:text-5xl">
                            {category.name}
                          </h3>
                          {category.description ? <p className="mt-3 max-w-2xl text-lg leading-relaxed">{category.description}</p> : null}
                        </Reveal>
                        <ul className="mt-8 grid gap-4 md:grid-cols-2">
                          {category.products.map((product, index) => (
                            <li key={product.id} data-slot="menu-item">
                              <Reveal index={index % 2} className="h-full">
                                <article className="flex h-full gap-4 rounded-[7px] border-2 border-charcoal bg-background p-4 shadow-[4px_4px_0_0_var(--color-charcoal)]">
                                  {product.image_url ? (
                                    <div className="relative size-24 shrink-0 overflow-hidden rounded-[7px] border-2 border-charcoal sm:size-28">
                                      <Image src={product.image_url} alt={product.name} fill sizes="112px" className="object-cover" />
                                    </div>
                                  ) : null}
                                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <div className="flex items-start justify-between gap-3">
                                      <h4 className="font-heading text-lg uppercase leading-tight">{product.name}</h4>
                                      {product.price !== null && product.price > 0 ? (
                                        <span className="shrink-0 font-bold text-primary">
                                          {formatPrice(product.price, company.currency, SITE_LANGUAGE)}
                                        </span>
                                      ) : null}
                                    </div>
                                    {product.description ? (
                                      <p className="line-clamp-3 text-sm leading-relaxed">{product.description}</p>
                                    ) : null}
                                  </div>
                                </article>
                              </Reveal>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {orderOn ? (
        <section className="texture-dots-red relative overflow-x-clip pb-20 pt-28 text-center text-background">
          <WaveEdge className="text-background" />
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6">
            <h2 className="font-heading text-5xl uppercase leading-[0.9] sm:text-7xl">Hungry?</h2>
            <ButtonLink href={ORDER_PATH} variant="charcoal">
              Order now
            </ButtonLink>
          </div>
        </section>
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  )
}
