import type { Metadata, Viewport } from "next"
import { Libre_Bodoni, Roboto } from "next/font/google"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { Analytics } from "@/components/consent/analytics"
import { ConsentBanner } from "@/components/consent/consent-banner"
import { ConsentProvider } from "@/components/consent/consent-provider"
import { EmailSignup } from "@/components/site/email-signup"
import { MobileOrderBar } from "@/components/site/mobile-order-bar"
import { PageLoader } from "@/components/site/page-loader"
import { RestaurantJsonLd } from "@/components/site/restaurant-json-ld"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SITE_LANGUAGE } from "@/lib/config"
import { CONSENT_COOKIE, consentFromCookie } from "@/lib/consent"
import { getSiteUrl, siteMetadata } from "@/lib/seo"
import { getLegal, getProject } from "@/lib/studio-api"

import "./globals.css"

const bodoni = Libre_Bodoni({ subsets: ["latin"], variable: "--font-bodoni", display: "swap" })
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-roboto", display: "swap" })

export const viewport: Viewport = {
  themeColor: "#212225",
  width: "device-width",
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const [project, origin] = await Promise.all([getProject(), getSiteUrl()])
  return siteMetadata(project, origin)
}

// Keep the ConsentProvider, ConsentBanner, Analytics and RestaurantJsonLd: they are the site's legal and SEO base, and
// the PageLoader, which shows that the next page is loading.
export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [cookieStore, legal, project] = await Promise.all([cookies(), getLegal(), getProject()])
  const consent = consentFromCookie(`${CONSENT_COOKIE}=${cookieStore.get(CONSENT_COOKIE)?.value ?? ""}`)
  return (
    <html lang={SITE_LANGUAGE} className={`${bodoni.variable} ${roboto.variable} bg-background`}>
      <body className="font-sans antialiased">
        <PageLoader />
        <ConsentProvider initial={consent}>
          <SiteHeader />
          <main id="content" className="pt-[var(--header-height)]">
            {children}
          </main>
          <SiteFooter />
          <MobileOrderBar />
          <EmailSignup />
          <ConsentBanner texts={legal?.consent_banner ?? null} />
          <Analytics umamiWebsiteId={project?.umami_website_id} />
        </ConsentProvider>
        <RestaurantJsonLd />
      </body>
    </html>
  )
}
