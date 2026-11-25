// Dish pages (F-TP, TP.2). The site API answers are replayed from tests/fixtures/site-api/, copied unchanged from the
// Website Studio v2 backend's tests/Fixtures/site-api/ (TP.1, feature/tp-dish-pages-home-faq-on at c5c3f80), where they
// were recorded from the real routes on the local stack for website 42: tag-pages, tag-pages-empty, tag-page,
// tag-page-not-found and menu.
import { readdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import menuFixture from "./fixtures/site-api/menu.json"
import tagPageNotFoundFixture from "./fixtures/site-api/tag-page-not-found.json"
import tagPageFixture from "./fixtures/site-api/tag-page.json"
import tagPagesEmptyFixture from "./fixtures/site-api/tag-pages-empty.json"
import tagPagesFixture from "./fixtures/site-api/tag-pages.json"

const modulesOn = vi.hoisted(() => ({ list: [] as string[] }))

vi.mock("@/lib/config", async (original) => ({
  ...(await original<typeof import("@/lib/config")>()),
  hasModule: (module: string) => modulesOn.list.includes(module),
}))

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

import { FaqBlock } from "@/components/seo/faq-block"
import { generateTagPageMetadata, TagPageRoute, TagPageView } from "@/components/seo/tag-page"
import { faqPageJsonLd } from "@/lib/faq"
import { LOCALIZED_MATCHER, localizedRoute } from "@/lib/localized-routes"
import { sitemapPaths } from "@/lib/site-pages"
import { getMenu, getTagPage, getTagPages, type Menu, type Project, type TagPage } from "@/lib/studio-api"
import { MENU_IMAGE_HOSTS, menuImageAllowed, tagPageCtas, tagPageLabels, tagPageListed, TAG_PAGE_LABELS, tagPaths, tagProducts } from "@/lib/tag-pages"
import nextConfig from "@/next.config.mjs"
import { config as proxyConfig } from "@/proxy"

const menu = menuFixture.data as unknown as Menu
const page = tagPageFixture.data as TagPage

/** The site API as recorded: every request answered from the fixtures, an unknown slug with the recorded 404. */
function replaySiteApi() {
  const calls: string[] = []
  vi.stubGlobal("fetch", async (input: string) => {
    const url = new URL(input)
    calls.push(`${url.pathname.replace(/^\/api\/projects\/[^/]+/, "")}${url.search}`)
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
    if (url.pathname.endsWith("/tag-pages")) return json(200, tagPagesFixture)
    if (url.pathname.endsWith("/tag-pages/poke-bowl")) return json(200, tagPageFixture)
    if (url.pathname.includes("/tag-pages/")) return json(404, tagPageNotFoundFixture)
    if (url.pathname.endsWith("/menu")) return json(200, menuFixture)
    return json(404, { message: "Not found." })
  })
  return calls
}

const project = (overrides: Partial<Project> = {}) =>
  ({ name: "Trattoria Bella", has_online_shop: true, online_shop_url: "https://shop.test", has_reservations: true, reservation_url: "https://book.test", ...overrides }) as Project

function render(view: Parameters<typeof TagPageView>[0]) {
  return renderToStaticMarkup(<TagPageView {...view} />)
}

beforeEach(() => {
  modulesOn.list = ["online_shop", "reservations"]
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("site API contract (TP.1's recorded responses)", () => {
  it("reads the live dish pages, one page and the menu as the site API answers them", async () => {
    const calls = replaySiteApi()
    expect(await getTagPages("de")).toEqual([{ slug: "poke-bowl", keyword: "Poke Bowl", updatedAt: "2026-11-25T17:16:19+00:00" }])
    const tagPage = await getTagPage("poke-bowl", "de")
    expect(tagPage).toMatchObject({ slug: "poke-bowl", title: "Poke Bowl bei Trattoria Bella", productIds: [2, 1, 4] })
    expect(tagPage?.paragraphs).toHaveLength(3)
    expect(tagPage?.faq).toHaveLength(3)
    expect(tagProducts(await getMenu(), tagPage!.productIds).map((product) => product.id)).toEqual([2, 1, 4])
    expect(calls).toEqual(["/tag-pages?lang=de", "/tag-pages/poke-bowl?lang=de", "/menu"])
  })

  it("gets null for an unknown slug, a draft or a removed dish (the recorded 404)", async () => {
    replaySiteApi()
    expect(await getTagPage("does-not-exist", "de")).toBeNull()
  })

  it("lists no dish paths when there are no live pages, or when the site API failed", () => {
    expect(tagPaths(tagPagesEmptyFixture.data)).toEqual([])
    expect(tagPaths(null)).toEqual([])
  })
})

describe("dish page", () => {
  const products = tagProducts(menu, page.productIds)

  it("shows the h1, the paragraphs, the dish's menu items with photos, the CTAs and the FAQ with FAQPage JSON-LD", () => {
    const html = render({ page, products, ctas: tagPageCtas(project(), menu, "de"), labels: tagPageLabels("de"), language: "de" })
    expect(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]).toBe("Poke Bowl bei Trattoria Bella")
    for (const paragraph of page.paragraphs) expect(html).toContain(paragraph)
    expect(html.match(/data-slot="menu-item"/g)).toHaveLength(3)
    expect(html.indexOf("Poke Your Style Bowl")).toBeLessThan(html.indexOf("Green Cream Shrimp Bowl"))
    expect(html.match(/<img /g)).toHaveLength(3)
    expect(html).toContain("16,90")
    expect(html.match(/<details>/g)).toHaveLength(3)
    expect(html).toContain('href="/menu"')
    expect(html).toContain('href="/speisekarte"')
    expect(html).toContain('href="/reservierungen"')
    const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1])
    expect(jsonLd).toMatchObject({ "@context": "https://schema.org", "@type": "FAQPage" })
    expect(jsonLd.mainEntity).toHaveLength(3)
    expect(jsonLd.mainEntity[0]).toEqual({ "@type": "Question", name: page.faq[0].question, acceptedAnswer: { "@type": "Answer", text: page.faq[0].answer } })
  })

  it("with no menu items: h1, copy, FAQ and CTAs, and no empty item grid", () => {
    const html = render({ page: { ...page, productIds: [] }, products: tagProducts(menu, []), ctas: tagPageCtas(project(), menu, "de"), labels: tagPageLabels("de"), language: "de" })
    expect(html).toContain("<h1")
    expect(html).toContain(page.paragraphs[0])
    expect(html).toContain("<details>")
    expect(html).toContain('data-slot="tag-page-ctas"')
    expect(html).not.toContain("tag-page-items")
    expect(html).not.toContain(tagPageLabels("de").menuItems)
  })

  it("with one item and no photo: one item, no image, no empty box", () => {
    const noPhotos: Menu = { ...menu, companies: menu.companies.map((company) => ({ ...company, menus: company.menus.map((group) => ({ ...group, categories: group.categories.map((category) => ({ ...category, products: category.products.map((product) => ({ ...product, image_url: null })) })) })) })) }
    const html = render({ page: { ...page, productIds: [2] }, products: tagProducts(noPhotos, [2]), ctas: [], labels: tagPageLabels("en"), language: "en" })
    expect(html.match(/data-slot="menu-item"/g)).toHaveLength(1)
    expect(html).not.toContain("<img")
    expect(html).not.toContain("tag-page-ctas")
    expect(html).toContain("On our menu")
  })

  it("skips ids that are not on the menu (a removed dish) and shows each product once", () => {
    expect(tagProducts(menu, [999, 2, 2]).map((product) => product.id)).toEqual([2])
    expect(tagProducts(null, [2])).toEqual([])
  })

  it("shows Order online only with the online shop on and Book a table only with reservations on", () => {
    expect(tagPageCtas(project(), menu, "en").map((cta) => [cta.key, cta.href])).toEqual([["order_online", "/menu"], ["full_menu", "/our-menu"], ["book_table", "/reservations"]])
    modulesOn.list = []
    expect(tagPageCtas(project(), menu, "en").map((cta) => cta.key)).toEqual(["full_menu"])
    modulesOn.list = ["online_shop", "reservations"]
    expect(tagPageCtas(project({ has_online_shop: false, has_reservations: false }), menu, "en").map((cta) => cta.key)).toEqual(["full_menu"])
  })

  it("links View full menu only when the site has its menu page", () => {
    const empty: Menu = { currency: "EUR", companies: [{ company_uuid: "x", name: "x", currency: "EUR", menus: [] }] }
    expect(tagPageCtas(project(), empty, "de").map((cta) => cta.key)).toEqual(["order_online", "book_table"])
    const html = render({ page, products: [], ctas: tagPageCtas(project(), empty, "de"), labels: tagPageLabels("de"), language: "de" })
    expect(html).not.toContain("/speisekarte")
  })

  it("has every text in every language the template ships, de and en by hand", () => {
    const keys = Object.keys(TAG_PAGE_LABELS.en).sort()
    for (const labels of Object.values(TAG_PAGE_LABELS)) {
      expect(Object.keys(labels).sort()).toEqual(keys)
      for (const text of Object.values(labels)) expect(text.trim()).not.toBe("")
    }
    expect(tagPageLabels("de")).toMatchObject({ order_online: "Online bestellen", full_menu: "Ganze Speisekarte ansehen", book_table: "Tisch reservieren" })
    expect(tagPageLabels("en")).toMatchObject({ order_online: "Order online", full_menu: "View full menu", book_table: "Book a table" })
    expect(tagPageLabels("nl")).toBe(TAG_PAGE_LABELS.en)
  })

  it("answers an unknown slug with the site's 404 page (notFound)", async () => {
    replaySiteApi()
    await expect(TagPageRoute({ params: Promise.resolve({ slug: "does-not-exist" }) })).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" })
  })

  it("answers a page the live list no longer has (a cached draft or removed dish) with 404, and keeps it when the list failed", async () => {
    expect(tagPageListed(tagPagesFixture.data, "poke-bowl")).toBe(true)
    expect(tagPageListed(tagPagesEmptyFixture.data, "poke-bowl")).toBe(false)
    expect(tagPageListed(null, "poke-bowl")).toBe(true)
    replaySiteApi()
    const listed = globalThis.fetch
    vi.stubGlobal("fetch", async (input: string) => (new URL(input).pathname.endsWith("/tag-pages") ? new Response(JSON.stringify(tagPagesEmptyFixture), { status: 200 }) : listed(input)))
    await expect(TagPageRoute({ params: Promise.resolve({ slug: "poke-bowl" }) })).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" })
    expect(await generateTagPageMetadata({ params: Promise.resolve({ slug: "poke-bowl" }) })).toEqual({})
    vi.stubGlobal("fetch", async (input: string) => (new URL(input).pathname.endsWith("/tag-pages") ? new Response("down", { status: 503 }) : listed(input)))
    expect(renderToStaticMarkup(await TagPageRoute({ params: Promise.resolve({ slug: "poke-bowl" }) }))).toContain("Poke Bowl bei Trattoria Bella")
  })

  it("renders a live page from the site API and gives it its meta tags and canonical /tags path", async () => {
    replaySiteApi()
    const html = renderToStaticMarkup(await TagPageRoute({ params: Promise.resolve({ slug: "poke-bowl" }) }))
    expect(html).toContain("Poke Bowl bei Trattoria Bella")
    expect(html.match(/data-slot="menu-item"/g)).toHaveLength(3)
    const meta = await generateTagPageMetadata({ params: Promise.resolve({ slug: "poke-bowl" }) })
    expect(meta.title).toBe(page.metaTitle)
    expect(meta.description).toBe(page.metaDescription)
    expect(String((meta.alternates as { canonical: string }).canonical)).toMatch(/\/tags\/poke-bowl$/)
    expect(meta.robots).toMatchObject({ index: true, follow: true })
    expect(await generateTagPageMetadata({ params: Promise.resolve({ slug: "does-not-exist" }) })).toEqual({})
  })
})

