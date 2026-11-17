// The project as /menu needs it (online_shop_url, google_maps_api_key), kept in memory for REVALIDATE_SECONDS.
// The proxy runs on every /menu request and fetch's next.revalidate doesn't cache there, so without this each request
// would ask the site API. A failed lookup (null) is kept just as long, so an unreachable site API doesn't make every
// /menu request wait for its 8 s timeout; /menu then still opens the shop, only without the project's Maps key.
import { REVALIDATE_SECONDS } from "./config"
import { getProject, type Project } from "./studio-api"

let cached: { project: Promise<Project | null>; expiresAt: number } | null = null

export function getMenuProject(): Promise<Project | null> {
  const now = Date.now()
  if (!cached || now >= cached.expiresAt) {
    // Stored before it settles, so requests arriving together share one lookup.
    cached = { project: getProject().catch(() => null), expiresAt: now + REVALIDATE_SECONDS * 1000 }
  }
  return cached.project
}

/** Tests only: forget the cached project. */
export function resetMenuProjectCache() {
  cached = null
}
