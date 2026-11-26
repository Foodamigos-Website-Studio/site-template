// TP.8: the draft-only dish page fixture at /tags/preview. The site API answers are TP.1's recorded responses in
// tests/fixtures/site-api/ (menu.json, tag-pages.json, tag-page.json, tag-page-not-found.json), recorded from the real
// routes on the local stack for website 42. VERCEL_ENV is read when lib/config.ts loads, so each case loads the route
// fresh under the env it names (lib/config.ts is not mocked here: its env values are what the test sets).
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import menuFixture from "./fixtures/site-api/menu.json"
import tagPageNotFoundFixture from "./fixtures/site-api/tag-page-not-found.json"
import tagPageFixture from "./fixtures/site-api/tag-page.json"
import tagPagesFixture from "./fixtures/site-api/tag-pages.json"

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

import { sitemapPaths } from "@/lib/site-pages"
import type { Menu, Project } from "@/lib/studio-api"
import { PREVIEW_TAG_SLUG, previewTagPage, TAG_PAGE_PREVIEW_COPY, tagPagePreviewCopy } from "@/lib/tag-page-preview"
import { TAG_PAGE_LABELS } from "@/lib/tag-pages"

const menu = menuFixture.data as unknown as Menu
const firstThree = menu.companies.flatMap((company) => company.menus.flatMap((group) => group.categories.flatMap((category) => category.products))).slice(0, 3)
const emptyMenu = { currency: "EUR", companies: [{ company_uuid: "x", name: "x", currency: "EUR", menus: [] }] }
const project = { name: "Trattoria Bella", has_online_shop: true, online_shop_url: "https://shop.test", has_reservations: true, reservation_url: "https://book.test" }

type Answers = { project?: unknown; menu?: unknown; livePreview?: boolean; down?: boolean }

/** The site API as recorded; `down` answers every request with a 503, `livePreview` lists a live page "preview". */
function siteApi({ project: projectBody = project, menu: menuBody = menuFixture.data, livePreview = false, down = false }: Answers = {}) {
  const calls: string[] = []
  vi.stubGlobal("fetch", async (input: string) => {
    const url = new URL(input)
    const path = url.pathname.replace(/^\/api\/projects\/[^/]+/, "")
    calls.push(path)
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
    if (down) return json(503, { message: "Service Unavailable" })
    if (path === "") return json(200, { data: projectBody })
    if (path === "/menu") return json(200, { data: menuBody })
    if (path === "/page-meta") return json(200, { data: [] })
    if (path === "/tag-pages") return json(200, livePreview ? { data: [...tagPagesFixture.data, { slug: "preview", keyword: "Preview", updatedAt: null }] } : tagPagesFixture)
    if (path === "/tag-pages/poke-bowl") return json(200, tagPageFixture)
    if (path === "/tag-pages/preview" && livePreview) return json(200, { data: { ...tagPageFixture.data, slug: "preview", title: "A live page called preview" } })
    if (path.startsWith("/tag-pages/")) return json(404, tagPageNotFoundFixture)
    return json(404, { message: "Not found." })
  })
  return calls
}

/** The route as a deployment with this VERCEL_ENV loads it (undefined: v0's sandbox and pnpm dev). */
async function route(vercelEnv: string | undefined, language = "de") {
  vi.resetModules()
  vi.stubEnv("VERCEL_ENV", vercelEnv)
  vi.stubEnv("NEXT_PUBLIC_SITE_LANGUAGE", language)
  vi.stubEnv("NEXT_PUBLIC_SITE_MODULES", "online_shop,reservations")
  return import("@/components/seo/tag-page")
}

const params = (slug: string) => ({ params: Promise.resolve({ slug }) })

