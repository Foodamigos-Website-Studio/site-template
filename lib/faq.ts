// FAQPage structured data for every FAQ the site shows (the coupons page, the dish pages, the home FAQ): one helper, so
// the markup and the escaping stay the same everywhere.

/** A link under an answer, e.g. "What are you known for?" → a dish page. Paths only: the site's own pages. */
export type FaqLink = { label: string; path: string }

export type FaqItem = { question: string; answer: string; links?: readonly FaqLink[] }

/** An answer's text for the JSON-LD: the answer, then its links' labels (what the guest sees under it). */
function answerText(item: FaqItem): string {
  const labels = (item.links ?? []).map((link) => link.label)
  return labels.length > 0 ? `${item.answer} ${labels.join(", ")}` : item.answer
}

/** The FAQPage object for these questions (schema.org). */
export function faqPage(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: answerText(item) },
    })),
  }
}

/**
 * The FAQPage JSON-LD as the text of a <script type="application/ld+json">. Every "<" is written as <, so an
 * answer containing "</script>" or "<script>" can never end the script element or start another one.
 */
export function faqPageJsonLd(items: readonly FaqItem[]): string {
  return JSON.stringify(faqPage(items)).replace(/</g, "\\u003c")
}
