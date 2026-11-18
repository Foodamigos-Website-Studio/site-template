// The project as /menu needs it (online_shop_url, google_maps_api_key), kept in memory. The proxy runs on every /menu
// request and fetch's next.revalidate doesn't cache there, so without this each request would ask the site API.
// - A project is fresh for REVALIDATE_SECONDS, a failed lookup (null) for FAILED_LOOKUP_SECONDS (MK.QF0.1).
// - After it expires, the last project is served while a single new lookup runs in the background, and that lookup's
//   answer serves the requests after it (MK.QF0.2), so a site with steady traffic never waits for the site API.
// - Staleness is bounded (MK.QF0.6): once the project was read more than MAX_STALE_SECONDS ago (a site that was idle),
//   the requests wait for the new lookup, all sharing one deadline STALE_WAIT_MS after it started, and get the last
//   project only when it hasn't answered by then. A rotated key thus reaches the first /menu after an idle spell.
// - A failed refresh keeps the last project (a site API blip is not a removed key) and is tried again after
//   FAILED_LOOKUP_SECONDS in the background, without waiting, until a lookup succeeds (MK.QF0.4). Only the very first
//   lookup is waited for in full, sharing one request among those arriving together.
import { REVALIDATE_SECONDS } from "./config"
import { getProject, type Project } from "./studio-api"

/** How long a failed lookup is kept before /menu asks the site API again. */
export const FAILED_LOOKUP_SECONDS = 30

/** How old a read project may get before a request waits (briefly) for the new lookup instead of being served it. */
export const MAX_STALE_SECONDS = 2 * REVALIDATE_SECONDS

/** How long the requests past MAX_STALE_SECONDS wait for the new lookup, counted from its start. */
export const STALE_WAIT_MS = 1_000

type Entry = {
  project: Promise<Project | null>
  expiresAt: number
  /** When requests start waiting for the refresh; null after a failed lookup (the site API is down: never wait). */
  waitFrom: number | null
}

let cached: Entry | null = null
/** The running refresh, settled with its project or with the last one at its deadline; null when none runs. */
let refreshing: Promise<Project | null> | null = null

const failedUntil = () => Date.now() + FAILED_LOOKUP_SECONDS * 1000

/** One lookup that never rejects: the project, or null when the site API failed. */
function lookup(): Promise<Project | null> {
  return getProject().catch(() => null)
}

/** A project just read: fresh for REVALIDATE_SECONDS, waited for once it is MAX_STALE_SECONDS old. */
function read(project: Project, now: number): Entry {
  return {
    project: Promise.resolve(project),
    expiresAt: now + REVALIDATE_SECONDS * 1000,
    waitFrom: now + MAX_STALE_SECONDS * 1000,
  }
}

/** The first lookup, waited for: kept REVALIDATE_SECONDS, or FAILED_LOOKUP_SECONDS once it turns out to have failed. */
function first(now: number): Entry {
  const entry: Entry = { project: Promise.resolve(null), expiresAt: now + REVALIDATE_SECONDS * 1000, waitFrom: null }
  entry.project = lookup().then((project) => {
    if (project) entry.waitFrom = now + MAX_STALE_SECONDS * 1000
    else entry.expiresAt = Math.min(entry.expiresAt, failedUntil())
    return project
  })
  return entry
}

/**
 * A new lookup: its project replaces the cached one, a failure keeps it for another try soon. Returns what a request
 * that waits for it gets: the new project, or the last one when the lookup fails or STALE_WAIT_MS runs out first.
 */
function refresh(stale: Entry): Promise<Project | null> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<Project | null>((resolve) => {
    timer = setTimeout(() => resolve(stale.project), STALE_WAIT_MS)
  })
  const done = lookup().then((project) => {
    clearTimeout(timer)
    if (refreshing === bounded) refreshing = null
    if (cached !== stale) return stale.project
    cached = project ? read(project, Date.now()) : { project: stale.project, expiresAt: failedUntil(), waitFrom: null }
    return cached.project
  })
  const bounded = Promise.race([done, deadline])
  return bounded
}

export function getMenuProject(): Promise<Project | null> {
  const now = Date.now()
  if (!cached) {
    // Stored before it settles, so requests arriving together share one lookup.
    cached = first(now)
    return cached.project
  }
  if (now >= cached.expiresAt && !refreshing) refreshing = refresh(cached)
  if (refreshing && cached.waitFrom !== null && now >= cached.waitFrom) return refreshing
  return cached.project
}

/** Tests only: forget the cached project. */
export function resetMenuProjectCache() {
  cached = null
  refreshing = null
}
