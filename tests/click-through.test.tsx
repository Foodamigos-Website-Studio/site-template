// The click-through (F-TP, TP.6): home → "What are you known for?" links → every dish page → their links, and the
// sitemap, rendered from the site API as it answered after real seo-work ticks wrote the pages.
//
// tests/fixtures/site-api/click-through/ was recorded on the local stack on 27 Nov 2026 (Website Studio v2 backend
// feature/tp-dish-pages-home-faq-on at fd75ada, agent feature/tp-dish-pages-home-faq-on at 1fdf4ec): website 42
// (Trattoria Bella, German, capability=pages) set live, then Max's real seo-work ticks on the AI Gateway picked its
// keywords (keyword_pick) and wrote three dish pages (tag_write) and the home FAQ (faq_write); the menu is the shared
// local shop's "Local Partner Berlin" (three pizzas, pickup only). Each file is the backend's response body as served
// (GET /api/projects/{uuid}{path}), only re-indented; tag-page-not-found.json keeps the 404's message without the
// local debug trace. After a rank drop of Pizza Salami from 2 to 8 (SH.1's alert path) queued a tag_refresh, the next
// tick rewrote that page: tag-page-pizza-salami-refreshed.json and tag-pages-refreshed.json.
import type { ReactElement } from "react"
import { renderToReadableStream } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import companiesFixture from "./fixtures/site-api/click-through/companies.json"
import faqFixture from "./fixtures/site-api/click-through/faq.json"
import menuFixture from "./fixtures/site-api/click-through/menu.json"
import pageMetaFixture from "./fixtures/site-api/click-through/page-meta.json"
import projectFixture from "./fixtures/site-api/click-through/project.json"
import funghiFixture from "./fixtures/site-api/click-through/tag-page-pizza-funghi.json"
import margheritaFixture from "./fixtures/site-api/click-through/tag-page-pizza-margherita.json"
import salamiRefreshedFixture from "./fixtures/site-api/click-through/tag-page-pizza-salami-refreshed.json"
import salamiFixture from "./fixtures/site-api/click-through/tag-page-pizza-salami.json"
import notFoundFixture from "./fixtures/site-api/click-through/tag-page-not-found.json"
import tagPagesRefreshedFixture from "./fixtures/site-api/click-through/tag-pages-refreshed.json"
import tagPagesFixture from "./fixtures/site-api/click-through/tag-pages.json"

const modulesOn = vi.hoisted(() => ({ list: [] as string[] }))

vi.mock("@/lib/config", async (original) => ({
  ...(await original<typeof import("@/lib/config")>()),
  hasModule: (module: string) => modulesOn.list.includes(module),
}))

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

import Home from "@/app/page"
import sitemap from "@/app/sitemap"
import { TagPageRoute } from "@/components/seo/tag-page"
import { localizedRoute } from "@/lib/localized-routes"
import { config as proxyConfig } from "@/proxy"

type Recorded = { status: number; body: unknown }

const SITE = "https://trattoria-bella.test"

/** The site API as recorded after the ticks: every request answered from the recordings, unknown slugs with the 404. */
function recordedSiteApi(refreshed = false): Record<string, Recorded> {
  const ok = (body: unknown): Recorded => ({ status: 200, body })
  return {
    "": ok(projectFixture),
    "/companies": ok(companiesFixture),
    "/menu": ok(menuFixture),
    "/page-meta?lang=de": ok(pageMetaFixture),
    "/faq?lang=de": ok(faqFixture),
    "/tag-pages?lang=de": ok(refreshed ? tagPagesRefreshedFixture : tagPagesFixture),
    "/tag-pages/pizza-margherita?lang=de": ok(margheritaFixture),
    "/tag-pages/pizza-salami?lang=de": ok(refreshed ? salamiRefreshedFixture : salamiFixture),
    "/tag-pages/pizza-funghi?lang=de": ok(funghiFixture),
  }
}

function replay(recorded: Record<string, Recorded>) {
  const calls: string[] = []
  vi.stubGlobal("fetch", async (input: string) => {
    const url = new URL(input)
    const path = `${url.pathname.replace(/^\/api\/projects\/[^/]+/, "")}${url.search}`
    calls.push(path)
    const json = ({ status, body }: Recorded) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
    const answer = recorded[path]
    if (answer) return json(answer)
    if (path.startsWith("/tag-pages/")) return json({ status: 404, body: notFoundFixture })
    return json({ status: 404, body: { message: "Not found." } })
  })
  return calls
}

/** The whole page as the server renders it, async components (SiteFaq) included. */
async function renderPage(element: ReactElement) {
  const stream = await renderToReadableStream(element)
  await stream.allReady
  return new Response(stream).text()
}

const renderTagPage = async (slug: string) => renderPage(await TagPageRoute({ params: Promise.resolve({ slug }) }))

function links(html: string): string[] {
  return [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
}

function h1(html: string): string | null {
  return html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? null
}

function faqPages(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]))
    .filter((data) => data["@type"] === "FAQPage")
}

/** What schema.org and Google require of FAQPage: questions with a name and an accepted answer with text. */
function expectValidFaqPage(data: { "@context": string; mainEntity: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[] }, questions: number) {
  expect(data["@context"]).toBe("https://schema.org")
  expect(data.mainEntity).toHaveLength(questions)
  for (const question of data.mainEntity) {
    expect(question["@type"]).toBe("Question")
    expect(question.name.trim()).not.toBe("")
    expect(question.acceptedAnswer["@type"]).toBe("Answer")
    expect(question.acceptedAnswer.text.trim()).not.toBe("")
  }
}

