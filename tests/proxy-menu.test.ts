import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FAILED_LOOKUP_SECONDS, resetMenuProjectCache } from "@/lib/menu-project"
import { getProject, type Project } from "@/lib/studio-api"
import { proxy } from "@/proxy"

const site = vi.hoisted(() => ({ modules: ["online_shop"] }))

vi.mock("@/lib/config", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/config")>()),
  ONLINE_SHOP_EMBED_DOMAIN: "trattoria-bella.de",
  ONLINE_SHOP_EMBED_ORIGIN: "https://www.foodamigos-storefront-online-shop.com",
  SITE_LANGUAGE: "de",
  hasModule: (module: string) => site.modules.includes(module),
}))

vi.mock("@/lib/studio-api", () => ({ getProject: vi.fn() }))

const lookup = vi.mocked(getProject)

function project(googleMapsApiKey: string | null): Project {
  return { online_shop_url: "https://shop.example.com/trattoria", google_maps_api_key: googleMapsApiKey } as Project
}

function open(path: string, host = "www.trattoria-bella.de") {
  return proxy(new NextRequest(`https://${host}${path}`, { headers: { host } }))
}

// Lets a background lookup settle (its promise chain), without moving the fake clock.
async function settle() {
  for (let i = 0; i < 10; i += 1) await Promise.resolve()
}

const keyCookie = (key: string) => `storefront_google_maps_api_key_v1=${key}; Path=/; Max-Age=31536000; Secure; SameSite=none`

// Set-Cookie headers without Expires, which follows from Max-Age and the clock.
function cookieHeaders(response: Response) {
  return response.headers.getSetCookie().map((cookie) => cookie.replace(/; Expires=[^;]+/, ""))
}

