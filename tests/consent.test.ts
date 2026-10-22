import { describe, expect, it } from "vitest"

import { consentCookie, consentFromCookie, isGranted } from "@/lib/consent"

describe("consent", () => {
  it("reads the visitor's choice from the CookieConsent cookie, pending without it", () => {
    expect(consentFromCookie("a=1; CookieConsent=true")).toBe("accepted")
    expect(consentFromCookie("CookieConsent=false")).toBe("declined")
    expect(consentFromCookie("CookieConsent=")).toBe("pending")
    expect(consentFromCookie(null)).toBe("pending")
  })

  it("grants analytics, embeds and restaurant scripts only after accept", () => {
    expect(isGranted("accepted", "analytics")).toBe(true)
    expect(isGranted("declined", "embedded_media")).toBe(false)
    expect(isGranted("pending", "restaurant_scripts")).toBe(false)
  })

  it("stores the choice for a year, Secure on https", () => {
    expect(consentCookie(true, true)).toBe("CookieConsent=true; Path=/; Max-Age=31536000; SameSite=Lax; Secure")
    expect(consentCookie(false, false)).toBe("CookieConsent=false; Path=/; Max-Age=31536000; SameSite=Lax")
  })
})
