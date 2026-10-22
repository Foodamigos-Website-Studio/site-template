// The site's origin and the metadata every page needs (title, description, canonical, Open Graph).
import type { Metadata } from "next"
import { headers } from "next/headers"

import { getProject } from "./studio-api"

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

/** A page's metadata: a unique title (10–60 characters) and description (50–160), canonical URL and Open Graph. */
export async function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Promise<Metadata> {
  const [origin, project] = await Promise.all([getSiteUrl(), getProject()])
  const url = `${origin}${path}`
  const image = project?.og_image_url ?? undefined
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, ...(image ? { images: [image] } : {}) },
  }
}
