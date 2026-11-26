// The home page's FAQ (F-TP): the four standard questions Max writes (GET /faq), "What are you known for?" linking every
// live dish page, merged with the questions the home already has (extraItems: pass your own FAQ here instead of a
// second FAQ block, so there is one FAQPage). Through FaqBlock, so the markup and the JSON-LD match the coupons page.
// The template adds no FAQ text: with /faq failed or empty (and no extraItems) the section is left out, heading and all.
// Unstyled on purpose: style it like the site.
import type { ReactNode } from "react"

import { FaqBlock } from "@/components/seo/faq-block"
import { SITE_LANGUAGE } from "@/lib/config"
import { type ExtraFaqItem, mergeFaq } from "@/lib/site-faq"
import { getFaq } from "@/lib/studio-api"
import { tagPageLabels } from "@/lib/tag-pages"

export async function SiteFaq({ extraItems = [], heading }: { extraItems?: readonly ExtraFaqItem[]; heading?: ReactNode }) {
  const faq = await getFaq()
  const items = mergeFaq(faq?.items ?? [], extraItems)
  if (items.length === 0) return null
  return (
    <div data-slot="site-faq">
      <FaqBlock items={items} heading={heading ?? tagPageLabels(SITE_LANGUAGE).faq} />
    </div>
  )
}
