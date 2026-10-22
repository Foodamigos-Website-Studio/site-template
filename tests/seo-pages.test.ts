import { describe, expect, it } from "vitest"

import { seoPageContent, seoPaths } from "@/lib/seo-pages"

const restaurant = { name: "Trattoria Bella", city: "Berlin", email: "ciao@trattoria-bella.de" }

describe("SEO pages", () => {
  it("names the coupons page in the site's language", () => {
    expect(seoPaths("de")).toEqual(["/angebote"])
    expect(seoPaths("en")).toEqual(["/coupons"])
    expect(seoPaths("fr")).toEqual(["/coupons"])
  })

  it("fills the restaurant's name, city and email into the texts", () => {
    const page = seoPageContent("coupons", "de", restaurant)
    expect(page.title).toBe("Beste Angebote & Rabatte bei Trattoria Bella in Berlin")
    expect(page.metaTitle).toBe("Coupons | Trattoria Bella Berlin")
    expect(page.faq).toHaveLength(5)
    expect(page.faq[4]?.answer).toContain("Kontaktieren Sie uns unter ciao@trattoria-bella.de")
    expect(JSON.stringify(page)).not.toMatch(/:name|:city|:contact|:email|cowboys/)
  })

  it("leaves the email out when the restaurant has none, and uses English for other languages", () => {
    const page = seoPageContent("coupons", "fr", { ...restaurant, email: "" })
    expect(page.title).toBe("Best Offers & Discounts at Trattoria Bella in Berlin")
    expect(page.faq[4]?.answer.endsWith("Visit us in the restaurant for assistance.")).toBe(true)
  })
})
