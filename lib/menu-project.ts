// The project as /menu needs it (online_shop_url, google_maps_api_key), kept in memory. The proxy runs on every /menu
// request and fetch's next.revalidate doesn't cache there, so without this each request would ask the site API.
// - A project is fresh for REVALIDATE_SECONDS, a failed lookup (null) for FAILED_LOOKUP_SECONDS (MK.QF0.1).
// - Once one has been read, no /menu request waits for the site API again (MK.QF0.2): after it expires the last one
//   is served while a single new lookup runs in the background, and that lookup's answer serves the requests after it.
// - A failed refresh keeps the last project (a site API blip is not a removed key) and is tried again after
//   FAILED_LOOKUP_SECONDS. Only the very first lookup is waited for, sharing one request among those arriving together.
import { REVALIDATE_SECONDS } from "./config"
import { getProject, type Project } from "./studio-api"

/** How long a failed lookup is kept before /menu asks the site API again. */
export const FAILED_LOOKUP_SECONDS = 30

type Entry = { project: Promise<Project | null>; expiresAt: number }

let cached: Entry | null = null
let refreshing = false

const failedUntil = () => Date.now() + FAILED_LOOKUP_SECONDS * 1000

/** One lookup that never rejects: the project, or null when the site API failed. */
function lookup(): Promise<Project | null> {
  return getProject().catch(() => null)
}

/** The first lookup, waited for: kept REVALIDATE_SECONDS, or FAILED_LOOKUP_SECONDS once it turns out to have failed. */
function first(now: number): Entry {
  const entry: Entry = { project: Promise.resolve(null), expiresAt: now + REVALIDATE_SECONDS * 1000 }
  entry.project = lookup().then((project) => {
    if (!project) entry.expiresAt = Math.min(entry.expiresAt, failedUntil())
    return project
  })
  return entry
}

/** A new lookup in the background: its project replaces the cached one, a failure keeps it for another try soon. */
function refresh(stale: Entry) {
  refreshing = true
  void lookup().then((project) => {
    refreshing = false
    if (cached !== stale) return
    cached = project
      ? { project: Promise.resolve(project), expiresAt: Date.now() + REVALIDATE_SECONDS * 1000 }
      : { project: stale.project, expiresAt: failedUntil() }
  })
}

export function getMenuProject(): Promise<Project | null> {
  const now = Date.now()
  if (!cached) {
    // Stored before it settles, so requests arriving together share one lookup.
    cached = first(now)
  } else if (now >= cached.expiresAt && !refreshing) {
    refresh(cached)
  }
  return cached.project
}

/** Tests only: forget the cached project. */
export function resetMenuProjectCache() {
  cached = null
  refreshing = false
}