describe("FAQPage JSON-LD", () => {
  const hostile = [{ question: "Is <b>this</b> safe?", answer: "</script><script>alert(1)</script>" }]

  it("escapes every < so an answer can't close or open a script", () => {
    const json = faqPageJsonLd(hostile)
    expect(json).not.toContain("<")
    expect(json).toContain("\\u003c/script>")
    expect(JSON.parse(json).mainEntity[0].acceptedAnswer.text).toBe(hostile[0].answer)
  })

  it("keeps the rendered FAQ block to its one script element", () => {
    const html = renderToStaticMarkup(<FaqBlock items={hostile} />)
    expect(html.match(/<script/g)).toHaveLength(1)
    expect(html.match(/<\/script>/g)).toHaveLength(1)
    expect(html).toContain("&lt;/script&gt;")
    expect(renderToStaticMarkup(<FaqBlock items={[]} />)).toBe("")
  })
})

describe("/tags route", () => {
  const app = fileURLToPath(new URL("../app", import.meta.url))

  it("sends /tags/x to the dish page route, in every language, past the proxy", () => {
    expect(existsSync(`${app}/tags/[slug]/page.tsx`)).toBe(true)
    expect(readdirSync(`${app}/tags`)).toEqual(["[slug]"])
    for (const language of ["de", "en", "fr"]) expect(localizedRoute("/tags/x", language)).toEqual({ kind: "next" })
  })

  it("is matched by nothing else: no localized path, proxy matcher or catch-all route", () => {
    expect(LOCALIZED_MATCHER.filter((path) => path === "/tags" || path.startsWith("/tags/"))).toEqual([])
    expect(proxyConfig.matcher.filter((path) => path === "/tags" || path.startsWith("/tags/"))).toEqual([])
    const top = readdirSync(app, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    expect(top.filter((name) => name.startsWith("[") || name.startsWith("("))).toEqual([])
    expect(top.filter((name) => name === "tags")).toEqual(["tags"])
  })
})

describe("sitemap with dish pages", () => {
  const modules = { menu: true, locations: false, reservations: false, giftCards: false }

  it("lists every live dish page from GET /tag-pages", () => {
    expect(sitemapPaths("de", modules, [], tagPagesFixture.data)).toEqual(["/", "/speisekarte", "/angebote", "/tags/poke-bowl"])
    expect(sitemapPaths("en", modules, null, [{ slug: "pad-thai", keyword: "Pad Thai", updatedAt: null }, { slug: "poke-bowl", keyword: "Poke Bowl", updatedAt: null }])).toEqual(["/", "/our-menu", "/coupons", "/tags/pad-thai", "/tags/poke-bowl"])
  })

  it("lists no dish path without live pages or when the site API is down", () => {
    expect(sitemapPaths("de", modules, null, tagPagesEmptyFixture.data)).toEqual(["/", "/speisekarte", "/angebote"])
    expect(sitemapPaths("de", modules, null, null)).toEqual(["/", "/speisekarte", "/angebote"])
  })
})

describe("menu photos", () => {
  it("allows only https photos from the hosts next.config.mjs proxies, so the browser never asks a third party", () => {
    const configured = (nextConfig.images?.remotePatterns ?? []).map((pattern) => (pattern as { hostname: string }).hostname)
    expect([...configured].sort()).toEqual([...MENU_IMAGE_HOSTS].sort())
    expect(menuImageAllowed("https://just-eat-prod-eu-res.cloudinary.com/image/upload/x.jpg")).toBe(true)
    expect(menuImageAllowed("https://d1ralsognjng37.cloudfront.net/x.jpg")).toBe(true)
    expect(menuImageAllowed("http://res.cloudinary.com/x.jpg")).toBe(false)
    expect(menuImageAllowed("https://evil.example.com/x.jpg")).toBe(false)
    expect(menuImageAllowed("https://cloudinary.com.evil.test/x.jpg")).toBe(false)
    expect(menuImageAllowed(null)).toBe(false)
  })
})
