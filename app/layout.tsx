import type { Metadata, Viewport } from "next"
import { Bebas_Neue, Montserrat } from "next/font/google"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { Analytics } from "@/components/consent/analytics"
import { ConsentBanner } from "@/components/consent/consent-banner"
import { MotionGuard } from "@/components/motion-guard"
import { ConsentProvider } from "@/components/consent/consent-provider"
import { RestaurantJsonLd } from "@/components/site/restaurant-json-ld"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SITE_LANGUAGE } from "@/lib/config"
import { CONSENT_COOKIE, consentFromCookie } from "@/lib/consent"
import { getSiteUrl, siteMetadata } from "@/lib/seo"
import { getLegal, getProject } from "@/lib/studio-api"

import "./globals.css"

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" })

export const viewport: Viewport = {
  themeColor: "#73C0D3",
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
    <html lang={SITE_LANGUAGE} className={`${bebas.variable} ${montserrat.variable} bg-background`}>
      <body className="flex min-h-svh flex-col overflow-x-hidden font-sans">
        <ConsentProvider initial={consent}>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-secondary"
          >
            Zum Inhalt springen
          </a>
          <SiteHeader />
          <main id="content" className="flex-1">
            <MotionGuard />
            {children}
          </main>
          <SiteFooter />
          <ConsentBanner texts={legal?.consent_banner ?? null} />
          <Analytics umamiWebsiteId={project?.umami_website_id} />
        </ConsentProvider>
        <RestaurantJsonLd cuisine="Burger, American Fast Food" />
      </body>
    </html>
  )
}
