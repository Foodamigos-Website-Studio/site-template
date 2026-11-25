// A dish page (F-TP) at /tags/{slug}, like the coupons page (components/seo/seo-page-route.tsx): one h1, the copy, the
// dish's items from the menu, the calls to action the site's modules allow and the FAQ (FaqBlock, FAQPage JSON-LD).
// Texts from the site API (Max writes them). Unstyled on purpose: style it like the site, keep the data and the links.
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { FaqBlock } from "@/components/seo/faq-block"
import { SITE_LANGUAGE } from "@/lib/config"
import { formatPrice } from "@/lib/format"
import { pageMetadata } from "@/lib/seo"
import { getMenu, getProject, getTagPage, type TagPage } from "@/lib/studio-api"
import { menuImageAllowed, type TagCta, type TagPageLabels, tagPageCtas, tagPageLabels, tagPath, type TagProduct, tagProducts } from "@/lib/tag-pages"

type TagPageProps = { params: Promise<{ slug: string }> }

export function TagPageView({ page, products, ctas, labels, language }: { page: TagPage; products: readonly TagProduct[]; ctas: readonly TagCta[]; labels: TagPageLabels; language: string }) {
  return (
    <article data-slot="tag-page" data-slug={page.slug}>
      <h1 className="break-words">{page.title}</h1>
      {page.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {ctas.length > 0 ? (
        <ul data-slot="tag-page-ctas">
          {ctas.map((cta) => (
            <li key={cta.key}>
              <Link href={cta.href} data-cta={cta.key}>
                {cta.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {products.length > 0 ? (
        <section data-slot="tag-page-items">
          <h2>{labels.menuItems}</h2>
          <ul>
            {products.map((product, index) => (
              <li key={product.id} data-slot="menu-item">
                {menuImageAllowed(product.image_url) ? (
                  <Image src={product.image_url} alt={product.name} width={400} height={400} sizes="(max-width: 640px) 100vw, 400px" loading={index === 0 ? "eager" : "lazy"} />
                ) : null}
                <span>{product.name}</span>
                {product.price !== null ? <span>{formatPrice(product.price, product.currency, language)}</span> : null}
                {product.description ? <p>{product.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <FaqBlock items={page.faq} heading={labels.faq} />
    </article>
  )
}

export async function generateTagPageMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getTagPage(slug)
  if (!page) return {}
  return pageMetadata({ title: page.metaTitle, description: page.metaDescription, path: tagPath(page.slug) })
}

/** An unknown slug, a draft or a removed dish is the site's 404 page (the site API answers 404 for all three). */
export async function TagPageRoute({ params }: TagPageProps) {
  const { slug } = await params
  const [page, project, menu] = await Promise.all([getTagPage(slug), getProject(), getMenu()])
  if (!page) notFound()
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
