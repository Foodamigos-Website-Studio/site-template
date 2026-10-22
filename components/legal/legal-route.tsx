// One legal page as a route: app/impressum, app/datenschutzerklaerung, app/privacy-policy, app/cookie-richtlinie and
// app/cookie-policy each re-export it. A path of the other language redirects to the site's own.
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

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

export function legalRoute(page: LegalPageKey, path: string) {
  async function generateMetadata(): Promise<Metadata> {
    const [legal, index, project] = await Promise.all([getLegalPage(page), getLegal(), getProject()])
    const label = index?.pages.find((entry) => entry.page === page)?.label ?? legal?.title ?? ""
    const title = [label, project?.name].filter(Boolean).join(" – ")
    return {
      ...(await pageMetadata({ title, description: legalDescription(legal) || title, path: legalSlug(page, SITE_LANGUAGE) })),
      robots: { index: false, follow: true },
    }
  }

  async function LegalPageRoute() {
    if (legalSlug(page, SITE_LANGUAGE) !== path) permanentRedirect(legalSlug(page, SITE_LANGUAGE))
    const legal = await getLegalPage(page)
    if (!legal) notFound()
    return <LegalBlocks page={legal} />
  }

  return { generateMetadata, LegalPageRoute }
}