async function renderRoute(vercelEnv: string | undefined, slug: string, language = "de") {
  const { TagPageRoute } = await route(vercelEnv, language)
  return renderToStaticMarkup(await TagPageRoute(params(slug)))
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe("/tags/preview outside production (v0's sandbox, pnpm dev, preview deployments)", () => {
  for (const vercelEnv of [undefined, "preview", "development"]) {
    it(`renders the fixture through TagPageView with VERCEL_ENV ${vercelEnv ?? "unset"}`, async () => {
      const calls = siteApi()
      const html = await renderRoute(vercelEnv, PREVIEW_TAG_SLUG)
      expect(html).toContain('data-slot="tag-page"')
      expect(html).toContain('data-slug="preview"')
      expect(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]).toBe(`${firstThree[0].name} bei Trattoria Bella`)
      expect(html.match(/<article[^>]*>.*?<\/h1>(.*?)<(ul|section)/)?.[1].match(/<p>/g)).toHaveLength(2)
      expect(html.match(/<details>/g)).toHaveLength(3)
      expect(html.match(/data-slot="menu-item"/g)).toHaveLength(3)
      for (const product of firstThree) expect(html).toContain(product.name)
      expect(html.match(/<img /g)).toHaveLength(3)
      expect(html).toContain('href="/menu"')
      expect(html).toContain('href="/speisekarte"')
      expect(html).toContain('href="/reservierungen"')
      expect(html).toContain('"@type":"FAQPage"')
      // Only /project and /menu: no site API page with that slug, no new call.
      expect(calls.filter((path) => path.startsWith("/tag-pages"))).toEqual([])
      expect([...new Set(calls)].sort()).toEqual(["", "/menu"])
    })
  }

  it("uses the first 3 products of the recorded /menu, in menu order", () => {
    expect(previewTagPage(project as Project, menu, "en").productIds).toEqual(firstThree.map((product) => product.id))
    expect(firstThree.map((product) => product.id)).toEqual([21, 2, 1])
  })

  it("wins over a site API page with that slug", async () => {
    siteApi({ livePreview: true })
    const html = await renderRoute(undefined, PREVIEW_TAG_SLUG)
    expect(html).not.toContain("A live page called preview")
    expect(html).toContain(`${firstThree[0].name} bei Trattoria Bella`)
  })

  it("is noindex, nofollow in its metadata, with the fixture's meta texts and the /tags/preview canonical", async () => {
    siteApi()
    const { generateTagPageMetadata } = await route(undefined, "en")
    const meta = await generateTagPageMetadata(params(PREVIEW_TAG_SLUG))
    expect(meta.robots).toMatchObject({ index: false, follow: false, googleBot: { index: false, follow: false } })
    expect(meta.title).toBe(tagPagePreviewCopy("en").metaTitle(firstThree[0].name))
    expect(meta.description).toBe(tagPagePreviewCopy("en").metaDescription(firstThree[0].name))
    expect(String((meta.alternates as { canonical: string }).canonical)).toMatch(/\/tags\/preview$/)
  })

  it("with no menu products: the sample dish H1, copy, FAQ and CTAs, and no item grid", async () => {
    siteApi({ menu: emptyMenu })
    const html = await renderRoute(undefined, PREVIEW_TAG_SLUG)
    expect(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]).toBe(`${TAG_PAGE_PREVIEW_COPY.de.sampleDish} bei Trattoria Bella`)
    expect(html).toContain(TAG_PAGE_PREVIEW_COPY.de.paragraphs(TAG_PAGE_PREVIEW_COPY.de.sampleDish)[0])
    expect(html.match(/<details>/g)).toHaveLength(3)
    expect(html).toContain('data-slot="tag-page-ctas"')
    expect(html).not.toContain("tag-page-items")
    expect(html).not.toContain("menu-item")
  })

  it("with the site API down: the dish alone as H1, the copy and FAQ, no item grid, never an error", async () => {
    siteApi({ down: true })
    const html = await renderRoute(undefined, PREVIEW_TAG_SLUG)
    expect(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]).toBe(TAG_PAGE_PREVIEW_COPY.de.sampleDish)
    expect(html.match(/<details>/g)).toHaveLength(3)
    expect(html).not.toContain("tag-page-items")
  })
})

describe("/tags/preview in production (VERCEL_ENV production)", () => {
  it("is the site's 404 when no live page has that slug", async () => {
    siteApi()
    const { TagPageRoute, generateTagPageMetadata } = await route("production")
    await expect(TagPageRoute(params(PREVIEW_TAG_SLUG))).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" })
    expect(await generateTagPageMetadata(params(PREVIEW_TAG_SLUG))).toEqual({})
  })

  it("is an ordinary slug: a live page called preview renders from the site API, indexable", async () => {
    siteApi({ livePreview: true })
    const { generateTagPageMetadata } = await route("production")
    expect(await renderRoute("production", PREVIEW_TAG_SLUG)).toContain("A live page called preview")
    expect((await generateTagPageMetadata(params(PREVIEW_TAG_SLUG))).robots).toMatchObject({ index: true, follow: true })
  })
})

