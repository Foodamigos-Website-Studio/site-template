import { describe, expect, it } from "vitest"

import { formatPrice } from "@/lib/format"
import { GIFT_CARD_MAX, giftCardCheckoutUrl, giftCardProblems, normalizeGiftCardCode, checkGiftCardBalance } from "@/lib/gift-cards"
import { isOpenNow, mapsUrl, weekHours } from "@/lib/hours"
import { localizedRoute } from "@/lib/localized-routes"
import { indexedPaths } from "@/lib/site-pages"

const order = { amount: 50, quantity: 2, email: "gast@example.com", emailRepeat: "Gast@example.com " }

describe("gift cards", () => {
  it("checks the order: amount 10–1000, quantity 1–10, the same valid email twice", () => {
    expect(giftCardProblems(order)).toEqual([])
    expect(giftCardProblems({ ...order, amount: 5 })).toEqual(["amount"])
    expect(giftCardProblems({ ...order, amount: GIFT_CARD_MAX + 1, quantity: 11 })).toEqual(["amount", "quantity"])
    expect(giftCardProblems({ ...order, emailRepeat: "other@example.com" })).toEqual(["email_mismatch"])
    expect(giftCardProblems({ ...order, email: "nope" })).toEqual(["email"])
  })

  it("sends to the embedded checkout with the value in minor units", () => {
    expect(giftCardCheckoutUrl({ amount: 25, quantity: 1, email: "a+b@example.com" })).toBe("/menu/gift-cards/checkout?value=2500&quantity=1&email=a%2Bb%40example.com")
  })

  it("accepts only 16-digit codes and maps the API's answers", async () => {
    expect(normalizeGiftCardCode("1234 5678 9012 3456")).toBe("1234567890123456")
    expect(await checkGiftCardBalance("123")).toEqual({ status: "invalid" })
    const answer = (status: number, body: unknown = {}) => async () => new Response(JSON.stringify(body), { status })
    expect(await checkGiftCardBalance("1234567890123456", answer(404))).toEqual({ status: "not_found" })
    expect(await checkGiftCardBalance("1234567890123456", answer(429))).toEqual({ status: "rate_limited" })
    expect((await checkGiftCardBalance("1234567890123456", answer(200, { balance: 32.5, currency: "EUR" }))).status).toBe("ok")
  })
})

describe("opening hours", () => {
  const periods = [
    { open: { day: 1, hour: 12, minute: 0 }, close: { day: 1, hour: 22, minute: 0 } },
    { open: { day: 5, hour: 18, minute: 0 }, close: { day: 6, hour: 2, minute: 0 } },
  ]

  it("lists the week from Monday in the site's language", () => {
    const week = weekHours(periods, "de")
    expect(week[0]).toEqual({ day: 1, name: "Montag", ranges: ["12:00–22:00"] })
    expect(week[6]).toEqual({ day: 0, name: "Sonntag", ranges: [] })
  })

  it("knows whether a location is open now in its timezone, past midnight too", () => {
    // Monday 2026-10-19 14:00 in Berlin (12:00 UTC), Saturday 01:00 in Berlin (Friday 23:00 UTC).
    expect(isOpenNow(periods, "Europe/Berlin", new Date("2026-10-19T12:00:00Z"))).toBe(true)
    expect(isOpenNow(periods, "Europe/Berlin", new Date("2026-10-23T23:00:00Z"))).toBe(true)
    expect(isOpenNow(periods, "Europe/Berlin", new Date("2026-10-20T12:00:00Z"))).toBe(false)
    expect(mapsUrl("Torstraße 1, 10119 Berlin")).toBe("https://www.google.com/maps/search/?api=1&query=Torstra%C3%9Fe%201%2C%2010119%20Berlin")
  })
})

describe("module pages", () => {
  it("formats prices in the site's language and currency", () => {
    expect(formatPrice(14.5, "EUR", "de").replace(/\s/g, " ")).toBe("14,50 €")
  })

  it("shows the module pages under the site's language's paths and lists only the ones it has", () => {
    expect(localizedRoute("/speisekarte", "de")).toEqual({ kind: "rewrite", path: "/our-menu" })
    expect(localizedRoute("/gutscheine", "de")).toEqual({ kind: "rewrite", path: "/gift-cards" })
    expect(indexedPaths("de", { menu: true, locations: true, reservations: false, giftCards: true })).toEqual([
      "/",
      "/speisekarte",
      "/standort-und-oeffnungszeiten",
      "/gutscheine",
      "/angebote",
    ])
  })
})
