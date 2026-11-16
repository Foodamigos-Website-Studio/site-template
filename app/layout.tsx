import type { Metadata, Viewport } from "next"
import { Cabin, Old_Standard_TT } from "next/font/google"
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

const oldStandard = Old_Standard_TT({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-old-standard", display: "swap" })
const cabin = Cabin({ subsets: ["latin"], variable: "--font-cabin", display: "swap" })

export const viewport: Viewport = { themeColor: "#F0ECE0", width: "device-width", initialScale: 1 }

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
    <html lang={SITE_LANGUAGE} className={`${oldStandard.variable} ${cabin.variable} bg-background`}>
      <body>
        <PageLoader />
        <ConsentProvider initial={consent}>
          <SiteHeader />
          <main id="content">{children}</main>
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