describe("real dish pages are unchanged", () => {
  for (const vercelEnv of [undefined, "preview", "production"]) {
    it(`renders a live slug from the site API with VERCEL_ENV ${vercelEnv ?? "unset"}`, async () => {
      siteApi()
      const html = await renderRoute(vercelEnv, "poke-bowl")
      expect(html).toContain("Poke Bowl bei Trattoria Bella")
      expect(html.match(/data-slot="menu-item"/g)).toHaveLength(3)
      const { generateTagPageMetadata } = await route(vercelEnv)
      expect((await generateTagPageMetadata(params("poke-bowl"))).robots).toMatchObject({ index: true, follow: true })
      const { TagPageRoute } = await route(vercelEnv)
      await expect(TagPageRoute(params("does-not-exist"))).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" })
    })
  }
})

describe("fixture copy", () => {
  it("exists for every language TAG_PAGE_LABELS has, with no empty text", () => {
    expect(Object.keys(TAG_PAGE_PREVIEW_COPY).sort()).toEqual(Object.keys(TAG_PAGE_LABELS).sort())
    for (const [language, copy] of Object.entries(TAG_PAGE_PREVIEW_COPY)) {
      const page = previewTagPage(project as Project, menu, language)
      expect(page.title).toContain(firstThree[0].name)
      expect(page.title).toContain("Trattoria Bella")
      expect(page.paragraphs).toHaveLength(2)
      expect(page.faq).toHaveLength(3)
      for (const text of [copy.sampleDish, ...page.paragraphs, ...page.faq.flatMap((item) => [item.question, item.answer]), page.metaTitle, page.metaDescription]) expect(text.trim()).not.toBe("")
    }
  })

  it("is in the site's language, never mixed: de and en written by hand, an unknown language gets en", () => {
    expect(previewTagPage(project as Project, menu, "de").title).toBe(`${firstThree[0].name} bei Trattoria Bella`)
    expect(previewTagPage(project as Project, menu, "en").title).toBe(`${firstThree[0].name} at Trattoria Bella`)
    expect(previewTagPage(project as Project, menu, "de").faq[1].question).toMatch(/online bestellen/)
    expect(previewTagPage(project as Project, menu, "en").faq[1].question).toMatch(/order .* online/)
    expect(tagPagePreviewCopy("nl")).toBe(TAG_PAGE_PREVIEW_COPY.en)
    const english = previewTagPage(project as Project, null, "en")
    const german = previewTagPage(project as Project, null, "de")
    for (const word of [" the ", " we ", " you "]) expect(german.paragraphs.join(" ").toLowerCase()).not.toContain(word)
    for (const word of [" und ", " wir ", " sie "]) expect(english.paragraphs.join(" ").toLowerCase()).not.toContain(word)
  })

  it("has meta texts within the site API's limits (title 10–60, description 50–160) for the recorded menu", () => {
    for (const language of Object.keys(TAG_PAGE_PREVIEW_COPY)) {
      for (const target of [menu, null]) {
        const page = previewTagPage(project as Project, target, language)
        expect(page.metaTitle.length).toBeGreaterThanOrEqual(10)
        expect(page.metaTitle.length).toBeLessThanOrEqual(60)
        expect(page.metaDescription.length).toBeGreaterThanOrEqual(50)
        expect(page.metaDescription.length).toBeLessThanOrEqual(160)
      }
    }
  })
})

describe("sitemap", () => {
  const modules = { menu: true, locations: false, reservations: false, giftCards: false }

  it("never lists /tags/preview: not from GET /tag-pages, not from GET /page-meta", () => {
    const withPreview = [...tagPagesFixture.data, { slug: "preview", keyword: "Preview", updatedAt: null }]
    const entries = [{ path: "/tags/preview", title: "x", description: "x", keywords: [], og_title: null, og_description: null, noindex: false }]
    expect(sitemapPaths("de", modules, entries, withPreview)).toEqual(["/", "/speisekarte", "/angebote", "/tags/poke-bowl"])
    expect(sitemapPaths("en", modules, null, tagPagesFixture.data)).toEqual(["/", "/our-menu", "/coupons", "/tags/poke-bowl"])
  })
})