describe("proxy /menu: the project's Google Maps key", () => {
  beforeEach(() => {
    site.modules = ["online_shop"]
    resetMenuProjectCache()
    lookup.mockReset()
  })

  afterEach(() => vi.useRealTimers())

  it("sets the key cookie next to the other two, with the same options", async () => {
    lookup.mockResolvedValue(project("AIza-project-key"))

    const response = await open("/menu/checkout?x=1")

    expect(response.headers.get("x-middleware-rewrite")).toBe("https://www.foodamigos-storefront-online-shop.com/menu/checkout?x=1")
    const cookies = cookieHeaders(response)
    expect(cookies).toHaveLength(3)
    expect(cookies).toContain("storefront_base_path=%2Fmenu; Path=/; Max-Age=31536000; Secure; SameSite=none")
    expect(cookies).toContain("storefront_locale=de; Path=/; Max-Age=31536000; Secure; SameSite=none")
    expect(cookies).toContain("storefront_google_maps_api_key_v1=AIza-project-key; Path=/; Max-Age=31536000; Secure; SameSite=none")
  })

  it("sets no key cookie when the project has no key", async () => {
    lookup.mockResolvedValue(project(null))

    const cookies = cookieHeaders(await open("/menu"))

    expect(cookies).toHaveLength(2)
    expect(cookies.some((cookie) => cookie.startsWith("storefront_google_maps_api_key_v1="))).toBe(false)
  })

  it("still opens the shop with the two cookies when the site API fails or throws", async () => {
    for (const fail of [() => lookup.mockResolvedValue(null), () => lookup.mockRejectedValue(new Error("timeout"))]) {
      resetMenuProjectCache()
      fail()

      const response = await open("/menu")

      expect(response.headers.get("x-middleware-rewrite")).toBe("https://www.foodamigos-storefront-online-shop.com/menu")
      expect(cookieHeaders(response).map((cookie) => cookie.split("=")[0])).toEqual(["storefront_base_path", "storefront_locale"])
    }
  })

  it("asks the site API at most once per REVALIDATE_SECONDS, and again after it, in the background", async () => {
    vi.useFakeTimers()
    lookup.mockResolvedValue(project("AIza-old-key"))

    await open("/menu")
    await Promise.all([open("/menu"), open("/menu/checkout")])
    vi.advanceTimersByTime(299_000)
    await open("/menu")
    expect(lookup).toHaveBeenCalledTimes(1)

    // Expired: this request still gets the cached key (MK.QF0.2) while one new lookup runs; the next gets its answer.
    lookup.mockResolvedValue(project("AIza-rotated-key"))
    vi.advanceTimersByTime(1_000)
    expect(cookieHeaders(await open("/menu"))).toContain(keyCookie("AIza-old-key"))
    expect(lookup).toHaveBeenCalledTimes(2)
    await settle()
    expect(cookieHeaders(await open("/menu"))).toContain(keyCookie("AIza-rotated-key"))
    expect(lookup).toHaveBeenCalledTimes(2)
  })

  it("keeps a failed lookup only briefly, so the next requests don't wait for the site API again (MK.QF0.1)", async () => {
    vi.useFakeTimers()
    lookup.mockResolvedValue(null)

    await open("/menu")
    await Promise.all([open("/menu"), open("/menu/checkout")])
    vi.advanceTimersByTime((FAILED_LOOKUP_SECONDS - 1) * 1000)
    await open("/menu")
    expect(lookup).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1_000)
    await open("/menu")
    expect(lookup).toHaveBeenCalledTimes(2)
  })

  it("gets the key and the preview redirect back once the site API answers again, not five minutes later (MK.QF0.1)", async () => {
    vi.useFakeTimers()
    lookup.mockRejectedValue(new Error("500"))

    expect(cookieHeaders(await open("/menu")).map((cookie) => cookie.split("=")[0])).toEqual([
      "storefront_base_path",
      "storefront_locale",
    ])
    expect((await open("/menu", "site.vercel.app")).headers.get("x-middleware-next")).toBe("1")

    lookup.mockResolvedValue(project("AIza-project-key"))
    vi.advanceTimersByTime(FAILED_LOOKUP_SECONDS * 1000)
    await open("/menu")
    await settle()

    expect(cookieHeaders(await open("/menu"))).toContain(keyCookie("AIza-project-key"))
    expect((await open("/menu", "site.vercel.app")).status).toBe(307)
    expect(lookup).toHaveBeenCalledTimes(2)

    // A success is then kept the whole REVALIDATE_SECONDS again.
    vi.advanceTimersByTime(299_000)
    await open("/menu")
    expect(lookup).toHaveBeenCalledTimes(2)
  })

  it("never makes a /menu request wait for the site API once a project was read (MK.QF0.2)", async () => {
    vi.useFakeTimers()
    lookup.mockResolvedValue(project("AIza-project-key"))
    await open("/menu")

    // The site API hangs after expiry: every request still answers at once with the cached key, and only one lookup runs.
    lookup.mockReturnValue(new Promise(() => {}))
    vi.advanceTimersByTime(300_000)
    const responses = await Promise.all([open("/menu"), open("/menu/checkout"), open("/menu")])
    for (const response of responses) expect(cookieHeaders(response)).toContain(keyCookie("AIza-project-key"))
    expect(lookup).toHaveBeenCalledTimes(2)
  })

  it("keeps the last key when a refresh fails, and tries again after FAILED_LOOKUP_SECONDS (MK.QF0.2)", async () => {
    vi.useFakeTimers()
    lookup.mockResolvedValue(project("AIza-project-key"))
    await open("/menu")

    lookup.mockRejectedValue(new Error("500"))
    vi.advanceTimersByTime(300_000)
    await open("/menu")
    await settle()
    expect(cookieHeaders(await open("/menu"))).toContain(keyCookie("AIza-project-key"))
    expect(lookup).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime((FAILED_LOOKUP_SECONDS - 1) * 1000)
    await open("/menu")
    expect(lookup).toHaveBeenCalledTimes(2)

    lookup.mockResolvedValue(project(null))
    vi.advanceTimersByTime(1_000)
    await open("/menu")
    await settle()
    expect(lookup).toHaveBeenCalledTimes(3)
    // A project that answers without a key is no failure: the key cookie goes.
    expect(cookieHeaders(await open("/menu")).some((cookie) => cookie.startsWith("storefront_google_maps_api_key_v1="))).toBe(false)
  })

  it("still redirects previews to the standalone shop with no cookies", async () => {
    lookup.mockResolvedValue(project("AIza-project-key"))

    const response = await open("/menu/checkout", "site.vercel.app")

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe("https://shop.example.com/trattoria/checkout")
    expect(cookieHeaders(response)).toEqual([])
  })

  it("leaves /menu to the site, without asking the site API, when the online shop is off", async () => {
    site.modules = []

    const response = await open("/menu")

    expect(response.headers.get("x-middleware-next")).toBe("1")
    expect(cookieHeaders(response)).toEqual([])
    expect(lookup).not.toHaveBeenCalled()
  })
})
