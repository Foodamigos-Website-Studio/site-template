import type { Metadata } from "next"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { Analytics } from "@/components/consent/analytics"
import { ConsentBanner } from "@/components/consent/consent-banner"
import { ConsentProvider } from "@/components/consent/consent-provider"
import { RestaurantJsonLd } from "@/components/site/restaurant-json-ld"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SITE_LANGUAGE } from "@/lib/config"
import { CONSENT_COOKIE, consentFromCookie } from "@/lib/consent"
import { getSiteUrl } from "@/lib/seo"
import { getLegal, getProject } from "@/lib/studio-api"

import "./globals.css"

export async function generateMetadata(): Promise<Metadata> {
  const [project, origin] = await Promise.all([getProject(), getSiteUrl()])
  return {
    metadataBase: new URL(origin),
    icons: project?.favicon_url ? { icon: project.favicon_url } : undefined,
  }
}

// Keep the ConsentProvider, ConsentBanner, Analytics and RestaurantJsonLd: they are the site's legal and SEO base.
export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [cookieStore, legal, project] = await Promise.all([cookies(), getLegal(), getProject()])
  const consent = consentFromCookie(`${CONSENT_COOKIE}=${cookieStore.get(CONSENT_COOKIE)?.value ?? ""}`)
  return (
    <html lang={SITE_LANGUAGE}>
      <body className="bg-background text-foreground antialiased">
        <ConsentProvider initial={consent}>
          <SiteHeader />
          <main id="content">{children}</main>
          <SiteFooter />
          <ConsentBanner texts={legal?.consent_banner ?? null} />
          <Analytics umamiWebsiteId={project?.umami_website_id} />
        </ConsentProvider>
        <RestaurantJsonLd />
      </body>
    </html>
  )
}
