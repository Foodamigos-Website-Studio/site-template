import type { Metadata, Viewport } from "next"
import { Libre_Bodoni, Roboto } from "next/font/google"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { Analytics } from "@/components/consent/analytics"
import { ConsentBanner } from "@/components/consent/consent-banner"
import { ConsentProvider } from "@/components/consent/consent-provider"
import { EmailSignup } from "@/components/site/email-signup"
import { PageLoader } from "@/components/site/page-loader"
import { RestaurantJsonLd } from "@/components/site/restaurant-json-ld"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { PROJECT_UUID, SITE_LANGUAGE, STUDIO_API_URL } from "@/lib/config"
import { CONSENT_COOKIE, consentFromCookie } from "@/lib/consent"
import { getSiteUrl, siteMetadata } from "@/lib/seo"
import { getCompanies, getLegal, getProject } from "@/lib/studio-api"

import "./globals.css"

const libreBodoni = Libre_Bodoni({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-libre-bodoni", display: "swap" })
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-roboto", display: "swap" })

export const viewport: Viewport = { themeColor: "#212225", width: "device-width", initialScale: 1 }

export async function generateMetadata(): Promise<Metadata> {
  const [project, origin] = await Promise.all([getProject(), getSiteUrl()])
  return siteMetadata(project, origin)
}

// Keep the ConsentProvider, ConsentBanner, Analytics and RestaurantJsonLd: they are the site's legal and SEO base, and
// the PageLoader, which shows that the next page is loading.
export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [cookieStore, legal, project, companies] = await Promise.all([cookies(), getLegal(), getProject(), getCompanies()])
  const consent = consentFromCookie(`${CONSENT_COOKIE}=${cookieStore.get(CONSENT_COOKIE)?.value ?? ""}`)
  return (
    <html lang={SITE_LANGUAGE} className={`${libreBodoni.variable} ${roboto.variable} bg-background`}>
      <body>
        <PageLoader />
        <ConsentProvider initial={consent}>
          <SiteHeader />
          <div id="content">{children}</div>
          <SiteFooter />
          <EmailSignup
            apiBase={`${STUDIO_API_URL}/api/projects/${PROJECT_UUID}`}
            currency={companies?.[0]?.currency ?? "EUR"}
            language={SITE_LANGUAGE}
            name={project?.name ?? ""}
          />
          <ConsentBanner texts={legal?.consent_banner ?? null} />
          <Analytics umamiWebsiteId={project?.umami_website_id} />
        </ConsentProvider>
        <RestaurantJsonLd />
      </body>
    </html>
  )
}
