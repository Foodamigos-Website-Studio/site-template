// The site's origin and its metadata: what every page needs (title, description, canonical, robots, Open Graph, X)
// and what the root layout gives them all (title template, verification, icons).
import type { Metadata } from "next"
import { headers } from "next/headers"

import { getPageMeta, getProject, type PageMetaEntry, type Project, type SiteMeta } from "./studio-api"

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

/** The page's own tags, and what every page shares: the site's share image, name and meta settings. */
export type OwnMeta = { title: string; description: string; url: string; image?: string; siteName?: string; site?: SiteMeta }

/**
 * Website Studio's tags for the page win over the page's own; Open Graph and X fall back to the title and
 * description. The share image is the site's one (the project's og_image) on every page.
 */
export function mergePageMeta(own: OwnMeta, entry: PageMetaEntry | undefined): Metadata {
  const title = entry?.title || own.title
  const description = entry?.description || own.description
  const shareTitle = entry?.og_title || title
  const shareDescription = entry?.og_description || description
  const index = !entry?.noindex
  const follow = !entry?.nofollow
  return {
    title,
    description,
    ...(entry?.keywords?.length ? { keywords: entry.keywords } : {}),
    robots: { index, follow, googleBot: { index, follow, "max-image-preview": own.site?.max_image_preview ?? "large" } },
    alternates: { canonical: own.url },
    openGraph: {
      type: "website",
      title: shareTitle,
      description: shareDescription,
      url: own.url,
      ...(own.siteName ? { siteName: own.siteName } : {}),
      ...(own.image ? { images: [own.image] } : {}),
    },
    twitter: {
      card: own.site?.twitter_card ?? "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      ...(own.image ? { images: [own.image] } : {}),
    },
  }
}

/**
 * A page's metadata: the tags Website Studio keeps for its path (GET /page-meta, set by Max or the manager in the SEO
 * tab), else the page's own title and description; canonical URL, robots, Open Graph and X either way.
 */
export async function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Promise<Metadata> {
  const [origin, project, entries] = await Promise.all([getSiteUrl(), getProject(), getPageMeta()])
  return mergePageMeta(
    { title, description, url: `${origin}${path}`, image: project?.og_image_url ?? undefined, siteName: project?.name, site: project?.meta },
    entries?.find((entry) => entry.path === path),
  )
}

/**
 * What every page inherits from the root layout: the title template, search engine verification, category, the
 * favicon (also as the Apple touch icon) and the iOS app banner when the restaurant's app is released.
 */
export function siteMetadata(project: Project | null, origin: string): Metadata {
  const meta = project?.meta
  const app = project?.mobile_app
  return {
    metadataBase: new URL(origin),
    ...(project ? { title: meta?.title_template ? { default: project.name, template: meta.title_template } : project.name } : {}),
    ...(project ? { applicationName: project.name, appleWebApp: { title: project.name } } : {}),
    ...(meta?.google_site_verification || meta?.bing_site_verification
      ? {
          verification: {
            ...(meta.google_site_verification ? { google: meta.google_site_verification } : {}),
            ...(meta.bing_site_verification ? { other: { "msvalidate.01": meta.bing_site_verification } } : {}),
          },
        }
      : {}),
    ...(meta?.category ? { category: meta.category } : {}),
    ...(project?.favicon_url ? { icons: { icon: project.favicon_url, apple: project.favicon_url } } : {}),
    ...(app?.released && app.asc_app_id ? { itunes: { appId: String(app.asc_app_id) } } : {}),
  }
}