let sitemapPaths: string[] = []

/** Where a link on the site leads, for the paths the site itself serves (next build's routes, proxy.ts). */
async function follow(path: string): Promise<"dish page" | "site page" | "online shop"> {
  if (path.startsWith("/tags/")) {
    const html = await renderTagPage(decodeURIComponent(path.slice("/tags/".length)))
    expect(h1(html)).toBeTruthy()
    return "dish page"
  }
  if (path === "/menu" || path.startsWith("/menu/")) {
    expect(proxyConfig.matcher).toContain("/menu")
    return "online shop"
  }
  // A page of the template: in the sitemap (served and indexed) or a localized legal page the proxy serves.
  const served = sitemapPaths.includes(path) || localizedRoute(path, "de").kind === "rewrite" || path === "/impressum"
  expect(served, `${path} is a page the site serves`).toBe(true)
  return "site page"
}

beforeEach(async () => {
  modulesOn.list = ["online_shop", "reservations"]
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE)
  replay(recordedSiteApi())
  sitemapPaths = (await sitemap()).map((entry) => entry.url.replace(SITE, ""))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe("click-through: keyword save → dish pages → home FAQ → sitemap (recorded after real ticks)", () => {
  it("home shows the four standard questions with FAQPage schema, and known-for links every live dish page", async () => {
    const html = await renderPage(await Home())

    for (const item of faqFixture.data.items) expect(html).toContain(item.question)
    const [faq] = faqPages(html)
    expectValidFaqPage(faq, 4)
    expect(faq.mainEntity.map((question: { name: string }) => question.name)).toEqual(faqFixture.data.items.map((item) => item.question))

    const live = tagPagesFixture.data.map((page) => `/tags/${page.slug}`)
    const tagLinks = links(html).filter((href) => href.startsWith("/tags/"))
    expect(tagLinks).toEqual(live)
    expect(live).toEqual(["/tags/pizza-margherita", "/tags/pizza-salami", "/tags/pizza-funghi"])
  })

  it("every link on home opens: each dish page renders with its H1, copy, menu items, CTAs and a valid FAQPage", async () => {
    const homeLinks = links(await renderPage(await Home()))
    expect(homeLinks.length).toBeGreaterThan(0)

    for (const path of homeLinks) {
      expect(await follow(path)).toBe("dish page")
      const slug = path.slice("/tags/".length)
      const page = recordedSiteApi()[`/tag-pages/${slug}?lang=de`].body as typeof salamiFixture
      const html = await renderTagPage(slug)

      expect(h1(html)).toBe(page.data.title)
      expect(page.data.title).toMatch(/ bei Trattoria Bella$/)
      expect(page.data.paragraphs.length).toBeGreaterThanOrEqual(2)
      for (const paragraph of page.data.paragraphs) expect(html).toContain(`<p>${paragraph}</p>`)
      expect(html).toContain('data-slot="menu-item"')
      expect(html).toContain('data-cta="order_online"')
      expect(html).toContain('data-cta="full_menu"')
      expect(html).toContain('data-cta="book_table"')
      expect(page.data.faq.length).toBeGreaterThanOrEqual(3)
      expectValidFaqPage(faqPages(html)[0], page.data.faq.length)
    }
  })

  it("follows every link on every dish page: dish pages, the site's own pages and the online shop", async () => {
    for (const { slug } of tagPagesFixture.data) {
      const targets = await Promise.all(links(await renderTagPage(slug)).map(follow))
      expect(targets).toContain("online shop")
      expect(targets).toContain("site page")
    }
  })

  it("lists every live dish page in the sitemap, and every dish path in it opens", async () => {
    const dishPaths = sitemapPaths.filter((path) => path.startsWith("/tags/"))
    expect(dishPaths).toEqual(tagPagesFixture.data.map((page) => `/tags/${page.slug}`))
    expect(dishPaths).not.toContain("/tags/preview")
    for (const path of dishPaths) expect(await follow(path)).toBe("dish page")
  })

  it("answers an unknown slug with the site's 404 page", async () => {
    await expect(TagPageRoute({ params: Promise.resolve({ slug: "unknown-slug" }) })).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" })
  })

  it("after the 2 → 8 drop's tag_refresh the dish page shows the new copy under the same slug (E9, AC9)", async () => {
    const before = await renderTagPage("pizza-salami")
    replay(recordedSiteApi(true))
    const after = await renderTagPage("pizza-salami")

    expect(salamiRefreshedFixture.data.slug).toBe(salamiFixture.data.slug)
    expect(salamiRefreshedFixture.data.updatedAt > salamiFixture.data.updatedAt).toBe(true)
    for (const paragraph of salamiRefreshedFixture.data.paragraphs) {
      expect(salamiFixture.data.paragraphs).not.toContain(paragraph)
      expect(after).toContain(`<p>${paragraph}</p>`)
      expect(before).not.toContain(`<p>${paragraph}</p>`)
    }
    expect(h1(after)).toBe(salamiRefreshedFixture.data.title)
    expectValidFaqPage(faqPages(after)[0], salamiRefreshedFixture.data.faq.length)
    const home = await renderPage(await Home())
    expect(links(home).filter((href) => href.startsWith("/tags/"))).toContain("/tags/pizza-salami")
  })
})
