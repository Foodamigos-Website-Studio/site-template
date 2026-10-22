// Cookie consent, as on the storefront: one choice (accept or decline) stored in the CookieConsent cookie for a year.
// Accept grants every category; until then analytics, embedded media and the restaurant's own scripts stay off.

export const CONSENT_COOKIE = "CookieConsent"
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

export type ConsentStatus = "pending" | "accepted" | "declined"
export type ConsentCategory = "analytics" | "embedded_media" | "restaurant_scripts"

export function consentFromCookie(cookieHeader: string | null | undefined): ConsentStatus {
  const value = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1)
  if (value === "true") return "accepted"
  if (value === "false") return "declined"
  return "pending"
}

/**
 * The choice as the browser has it, when the server saw none: the cookie, else the copy in local storage. The server
 * can miss it where a proxy drops cookies (Website Studio's draft preview) or an iframe blocks them, and local storage
 * still works in an iframe.
 */
export function consentInBrowser(cookieHeader: string | null | undefined, stored: string | null | undefined): ConsentStatus {
  const fromCookie = consentFromCookie(cookieHeader)
  if (fromCookie !== "pending") return fromCookie
  if (stored === "true") return "accepted"
  if (stored === "false") return "declined"
  return "pending"
}

export function consentCookie(accepted: boolean, secure: boolean): string {
  return `${CONSENT_COOKIE}=${accepted}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure ? "; Secure" : ""}`
}

export function isGranted(status: ConsentStatus, _category: ConsentCategory): boolean {
  return status === "accepted"
}
