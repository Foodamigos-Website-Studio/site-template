// The project as /menu needs it (online_shop_url, google_maps_api_key), kept in memory for REVALIDATE_SECONDS.
// The proxy runs on every /menu request and fetch's next.revalidate doesn't cache there, so without this each request
// would ask the site API. A failed lookup (null) is kept only FAILED_LOOKUP_SECONDS (MK.QF0.1): long enough that an
// unreachable site API doesn't make every /menu request wait for its 8 s timeout, short enough that one blip doesn't
// leave the shop without the project's Maps key, and previews without their redirect, for five minutes.
import { REVALIDATE_SECONDS } from "./config"
import { getProject, type Project } from "./studio-api"

/** How long a failed lookup is kept before /menu asks the site API again. */
export const FAILED_LOOKUP_SECONDS = 30

type Entry = { project: Promise<Project | null>; expiresAt: number }

let cached: Entry | null = null

export function getMenuProject(): Promise<Project | null> {
  const now = Date.now()
  if (!cached || now >= cached.expiresAt) {
    // Stored before it settles, so requests arriving together share one lookup.
    const entry: Entry = { project: Promise.resolve(null), expiresAt: now + REVALIDATE_SECONDS * 1000 }
    entry.project = getProject()
      .catch(() => null)
      .then((project) => {
        if (!project) entry.expiresAt = Math.min(entry.expiresAt, Date.now() + FAILED_LOOKUP_SECONDS * 1000)
        return project
      })
    cached = entry
  }
  return cached.project
}

/** Tests only: forget the cached project. */
export function resetMenuProjectCache() {
  cached = null
}
