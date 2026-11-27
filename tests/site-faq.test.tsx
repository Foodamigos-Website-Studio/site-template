// The home FAQ (F-TP, TP.3). GET /faq is replayed from tests/fixtures/site-api/faq*.json, copied unchanged from the
// Website Studio v2 backend's tests/Fixtures/site-api/ (TP.1, feature/tp-dish-pages-home-faq-on at c5c3f80), where they
// were recorded from the real route on the local stack for website 42 (German): faq (one live dish page),
// faq-no-live-pages and faq-empty (no FAQ written yet).
import type { ReactElement } from "react"
import { renderToReadableStream, renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import faqEmptyFixture from "./fixtures/site-api/faq-empty.json"
import faqNoLivePagesFixture from "./fixtures/site-api/faq-no-live-pages.json"
import faqFixture from "./fixtures/site-api/faq.json"

import { SiteFaq } from "@/components/seo/site-faq"
import { faqPage } from "@/lib/faq"
import { type ExtraFaqItem, mergeFaq, sitePath } from "@/lib/site-faq"
import { getFaq, type SiteFaqItem } from "@/lib/studio-api"
import Home from "@/app/page"

const standard = faqFixture.data.items as SiteFaqItem[]

// TP.QF0.2 (found in TP.7): the English /faq's four questions (AC15), a v0 home that already asks a shorter delivery question.
const english: SiteFaqItem[] = [
  { ...standard[0], question: "What are you known for?" },
  { ...standard[1], question: "What meals do you serve?" },
  { ...standard[2], question: "Do you offer delivery or takeout?" },
  { ...standard[3], question: "What areas do you serve?" },
]

/** The site API as recorded: /faq answered with `faq` (or a status), the project for the home page. */
function replaySiteApi(faq: { status: number; body: unknown } | "offline") {
  const calls: string[] = []
  vi.stubGlobal("fetch", async (input: string) => {
    const url = new URL(input)
    calls.push(`${url.pathname.replace(/^\/api\/projects\/[^/]+/, "")}${url.search}`)
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
    if (url.pathname.endsWith("/faq")) {
      if (faq === "offline") throw new TypeError("fetch failed")
      return json(faq.status, faq.body)
    }
    if (/\/api\/projects\/[^/]+$/.test(url.pathname)) return json(200, { data: { name: "Trattoria Bella", tagline: null } })
    return json(404, { message: "Not found." })
  })
  return calls
}

async function renderSiteFaq(props: Parameters<typeof SiteFaq>[0] = {}) {
  const element = await SiteFaq(props)
  return element ? renderToStaticMarkup(element) : ""
}

/** The whole page as the server renders it, async components (SiteFaq) included. */
async function renderPage(element: ReactElement) {
  const stream = await renderToReadableStream(element)
  await stream.allReady
  return new Response(stream).text()
}

function jsonLd(html: string) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  return match ? JSON.parse(match[1]) : null
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("site API contract (TP.1's recorded /faq)", () => {
  it("reads the four standard questions in the site's language, known_for linking the live dish pages", async () => {
    const calls = replaySiteApi({ status: 200, body: faqFixture })
    const faq = await getFaq("de")
    expect(calls).toEqual(["/faq?lang=de"])
    expect(faq?.items.map((item) => item.key)).toEqual(["known_for", "meals", "service", "areas"])
    expect(faq?.items[0].links).toEqual([{ label: "Poke Bowl", path: "/tags/poke-bowl" }])
    expect(faq?.items.slice(1).every((item) => item.links.length === 0)).toBe(true)
  })

  it("reads {items: []} before Max wrote the FAQ, and null when the site API fails", async () => {
    replaySiteApi({ status: 200, body: faqEmptyFixture })
    expect(await getFaq("de")).toEqual({ items: [] })
    replaySiteApi({ status: 500, body: { message: "Server Error" } })
    expect(await getFaq("de")).toBeNull()
  })
})

describe("home FAQ section", () => {
  it("shows the four German questions from /faq, the known-for answer linking every live dish page", async () => {
    replaySiteApi({ status: 200, body: faqFixture })
    const html = await renderSiteFaq()
    for (const item of standard) {
      expect(html).toContain(`<summary>${item.question}</summary>`)
      expect(html).toContain(item.answer)
    }
    expect(html.match(/<details>/g)).toHaveLength(4)
    expect(html).toContain('<li><a href="/tags/poke-bowl">Poke Bowl</a></li>')
    expect(html).toContain("<h2>Häufige Fragen</h2>")
  })

  it("with no live dish pages: the known-for answer has no links and the other questions still show", async () => {
    replaySiteApi({ status: 200, body: faqNoLivePagesFixture })
    const html = await renderSiteFaq()
    expect(html.match(/<details>/g)).toHaveLength(4)
    expect(html).not.toContain("<a ")
    expect(html).not.toContain('data-slot="faq-links"')
  })

  it.each([
    ["is empty (no FAQ written yet)", { status: 200, body: faqEmptyFixture }],
    ["answers 500", { status: 500, body: { message: "Server Error" } }],
    ["answers 404", { status: 404, body: { message: "Not found." } }],
    ["is offline", "offline"],
  ] as const)("is left out when /faq %s: no heading, no error text", async (_, faq) => {
    replaySiteApi(faq)
    expect(await SiteFaq({})).toBeNull()
  })

  it("leaves the home page standing without the section when /faq fails", async () => {
    replaySiteApi({ status: 500, body: { message: "Server Error" } })
    const html = await renderPage(await Home())
    expect(html).toContain("<h1>Trattoria Bella</h1>")
    expect(html).not.toContain('data-slot="faq"')
    expect(html).not.toContain("<h2>")
    expect(html).not.toMatch(/error/i)
  })

  it("is on the home page with the recorded /faq", async () => {
    replaySiteApi({ status: 200, body: faqFixture })
    const html = await renderPage(await Home())
    expect(html).toContain("<h1>Trattoria Bella</h1>")
    expect(html.match(/<details>/g)).toHaveLength(4)
    expect(html).toContain('<a href="/tags/poke-bowl">Poke Bowl</a>')
  })
})

describe("merge with the home's own questions (extraItems)", () => {
  const delivery: ExtraFaqItem = { question: "Liefert ihr oder kann ich abholen?", answer: "Ja, wir liefern bis 22 Uhr." }

  it("adds no standard question the home already has (same question): no duplicate", () => {
    const items = mergeFaq(standard, [delivery])
    expect(items.map((item) => item.question)).toEqual([
      "Liefert ihr oder kann ich abholen?",
      "Wofür seid ihr bekannt?",
      "Welche Gerichte gibt es bei euch?",
      "In welche Gegenden liefert ihr?",
    ])
    expect(items[0].answer).toBe("Ja, wir liefern bis 22 Uhr.")
  })

  it("matches questions without case, spacing or punctuation, and by the standard key", () => {
    const items = mergeFaq(standard, [
      { question: "  liefert ihr ODER kann ich abholen ", answer: "Ja." },
      { key: "areas", question: "Wohin kommt ihr?", answer: "Nach Mitte und Wedding." },
    ])
    expect(items).toHaveLength(4)
    expect(items.map((item) => item.question)).not.toContain("In welche Gegenden liefert ihr?")
  })


  it("adds no 'Do you offer delivery or takeout?' when the home already asks 'Do you offer delivery?' (E5), known-for links appended", () => {
    const items = mergeFaq(english, [{ question: "Do you offer delivery?", answer: "Yes, until 10 pm." }])
    expect(items.map((item) => item.question)).toEqual([
      "Do you offer delivery?",
      "What are you known for?",
      "What meals do you serve?",
      "What areas do you serve?",
    ])
    expect(items[0].answer).toBe("Yes, until 10 pm.")
    expect(items[1].links).toEqual([{ label: "Poke Bowl", path: "/tags/poke-bowl" }])
  })

  it("matches a shorter own question whose words are all in a standard one, in German too, each to one standard question", () => {
    const items = mergeFaq(standard, [{ question: "Liefert ihr?", answer: "Ja." }])
    // "Liefert ihr?" is in the service question and the areas question: it answers the first, the areas one is still added.
    expect(items.map((item) => item.question)).toEqual([
      "Liefert ihr?",
      "Wofür seid ihr bekannt?",
      "Welche Gerichte gibt es bei euch?",
      "In welche Gegenden liefert ihr?",
    ])
    const takeout = mergeFaq(english, [{ question: "Do you offer delivery or takeout to my area?", answer: "Yes." }])
    expect(takeout.map((item) => item.question)).not.toContain("Do you offer delivery or takeout?")
    expect(takeout).toHaveLength(4)
  })

  it("keeps a different question that merely shares words with a standard one", () => {
    const items = mergeFaq(english, [
      { question: "Do you offer catering?", answer: "Yes." },
      { question: "Delivery?", answer: "Yes." },
    ])
    expect(items.map((item) => item.question)).toEqual(["Do you offer catering?", "Delivery?", ...english.map((item) => item.question)])
  })

  it("appends the known-for links to the home's own known-for answer, each link once", () => {
    const own: ExtraFaqItem = { key: "known_for", question: "Was macht euch aus?", answer: "Unsere Bowls.", links: [{ label: "Poke Bowl", path: "/tags/poke-bowl" }, { label: "Speisekarte", path: "/speisekarte" }] }
    const items = mergeFaq(
      [{ ...standard[0], links: [...standard[0].links, { label: "Acai Bowl", path: "/tags/acai-bowl" }] }, ...standard.slice(1)],
      [own],
    )
    expect(items).toHaveLength(4)
    expect(items[0]).toEqual({
      question: "Was macht euch aus?",
      answer: "Unsere Bowls.",
      links: [{ label: "Poke Bowl", path: "/tags/poke-bowl" }, { label: "Speisekarte", path: "/speisekarte" }, { label: "Acai Bowl", path: "/tags/acai-bowl" }],
    })
    expect(items.map((item) => item.question)).not.toContain("Wofür seid ihr bekannt?")
  })

  it("keeps the home's other questions and adds every standard one it lacks after them", () => {
    const items = mergeFaq(standard, [{ question: "Habt ihr vegane Gerichte?", answer: "Ja." }])
    expect(items.map((item) => item.question)).toEqual(["Habt ihr vegane Gerichte?", ...standard.map((item) => item.question)])
    expect(items[1].links).toEqual([{ label: "Poke Bowl", path: "/tags/poke-bowl" }])
  })

  it("links only the site's own paths", () => {
    const items = mergeFaq([{ ...standard[0], links: [{ label: "x", path: "https://evil.test" }, { label: "y", path: "//evil.test" }, { label: "z", path: "javascript:alert(1)" }] }])
    expect(items[0].links).toBeUndefined()
  })

  it("renders one section with the home's questions when /faq is down", async () => {
    replaySiteApi({ status: 500, body: {} })
    const html = await renderSiteFaq({ extraItems: [delivery] })
    expect(html.match(/<details>/g)).toHaveLength(1)
    expect(html.match(/<script/g)).toHaveLength(1)
  })

  it("renders the merged FAQ as one FAQ block with one FAQPage", async () => {
    replaySiteApi({ status: 200, body: faqFixture })
    const html = await renderSiteFaq({ extraItems: [delivery] })
    expect(html.match(/<details>/g)).toHaveLength(4)
    expect(html.match(/<script/g)).toHaveLength(1)
    expect(jsonLd(html).mainEntity).toHaveLength(4)
  })

  it("renders an English home that asks 'Do you offer delivery?' with four questions, one FAQPage and the known-for link (E5)", async () => {
    replaySiteApi({ status: 200, body: { data: { items: english } } })
    const html = await renderSiteFaq({ extraItems: [{ question: "Do you offer delivery?", answer: "Yes, until 10 pm." }] })
    expect(html.match(/<details>/g)).toHaveLength(4)
    expect(html).not.toContain("Do you offer delivery or takeout?")
    expect(html).toContain('<li><a href="/tags/poke-bowl">Poke Bowl</a></li>')
    expect(jsonLd(html).mainEntity.map((entity: { name: string }) => entity.name)).toEqual([
      "Do you offer delivery?",
      "What are you known for?",
      "What meals do you serve?",
      "What areas do you serve?",
    ])
  })
})

describe("home FAQ JSON-LD", () => {
  it("is a valid FAQPage of the four questions, the known-for answer naming its dish pages", async () => {
    replaySiteApi({ status: 200, body: faqFixture })
    const ld = jsonLd(await renderSiteFaq())
    expect(ld["@context"]).toBe("https://schema.org")
    expect(ld["@type"]).toBe("FAQPage")
    expect(ld.mainEntity).toHaveLength(4)
    for (const entity of ld.mainEntity) {
      expect(entity["@type"]).toBe("Question")
      expect(entity.acceptedAnswer["@type"]).toBe("Answer")
      expect(entity.acceptedAnswer.text.length).toBeGreaterThan(0)
    }
    expect(ld.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Wofür seid ihr bekannt?",
      acceptedAnswer: { "@type": "Answer", text: "Für frische Poke Bowls, Hawaiian Currys und Acai Bowls in Berlin Mitte. Poke Bowl" },
    })
    expect(ld).toEqual(faqPage(mergeFaq(standard)))
  })

  it("escapes an answer or a dish name containing <script>", async () => {
    const body = { data: { items: [{ ...standard[0], answer: "</script><script>alert(1)</script>", links: [{ label: "<script>x</script>", path: "/tags/x" }] }] } }
    replaySiteApi({ status: 200, body })
    const html = await renderSiteFaq()
    const script = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]
    expect(script).not.toContain("<")
    expect(html.match(/<script/g)).toHaveLength(1)
    expect(jsonLd(html).mainEntity[0].acceptedAnswer.text).toBe("</script><script>alert(1)</script> <script>x</script>")
  })
})

// Sterling's review of TP.3: a backslash after the first slash ("/\evil.test") is read by browsers like
// "//evil.test", another host. Only the site's own slug paths become links.
describe("known-for links stay on the site", () => {
  it.each(["/\\evil.test", "//evil.test", "/tags/x?y=1", "javascript:alert(1)", "https://evil.test/tags/x", "/tags/ä"])(
    "refuses %s",
    (path) => {
      expect(sitePath({ label: "Pizza", path })).toBe(false)
    },
  )

  it.each(["/tags/pizza-margherita", "/tags/lasagne_al_forno", "/"])("keeps %s", (path) => {
    expect(sitePath({ label: "Pizza", path })).toBe(true)
  })
})
