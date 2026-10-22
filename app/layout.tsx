import type { Metadata, Viewport } from "next"
import { Bowlby_One, Space_Grotesk } from "next/font/google"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { Analytics } from "@/components/consent/analytics"
import { ConsentBanner } from "@/components/consent/consent-banner"
import { ConsentProvider } from "@/components/consent/consent-provider"
import { MobileOrderBar } from "@/components/site/mobile-order-bar"
import { RestaurantJsonLd } from "@/components/site/restaurant-json-ld"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SITE_LANGUAGE } from "@/lib/config"
import { CONSENT_COOKIE, consentFromCookie } from "@/lib/consent"
import { onlineShopOn } from "@/lib/modules"
import { ORDER_PATH } from "@/lib/restaurant"
import { getSiteUrl, siteMetadata } from "@/lib/seo"
import { getLegal, getProject } from "@/lib/studio-api"

import "./globals.css"

const bowlby = Bowlby_One({ subsets: ["latin"], weight: "400", variable: "--font-bowlby", display: "swap" })
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" })

export const viewport: Viewport = {
  themeColor: "#ED2023",
  width: "device-width",
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const [project, origin] = await Promise.all([getProject(), getSiteUrl()])
  return siteMetadata(project, origin)
}

// Keep the ConsentProvider, ConsentBanner, Analytics and RestaurantJsonLd: they are the site's legal and SEO base.
export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [cookieStore, legal, project] = await Promise.all([cookies(), getLegal(), getProject()])
  const consent = consentFromCookie(`${CONSENT_COOKIE}=${cookieStore.get(CONSENT_COOKIE)?.value ?? ""}`)
  return (
    <html lang={SITE_LANGUAGE} className={`${bowlby.variable} ${space.variable} bg-background`}>
      <body className="bg-background font-sans text-foreground">
        <ConsentProvider initial={consent}>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[7px] focus:bg-background focus:px-4 focus:py-2 focus:font-bold focus:text-charcoal"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="content">{children}</main>
          <SiteFooter />
          {onlineShopOn(project) ? <MobileOrderBar href={ORDER_PATH} /> : null}
          <ConsentBanner texts={legal?.consent_banner ?? null} />
          <Analytics umamiWebsiteId={project?.umami_website_id} />
        </ConsentProvider>
        <RestaurantJsonLd />
      </body>
    </html>
  )
}
