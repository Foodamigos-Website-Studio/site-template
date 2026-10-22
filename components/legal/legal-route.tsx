// One legal page as a route: app/impressum, app/privacy-policy and app/cookie-policy re-export it; proxy.ts serves them
// under the site's language's paths (/datenschutzerklaerung, /cookie-richtlinie on a German site).
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SITE_LANGUAGE } from "@/lib/config"
import { legalSlug } from "@/lib/legal"
import { pageMetadata } from "@/lib/seo"
import { plainText } from "@/lib/inline"
import { getLegal, getLegalPage, getProject, type LegalPage, type LegalPageKey } from "@/lib/studio-api"

import { LegalBlocks } from "./legal-blocks"

/** The page's first paragraph as plain text, at most 155 characters: the meta description. */
function legalDescription(legal: LegalPage | null): string {
  const first = legal?.sections.flatMap((section) => section.blocks).find((block) => block.type === "paragraph")
  const text = first?.type === "paragraph" ? plainText(first.text) : ""
  return text.length > 155 ? `${text.slice(0, 154).trimEnd()}…` : text
}

export function legalRoute(page: LegalPageKey) {
  async function generateMetadata(): Promise<Metadata> {
    const [legal, index, project] = await Promise.all([getLegalPage(page), getLegal(), getProject()])
    const label = index?.pages.find((entry) => entry.page === page)?.label ?? legal?.title ?? ""
    const title = [label, project?.name].filter(Boolean).join(" – ")
    return {
      ...(await pageMetadata({ title, description: legalDescription(legal) || title, path: legalSlug(page, SITE_LANGUAGE) })),
      // Legal pages are not for search engines: noindex, and never in the sitemap (lib/site-pages.ts).
      robots: { index: false, follow: true },
    }
  }

  async function LegalPageRoute() {
    const legal = await getLegalPage(page)
    if (!legal) notFound()
    return <LegalBlocks page={legal} />
  }

  return { generateMetadata, LegalPageRoute }
}
