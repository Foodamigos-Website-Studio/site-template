// A page for search engines as a route (app/coupons re-exports it; proxy.ts serves it under /angebote on a German
// site). Texts from the site API. Unstyled on purpose: style it like the site (one h1, the FAQ).
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { pageMetadata } from "@/lib/seo"
import type { SeoPageKey } from "@/lib/seo-pages"
import { getSeoPage } from "@/lib/studio-api"

export function seoPageRoute(page: SeoPageKey) {
  async function generateMetadata(): Promise<Metadata> {
    const texts = await getSeoPage(page)
    if (!texts) return {}
    return {
      ...(await pageMetadata({ title: texts.meta_title, description: texts.meta_description, path: localizedPath(page, SITE_LANGUAGE) })),
      keywords: texts.keywords,
    }
  }

  async function SeoPageRoute() {
    const texts = await getSeoPage(page)
    if (!texts) notFound()
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: texts.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }
    return (
      <article data-slot="seo-page" data-page={page}>
        <h1>{texts.title}</h1>
        <section data-slot="faq">
          {texts.faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq).replace(/</g, "\\u003c") }} />
      </article>
    )
  }

  return { generateMetadata, SeoPageRoute }
}
