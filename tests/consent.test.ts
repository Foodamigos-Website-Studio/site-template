import { describe, expect, it } from "vitest"

import { consentCookie, consentFromCookie, consentInBrowser, isGranted } from "@/lib/consent"

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

  it("finds a choice the server missed in the browser: the cookie first, else the copy in local storage", () => {
    expect(consentInBrowser("CookieConsent=true", null)).toBe("accepted")
    expect(consentInBrowser("CookieConsent=false", "true")).toBe("declined")
    // A preview proxy dropped the cookie, or an iframe blocked it: local storage still has the choice.
    expect(consentInBrowser("", "true")).toBe("accepted")
    expect(consentInBrowser(null, "false")).toBe("declined")
    expect(consentInBrowser(null, null)).toBe("pending")
    expect(consentInBrowser("", "maybe")).toBe("pending")
  })
})
