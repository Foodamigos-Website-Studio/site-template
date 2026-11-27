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

/** Word beginnings in English and German (the site languages). A word matches when it starts with one of them. */
const DELIVERS = ["deliver", "liefer", "beliefer", "zustell"]
const PICKUP = ["takeout", "takeaway", "pickup", "carryout", "collect", "abhol", "mitnehm"]
const PICKUP_PHRASES = [["pick", "up"], ["take", "out"], ["take", "away"], ["to", "go"]]
/**
 * Words that share a beginning with a delivery or pickup word but ask something else (TP.QF0.3 review): suppliers
 * ("Lieferanten"), collecting loyalty points or stamps, a collection. A question with one of them is never the delivery
 * or areas question.
 */
const NOT_DELIVERY = ["lieferant", "collection", "collector", "point", "punkt", "loyal", "reward", "stamp", "stempel", "bonus", "treue", "prämie"]
const AREA = ["area", "zone", "postcode", "zip", "district", "neighbo", "gegend", "gebiet", "stadtteil", "bezirk", "umkreis", "postleitzahl", "plz"]
/** German compounds that end in an area word: "Liefergebiet", "Lieferzone", "Lieferradius" (TP.QF0.4). */
const AREA_ENDS = ["gebiet", "zone", "radius", "umkreis", "gegend"]
/** Verbs that make an area word the areas question without a delivery word: "Which areas do you serve / cover?". */
const AREA_VERBS = ["serve", "serving", "cover", "reach", "bedien", "versorg", "abdeck"]
/** Whole words: "wo" as a word beginning would also match "Woche". */
const WHERE = new Set(["where", "wo", "wohin"])

/**
 * The known-for question (TP.QF0.4): "famous", "specialty" or "Spezialität" on their own, "known" or "bekannt" only with
 * "for"/"für"/"wofür" ("What is your restaurant known for?"), so "Is the allergen list known?" stays its own question.
 * "Daily specials" isn't a specialty: the beginnings need "specialt"/"speciali".
 */
const FAMOUS = ["famous", "specialt", "speciali", "signature", "berühmt", "spezialit"]
const KNOWN = ["known", "bekannt"]
const FOR = new Set(["for", "für", "wofür"])
/** The meals question (TP.QF0.4): a food word asked with what or which ("What's on the menu?", "Was gibt es zu essen?"). */
const FOOD = ["food", "meal", "dish", "menu", "cuisine", "essen", "gericht", "speise", "küche", "mahlzeit"]
const WHAT = new Set(["what", "which", "was", "welche", "welches", "welcher"])
/** A narrower food question (a diet, an allergen, a price, a time) stays its own question. */
const FOOD_DETAIL = [
  "vegan", "vegetar", "gluten", "allerg", "halal", "kosher", "koscher", "lactose", "laktose", "dairy", "nut", "nuss",
  "spicy", "scharf", "kid", "child", "kinder", "price", "cost", "preis", "kost", "time", "when", "wann", "uhr", "popular",
  "bestsell", "beliebt", "recommend", "empfehl",
]
/** A delivery detail (cost, time, minimum order) is another question than whether the restaurant delivers. */
const DETAIL = ["how", "what", "when", "which", "why", "fee", "cost", "price", "charge", "minimum", "long", "wie", "was", "wann", "welche", "warum", "wieviel", "kost", "gebühr", "preis", "mindest", "dauer", "lange"]

function has(list: readonly string[], all: readonly string[]): boolean {
  return all.some((word) => list.some((start) => word.startsWith(start)))
}

function hasPickup(all: readonly string[]): boolean {
  return has(PICKUP, all) || PICKUP_PHRASES.some(([a, b]) => all.some((word, i) => word === a && all[i + 1] === b))
}

function hasArea(all: readonly string[]): boolean {
  return has(AREA, all) || all.some((word) => has(DELIVERS, [word]) && AREA_ENDS.some((end) => word.endsWith(end)))
}

function asksWhere(all: readonly string[]): boolean {
  return hasArea(all) || all.some((word) => WHERE.has(word))
}

function asksKnownFor(all: readonly string[]): boolean {
  return has(FAMOUS, all) || (has(KNOWN, all) && all.some((word) => FOR.has(word)))
}

function asksMeals(all: readonly string[]): boolean {
  return has(FOOD, all) && all.some((word) => WHAT.has(word)) && !has(FOOD_DETAIL, all)
}

/**
 * The site's own question asks a standard one by its topic, in the usual wordings the word check misses (TP.QF0.3):
 * "Bietet ihr Lieferung an?", "Gibt es Lieferung?" and "Do you deliver?" ask the delivery or takeout question;
 * "Wohin liefert ihr?" and "Where do you deliver?" ask the areas question. A delivery detail ("How much does delivery
 * cost?", "Wie lange dauert die Lieferung?") stays its own question, and so does a one-word question. So do a question
 * about suppliers or loyalty points ("Arbeitet ihr mit regionalen Lieferanten?", "Do you collect loyalty points?") and
 * one about where to pick up ("Where can I pick up my order?"): only a delivery word makes a "where" the areas question.
 * TP.QF0.4: "Was ist euer Liefergebiet?", "Welche Gegenden beliefert ihr?" and "Which areas do you serve?" ask the areas
 * question; "What are you famous for?" and "Was ist eure Spezialität?" the known-for one; "What's on the menu?" and
 * "Welche Speisen bietet ihr an?" the meals one ("Which dishes are vegan?" stays its own question).
 */
function asksTopic(own: string, key: SiteFaqKey): boolean {
  const all = words(own)
  if (all.length < 2) return false
  if (key === "known_for") return asksKnownFor(all)
  if (key === "meals") return asksMeals(all)
  if (has(NOT_DELIVERY, all)) return false
  const delivers = has(DELIVERS, all)
  if (key === "areas") return (delivers && asksWhere(all)) || (hasArea(all) && has(AREA_VERBS, all))
  return key === "service" && (delivers || hasPickup(all)) && !asksWhere(all) && !has(DETAIL, all)
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
 * key, the same question, the same question in fewer words (asksSame), or the same topic (asksTopic)). Each of the site's questions stands in
 * for one standard question at most, the first it matches (by key first). When the site already answers "What are you
 * known for?", the links to the live dish pages are appended to its answer instead, so no question shows twice.
 */
export function mergeFaq(standard: readonly SiteFaqItem[], extraItems: readonly ExtraFaqItem[] = []): FaqItem[] {
  const items: FaqItem[] = extraItems.map(({ question, answer, links }) => ({ question, answer, ...(links ? { links } : {}) }))
  const claimed = new Set<number>()
  const answering = (item: SiteFaqItem) => {
    const free = (match: (extra: ExtraFaqItem) => boolean) => extraItems.findIndex((extra, index) => !claimed.has(index) && match(extra))
    const byKey = extraItems.findIndex((extra) => extra.key === item.key)
    const own = (match: (question: string) => boolean) => free((extra) => extra.key === undefined && match(extra.question))
    let index = byKey
    if (index === -1) index = own((question) => asksSame(question, item.question))
    if (index === -1) index = own((question) => asksTopic(question, item.key))
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
