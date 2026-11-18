import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FAILED_REQUEST_SECONDS, getLegal, getProject, resetFailedRequests } from "@/lib/studio-api"

const fetchMock = vi.fn<typeof fetch>()

function ok(data: unknown) {
  return new Response(JSON.stringify({ data }), { status: 200, headers: { "Content-Type": "application/json" } })
}

describe("studio-api: a failed request is remembered briefly (MK.QF0.3)", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal("fetch", fetchMock)
    fetchMock.mockReset()
    resetFailedRequests()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("doesn't ask the site API again within FAILED_REQUEST_SECONDS after a timeout", async () => {
    fetchMock.mockRejectedValue(new DOMException("The operation was aborted due to timeout", "TimeoutError"))

    expect(await getProject()).toBeNull()
    vi.advanceTimersByTime((FAILED_REQUEST_SECONDS - 1) * 1000)
    expect(await getProject()).toBeNull()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("remembers a non-2xx answer the same way", async () => {
    fetchMock.mockResolvedValue(new Response("down", { status: 503 }))

    expect(await getProject()).toBeNull()
    expect(await getProject()).toBeNull()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("asks again once FAILED_REQUEST_SECONDS have passed, and serves the answer", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"))
    expect(await getProject()).toBeNull()

    vi.advanceTimersByTime(FAILED_REQUEST_SECONDS * 1000)
    fetchMock.mockResolvedValueOnce(ok({ uuid: "p-1" }))

    expect(await getProject()).toEqual({ uuid: "p-1" })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("keeps each path apart: a failed project lookup doesn't skip the legal texts", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"))
    expect(await getProject()).toBeNull()

    fetchMock.mockResolvedValueOnce(ok({ language: "de", pages: [] }))
    expect(await getLegal("de")).toEqual({ language: "de", pages: [] })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("leaves successful requests to fetch's own cache (each call still goes through fetch)", async () => {
    fetchMock.mockImplementation(async () => ok({ uuid: "p-1" }))

    await getProject()
    await getProject()

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
