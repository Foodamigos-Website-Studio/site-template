// The site's origin and the metadata every page needs (title, description, canonical, Open Graph).
import type { Metadata } from "next"
import { headers } from "next/headers"

import { getPageMeta, getProject, type PageMetaEntry } from "./studio-api"

const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/

/** The origin serving this request: NEXT_PUBLIC_SITE_URL, else the request's host, else the Vercel URL. */
export async function getSiteUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return (/^https?:\/\//.test(explicit) ? explicit : `https://${explicit}`).replace(/\/+$/, "")
  try {
    const requestHeaders = await headers()
    const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"))?.split(",")[0]?.trim()
    if (host) {
      const forwarded = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim()
      return `${forwarded || (LOCAL_HOST.test(host) ? "http" : "https")}://${host}`
    }
  } catch {
    // No request (build time): fall through to the deployment's URL.
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

/** Website Studio's tags for the page win over the page's own; Open Graph falls back to the title and description. */
export function mergePageMeta(
  own: { title: string; description: string; url: string; image?: string },
  entry: PageMetaEntry | undefined,
): Metadata {
  const title = entry?.title || own.title
  const description = entry?.description || own.description
  const image = entry?.og_image_url || own.image
  return {
    title,
    description,
    ...(entry?.keywords?.length ? { keywords: entry.keywords } : {}),
    ...(entry?.noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical: own.url },
    openGraph: {
      title: entry?.og_title || title,
      description: entry?.og_description || description,
      url: own.url,
      ...(image ? { images: [image] } : {}),
    },
  }
}

/**
 * A page's metadata: the tags Website Studio keeps for its path (GET /page-meta, set by Max or the manager in the SEO
 * tab), else the page's own title and description; canonical URL and Open Graph either way.
 */
export async function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Promise<Metadata> {
  const [origin, project, entries] = await Promise.all([getSiteUrl(), getProject(), getPageMeta()])
  return mergePageMeta(
    { title, description, url: `${origin}${path}`, image: project?.og_image_url ?? undefined },
    entries?.find((entry) => entry.path === path),
  )
}
