import { describe, expect, it } from "vitest"

import { mergePageMeta } from "@/lib/seo"

const own = { title: "Trattoria Bella", description: "Pasta in Berlin", url: "https://trattoria.de/speisekarte", image: "https://x.test/og.jpg" }

describe("page meta", () => {
  it("uses Website Studio's tags for the page over the page's own", () => {
    const meta = mergePageMeta(own, {
      path: "/speisekarte",
      title: "Speisekarte – Trattoria Bella in Berlin",
      description: "Hausgemachte Pasta und Pizza aus dem Steinofen: die Speisekarte der Trattoria Bella in Berlin Mitte.",
      keywords: ["speisekarte", "pasta berlin"],
      og_title: null,
      og_description: null,
      og_image_url: null,
      noindex: false,
    })
    expect(meta.title).toBe("Speisekarte – Trattoria Bella in Berlin")
    expect(meta.keywords).toEqual(["speisekarte", "pasta berlin"])
    expect(meta.openGraph).toMatchObject({ title: "Speisekarte – Trattoria Bella in Berlin", images: ["https://x.test/og.jpg"] })
    expect(meta.alternates).toEqual({ canonical: "https://trattoria.de/speisekarte" })
    expect(meta.robots).toBeUndefined()
  })

  it("keeps the page's own tags without an entry, and noindex from one", () => {
    expect(mergePageMeta(own, undefined)).toMatchObject({ title: "Trattoria Bella", description: "Pasta in Berlin" })
    const legal = mergePageMeta(own, { path: "/impressum", title: "Impressum", description: "Impressum", keywords: [], og_title: null, og_description: null, og_image_url: null, noindex: true })
    expect(legal.robots).toEqual({ index: false, follow: true })
  })
})
