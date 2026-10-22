import { describe, expect, it } from "vitest"

import { mergePageMeta, siteMetadata } from "@/lib/seo"
import { sitemapPaths } from "@/lib/site-pages"
import type { PageMetaEntry, Project, SiteMeta } from "@/lib/studio-api"

const site: SiteMeta = {
  title_template: "%s · Trattoria Bella",
  google_site_verification: "abc123",
  bing_site_verification: "BING42",
  twitter_card: "summary",
  category: "restaurant",
  max_image_preview: "large",
}
const own = { title: "Trattoria Bella", description: "Pasta in Berlin", url: "https://trattoria.de/speisekarte", image: "https://x.test/og.jpg", siteName: "Trattoria Bella", site }

function entry(overrides: Partial<PageMetaEntry> = {}): PageMetaEntry {
  return { path: "/speisekarte", title: "Speisekarte", description: "Die Speisekarte", keywords: [], og_title: null, og_description: null, noindex: false, ...overrides }
}

describe("page meta", () => {
  it("uses Website Studio's tags for the page over the page's own, with the site's share image and X card", () => {
    const meta = mergePageMeta(own, entry({ title: "Speisekarte – Pasta in Berlin", keywords: ["speisekarte", "pasta berlin"] }))
    expect(meta.title).toBe("Speisekarte – Pasta in Berlin")
    expect(meta.keywords).toEqual(["speisekarte", "pasta berlin"])
    expect(meta.openGraph).toMatchObject({ type: "website", siteName: "Trattoria Bella", title: "Speisekarte – Pasta in Berlin", images: ["https://x.test/og.jpg"] })
    expect(meta.twitter).toMatchObject({ card: "summary", images: ["https://x.test/og.jpg"] })
    expect(meta.alternates).toEqual({ canonical: "https://trattoria.de/speisekarte" })
    expect(meta.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } })
  })

  it("keeps the page's own tags without an entry, and noindex and nofollow from one", () => {
    expect(mergePageMeta(own, undefined)).toMatchObject({ title: "Trattoria Bella", description: "Pasta in Berlin" })
    const legal = mergePageMeta(own, entry({ path: "/impressum", noindex: true, nofollow: true }))
    expect(legal.robots).toMatchObject({ index: false, follow: false })
  })
})

describe("site metadata", () => {
  const project = { name: "Trattoria Bella", favicon_url: "https://cdn.test/favicon.png", meta: site, mobile_app: { name: "Bella", asc_app_id: 6470000000, released: true } } as Project

  it("gives every page the title template, verification codes, category, favicon and the iOS app banner", () => {
    const meta = siteMetadata(project, "https://trattoria.de")
    expect(meta.title).toEqual({ default: "Trattoria Bella", template: "%s · Trattoria Bella" })
    expect(meta.verification).toEqual({ google: "abc123", other: { "msvalidate.01": "BING42" } })
    expect(meta.category).toBe("restaurant")
    expect(meta.icons).toEqual({ icon: "https://cdn.test/favicon.png", apple: "https://cdn.test/favicon.png" })
    expect(meta.itunes).toEqual({ appId: "6470000000" })
  })

  it("leaves out what is not set", () => {
    const meta = siteMetadata({ ...project, favicon_url: null, meta: { ...site, title_template: null, google_site_verification: null, bing_site_verification: null, category: null }, mobile_app: null }, "https://trattoria.de")
    expect(meta.title).toBe("Trattoria Bella")
    expect(meta.verification).toBeUndefined()
    expect(meta.icons).toBeUndefined()
    expect(meta.itunes).toBeUndefined()
  })
})

describe("sitemap", () => {
  const modules = { menu: true, locations: false, reservations: false, giftCards: false }

  it("adds the pages registered in Website Studio, without noindex ones or pages of modules that are off", () => {
    const paths = sitemapPaths("de", modules, [entry({ path: "/" }), entry({ path: "/kontakt" }), entry({ path: "/impressum", noindex: true }), entry({ path: "/reservierungen" })])
    expect(paths).toEqual(["/", "/speisekarte", "/angebote", "/kontakt"])
  })

  it("lists the template's pages when the site API is down", () => {
    expect(sitemapPaths("de", modules, null)).toEqual(["/", "/speisekarte", "/angebote"])
  })
})
