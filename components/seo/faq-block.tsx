// The site's one FAQ block: questions as <details>, plus their FAQPage JSON-LD. The coupons page and the dish pages use
// it (and the home FAQ). Unstyled on purpose: style it like the site.
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
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageJsonLd(items) }} />
    </section>
  )
}
