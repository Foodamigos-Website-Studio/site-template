import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { SocialLinks } from "@/components/site/social-links"
import { restaurantJsonLd } from "@/lib/restaurant-json-ld"
import { sameAs, socialLinks } from "@/lib/socials"
import type { Company, Project } from "@/lib/studio-api"

const full = {
  facebook: "https://www.facebook.com/trattoriabella",
  instagram: "https://www.instagram.com/trattoriabella",
  tiktok: "https://www.tiktok.com/@trattoriabella",
}
const render = (socials: Record<string, string> | null | undefined, slot?: string) =>
  renderToStaticMarkup(createElement(SocialLinks, { socials, ...(slot ? { slot } : {}) }))

describe("social links (SO.4)", () => {
  it("lists every set network in a fixed order, only https links", () => {
    expect(socialLinks(full).map((link) => link.network)).toEqual(["instagram", "facebook", "tiktok"])
    expect(socialLinks({ tiktok: full.tiktok, facebook: "http://facebook.com/x", myspace: "https://myspace.com/x" })).toEqual([
      { network: "tiktok", label: "TikTok", href: full.tiktok },
    ])
    expect(socialLinks({})).toEqual([])
    expect(socialLinks(null)).toEqual([])
  })

  it("renders an icon link per set network for the footer and the menu, opening in a new tab", () => {
    const html = render(full, "footer-social-links")
    expect(html).toContain('data-slot="footer-social-links"')
    for (const [network, href] of Object.entries(full)) {
      expect(html).toContain(`href="${href}"`)
      expect(html).toContain(`data-network="${network}"`)
    }
    expect(html.match(/<a /g)).toHaveLength(3)
    expect(html).toContain('aria-label="Instagram"')
    expect(html).toContain('target="_blank" rel="noopener noreferrer"')
  })

  it("renders only the set networks, and nothing at all when none is set", () => {
    const partial = render({ instagram: full.instagram })
    expect(partial.match(/<a /g)).toHaveLength(1)
    expect(partial).not.toContain("facebook")
    expect(render({})).toBe("")
    expect(render(undefined)).toBe("")
  })
})

describe("restaurant JSON-LD sameAs (SO.4)", () => {
  const project = { name: "Trattoria Bella", og_image_url: null, socials: full } as unknown as Project
  const company = { phone_number: null, email: null, address: null, zip_code: null, city: "Berlin", country: "DE", opening_hours: [] } as unknown as Company

  it("lists the set profiles as sameAs", () => {
    expect(restaurantJsonLd({ project, company, origin: "https://trattoria.de" }).sameAs).toEqual([full.instagram, full.facebook, full.tiktok])
    expect(restaurantJsonLd({ project: { ...project, socials: { tiktok: full.tiktok } }, company, origin: "https://trattoria.de" }).sameAs).toEqual([full.tiktok])
  })

  it("leaves sameAs out when no profile is set", () => {
    const data = restaurantJsonLd({ project: { ...project, socials: {} }, company, origin: "https://trattoria.de" })
    expect(data.sameAs).toBeUndefined()
    expect(JSON.stringify(data)).not.toContain("sameAs")
    expect(sameAs(undefined)).toBeUndefined()
  })
})
