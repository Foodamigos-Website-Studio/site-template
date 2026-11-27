// The home FAQ (F-TP): the four standard questions Max writes (GET /faq: known for, meals, delivery or takeout, areas),
// merged with the questions the site's home already has (extraItems, e.g. v0's own FAQ). The template adds no FAQ text:
// questions and answers come from /faq in the site's language, or from the site's own items.
import type { FaqItem, FaqLink } from "./faq"
import type { SiteFaqItem, SiteFaqKey } from "./studio-api"

/** A question the site's home already has. `key` says which standard question it answers, if any. */
export type ExtraFaqItem = FaqItem & { key?: SiteFaqKey }

/** A question's words without case or punctuation: "Do you offer delivery?" → do, you, offer, delivery. */
function words(text: string): string[] {
  return text
    .normalize("NFKC")
    .toLocaleLowerCase()
    .split(/[\p{P}\p{S}\s]+/u)
    .filter((word) => word !== "")
}

/** Questions compared without case, spacing or punctuation: "Do you offer delivery?" = "do you offer delivery". */
function sameQuestion(a: string, b: string): boolean {
  const left = words(a).join("")
  return left !== "" && left === words(b).join("")
}

/**
 * The site's own question asks a standard one in other words when every word of the shorter question is in the longer
 * one: "Do you offer delivery?" asks "Do you offer delivery or takeout?" (TP.QF0.2), "Liefert ihr?" asks "Liefert ihr
 * oder kann ich abholen?". The shorter one needs at least two words, so "Delivery?" alone stays its own question.
 */
function asksSame(own: string, standard: string): boolean {
  if (sameQuestion(own, standard)) return true
  const [shorter, longer] = [new Set(words(own)), new Set(words(standard))].sort((a, b) => a.size - b.size)
  return shorter.size >= 2 && [...shorter].every((word) => longer.has(word))
}

/**
 * Only the site's own paths (/tags/...): never another host or a javascript: link. A strict allow-list, because browsers
 * read "/\evil.test" like "//evil.test" (another host); the backend builds these paths from slugs.
 */
const SITE_PATH = /^\/[A-Za-z0-9\-_/]*$/

export function sitePath(link: FaqLink): boolean {
  return SITE_PATH.test(link.path) && !link.path.startsWith("//") && link.label.trim() !== ""
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
 * key, the same question, or the same question in fewer words: see asksSame). Each of the site's questions stands in
 * for one standard question at most, the first it matches (by key first). When the site already answers "What are you
 * known for?", the links to the live dish pages are appended to its answer instead, so no question shows twice.
 */
export function mergeFaq(standard: readonly SiteFaqItem[], extraItems: readonly ExtraFaqItem[] = []): FaqItem[] {
  const items: FaqItem[] = extraItems.map(({ question, answer, links }) => ({ question, answer, ...(links ? { links } : {}) }))
  const claimed = new Set<number>()
  const answering = (item: SiteFaqItem) => {
    const free = (match: (extra: ExtraFaqItem) => boolean) => extraItems.findIndex((extra, index) => !claimed.has(index) && match(extra))
    const byKey = extraItems.findIndex((extra) => extra.key === item.key)
    const index = byKey !== -1 ? byKey : free((extra) => extra.key === undefined && asksSame(extra.question, item.question))
    if (index !== -1) claimed.add(index)
    return index
  }

  for (const item of standard) {
    const links = item.links.filter(sitePath)
    const existing = answering(item)
    if (existing === -1) {
      if (items.some((other) => sameQuestion(other.question, item.question))) continue
      items.push({ question: item.question, answer: item.answer, ...(links.length > 0 ? { links } : {}) })
    } else if (links.length > 0) {
      items[existing] = { ...items[existing], links: appendLinks(items[existing].links, links) }
    }
  }
  return items
}
