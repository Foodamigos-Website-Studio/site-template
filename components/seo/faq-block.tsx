// The site's one FAQ block: questions as <details>, plus their FAQPage JSON-LD. The coupons page, the dish pages and
// the home FAQ (SiteFaq) use it. Unstyled on purpose: style it like the site.
import Link from "next/link"
import type { ReactNode } from "react"

import { type FaqItem, faqPageJsonLd } from "@/lib/faq"

export function FaqBlock({ items, heading }: { items: readonly FaqItem[]; heading?: ReactNode }) {
  if (items.length === 0) return null
  return (
    <section data-slot="faq">
      {heading ? <h2>{heading}</h2> : null}
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
          {item.links && item.links.length > 0 ? (
            <ul data-slot="faq-links">
              {item.links.map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageJsonLd(items) }} />
    </section>
  )
}
