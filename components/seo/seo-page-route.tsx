// A page for search engines as a route: app/angebote and app/coupons re-export it. A path of the other language
// redirects to the site's own. Unstyled on purpose: style it like the site (one h1, the FAQ).
import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"

import { SITE_LANGUAGE } from "@/lib/config"
import { pageMetadata } from "@/lib/seo"
import { seoPageContent, seoSlug, type SeoPageKey } from "@/lib/seo-pages"
import { getCompanies, getProject } from "@/lib/studio-api"

async function content(page: SeoPageKey) {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const main = companies?.[0]
  return seoPageContent(page, SITE_LANGUAGE, {
    name: project?.name ?? "",
    city: main?.city ?? "",
    email: main?.business_profile?.email || main?.email || "",
  })
}

export function seoPageRoute(page: SeoPageKey, path: string) {
  async function generateMetadata(): Promise<Metadata> {
    const texts = await content(page)
    return {
      ...(await pageMetadata({ title: texts.metaTitle, description: texts.metaDescription, path: seoSlug(page, SITE_LANGUAGE) })),
      keywords: texts.keywords,
    }
  }

  async function SeoPageRoute() {
    if (seoSlug(page, SITE_LANGUAGE) !== path) permanentRedirect(seoSlug(page, SITE_LANGUAGE))
    const texts = await content(page)
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
