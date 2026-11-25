// The home FAQ (F-TP): the four standard questions Max writes (GET /faq: known for, meals, delivery or takeout, areas),
// merged with the questions the site's home already has (extraItems, e.g. v0's own FAQ). The template adds no FAQ text:
// questions and answers come from /faq in the site's language, or from the site's own items.
import type { FaqItem, FaqLink } from "./faq"
import type { SiteFaqItem, SiteFaqKey } from "./studio-api"

/** A question the site's home already has. `key` says which standard question it answers, if any. */
export type ExtraFaqItem = FaqItem & { key?: SiteFaqKey }

/** Questions compared without case, spacing or punctuation: "Do you offer delivery?" = "do you offer delivery". */
function sameQuestion(a: string, b: string): boolean {
  const normalize = (text: string) => text.normalize("NFKC").toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "")
  return normalize(a) !== "" && normalize(a) === normalize(b)
}

/** Only the site's own paths (/tags/...): never another host or a javascript: link. */
function sitePath(link: FaqLink): boolean {
  return link.path.startsWith("/") && !link.path.startsWith("//") && link.label.trim() !== ""
}

function appendLinks(existing: readonly FaqLink[] | undefined, added: readonly FaqLink[]): FaqLink[] {
  const links = [...(existing ?? [])]
  for (const link of added) {
    if (!links.some((other) => other.path === link.path)) links.push(link)
  }
  return links
}

/**
 * The home FAQ: the site's own questions first, then each standard question from /faq the site doesn't have yet (same
 * key, or the same question). When the site already answers "What are you known for?", the links to the live dish
 * pages are appended to its answer instead, so no question shows twice.
 */
export function mergeFaq(standard: readonly SiteFaqItem[], extraItems: readonly ExtraFaqItem[] = []): FaqItem[] {
  const items: FaqItem[] = extraItems.map(({ question, answer, links }) => ({ question, answer, ...(links ? { links } : {}) }))
  const answers = (extra: ExtraFaqItem, item: SiteFaqItem) => extra.key === item.key || sameQuestion(extra.question, item.question)

  for (const item of standard) {
    const links = item.links.filter(sitePath)
    const existing = extraItems.findIndex((extra) => answers(extra, item))
    if (existing === -1) {
      if (items.some((other) => sameQuestion(other.question, item.question))) continue
      items.push({ question: item.question, answer: item.answer, ...(links.length > 0 ? { links } : {}) })
    } else if (links.length > 0) {
      items[existing] = { ...items[existing], links: appendLinks(items[existing].links, links) }
    }
  }
  return items
}
