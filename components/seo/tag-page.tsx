// A dish page (F-TP) at /tags/{slug}, like the coupons page (components/seo/seo-page-route.tsx): one h1, the copy, the
// dish's items from the menu, the calls to action the site's modules allow and the FAQ (FaqBlock, FAQPage JSON-LD).
// Texts from the site API (Max writes them). Unstyled on purpose: style it like the site, keep the data and the links.
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { FaqBlock } from "@/components/seo/faq-block"
import { PRODUCTION_DEPLOYMENT, SITE_LANGUAGE } from "@/lib/config"
import { formatPrice } from "@/lib/format"
import { pageMetadata } from "@/lib/seo"
import { getMenu, getProject, getTagPage, getTagPages, type TagPage } from "@/lib/studio-api"
import { PREVIEW_TAG_SLUG, previewTagPage } from "@/lib/tag-page-preview"
import { menuImageAllowed, type TagCta, type TagPageLabels, tagPageCtas, tagPageLabels, tagPageListed, tagPath, type TagProduct, tagProducts } from "@/lib/tag-pages"

type TagPageProps = { params: Promise<{ slug: string }> }

export function TagPageView({ page, products, ctas, labels, language }: { page: TagPage; products: readonly TagProduct[]; ctas: readonly TagCta[]; labels: TagPageLabels; language: string }) {
  return (
    <article data-slot="tag-page" data-slug={page.slug}>
      <section className="bg-secondary px-6 py-20 text-center md:py-28">
        <h1 className="eyebrow mx-auto max-w-4xl text-balance break-words text-2xl text-paper md:text-4xl">{page.title}</h1>
      </section>
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {page.paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-6 text-pretty text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
        {ctas.length > 0 ? (
          <ul data-slot="tag-page-ctas" className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {ctas.map((cta, index) => (
              <li key={cta.key}>
                <Link href={cta.href} data-cta={cta.key} className={index === 0 ? "btn" : "btn btn-outline"}>
                  {cta.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        {products.length > 0 ? (
          <section data-slot="tag-page-items" className="mt-20">
            <h2 className="eyebrow border-b border-text-primary/30 pb-4 text-center text-lg text-secondary">{labels.menuItems}</h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2">
              {products.map((product, index) => (
                <li key={product.id} data-slot="menu-item" className="flex flex-col gap-2">
                  {menuImageAllowed(product.image_url) ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={400}
                      height={400}
                      sizes="(max-width: 640px) 100vw, 400px"
                      loading={index === 0 ? "eager" : "lazy"}
                      className="mb-2 aspect-square w-full object-cover"
                    />
                  ) : null}
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-serif text-lg text-secondary">{product.name}</span>
                    {product.price !== null ? <span className="shrink-0 text-secondary">{formatPrice(product.price, product.currency, language)}</span> : null}
                  </div>
                  {product.description ? <p className="text-sm">{product.description}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <div className="mt-20">
          <FaqBlock items={page.faq} heading={labels.faq} />
        </div>
      </div>
    </article>
  )
}

/** /tags/preview outside production: the fixture v0 styles the dish page on (lib/tag-page-preview.ts). */
function servesPreview(slug: string): boolean {
  return !PRODUCTION_DEPLOYMENT && slug === PREVIEW_TAG_SLUG
}

export async function generateTagPageMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  if (servesPreview(slug)) {
    const [project, menu] = await Promise.all([getProject(), getMenu()])
    const page = previewTagPage(project, menu, SITE_LANGUAGE)
    const metadata = await pageMetadata({ title: page.metaTitle, description: page.metaDescription, path: tagPath(page.slug) })
    return { ...metadata, robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }
  }
  const [page, pages] = await Promise.all([getTagPage(slug), getTagPages()])
  if (!page || !tagPageListed(pages, slug)) return {}
  return pageMetadata({ title: page.metaTitle, description: page.metaDescription, path: tagPath(page.slug) })
}

/**
 * An unknown slug, a draft or a removed dish is the site's 404 page: the site API answers 404 for all three, and the
 * live list (GET /tag-pages) no longer has them. With the site API down, the cached page stays. Outside production,
 * /tags/preview is the fixture (it wins over a site API page with that slug); in production "preview" is an ordinary
 * slug.
 */
export async function TagPageRoute({ params }: TagPageProps) {
  const { slug } = await params
  if (servesPreview(slug)) {
    const [project, menu] = await Promise.all([getProject(), getMenu()])
    const page = previewTagPage(project, menu, SITE_LANGUAGE)
    return (
      <TagPageView
        page={page}
        products={tagProducts(menu, page.productIds)}
        ctas={tagPageCtas(project, menu, SITE_LANGUAGE)}
        labels={tagPageLabels(SITE_LANGUAGE)}
        language={SITE_LANGUAGE}
      />
    )
  }
  const [page, pages, project, menu] = await Promise.all([getTagPage(slug), getTagPages(), getProject(), getMenu()])
  if (!page || !tagPageListed(pages, slug)) notFound()
  return (
    <TagPageView
      page={page}
      products={tagProducts(menu, page.productIds)}
      ctas={tagPageCtas(project, menu, SITE_LANGUAGE)}
      labels={tagPageLabels(SITE_LANGUAGE)}
      language={SITE_LANGUAGE}
    />
  )
}
