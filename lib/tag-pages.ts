// Dish pages (F-TP): one page per dish keyword at /tags/{slug}, written by Max and served by the site API
// (GET /tag-pages, /tag-pages/{slug}). /tags is the same on every site, in every language: it is not a localized route
// (lib/localized-routes.ts) and the proxy leaves it alone.
import { localizedPath } from "./localized-routes"
import { onlineShopOn, reservationsOn } from "./modules"
import type { Menu, MenuProduct, Project, TagPageSummary } from "./studio-api"

export const TAG_PAGES_PREFIX = "/tags"

/** A dish page's path, e.g. /tags/poke-bowl. */
export function tagPath(slug: string): string {
  return `${TAG_PAGES_PREFIX}/${encodeURIComponent(slug)}`
}

/** The sitemap's dish paths: every live page the site API lists (it never lists drafts); none when it failed. */
export function tagPaths(pages: readonly TagPageSummary[] | null): string[] {
  return (pages ?? []).map((page) => tagPath(page.slug))
}

/**
 * Whether the site still shows this dish page: listed in GET /tag-pages (live pages only), or the list failed (site
 * API down: keep the cached page). Needed because Next keeps a cached 200 of /tag-pages/{slug} when the refetch answers
 * 404, so a page that became a draft or lost its keyword would otherwise stay up; the list's own 200 does refresh.
 */
export function tagPageListed(pages: readonly TagPageSummary[] | null, slug: string): boolean {
  return pages === null || pages.some((page) => page.slug === slug)
}

export type TagProduct = MenuProduct & { currency: string }

/** The dish page's menu products, in the page's order (productIds), each once, from every location's menus. */
export function tagProducts(menu: Menu | null, productIds: readonly number[]): TagProduct[] {
  const byId = new Map<number, TagProduct>()
  for (const company of menu?.companies ?? []) {
    for (const group of company.menus) {
      for (const category of group.categories) {
        for (const product of category.products) {
          if (!byId.has(product.id)) byId.set(product.id, { ...product, currency: company.currency })
        }
      }
    }
  }
  return [...new Set(productIds)].flatMap((id) => byId.get(id) ?? [])
}

/** Whether the site shows its own menu page (/our-menu, /speisekarte): app/our-menu answers 404 without categories. */
export function hasMenuPage(menu: Menu | null): boolean {
  return Boolean(menu?.companies.some((company) => company.menus.some((group) => group.categories.length > 0)))
}

/** The site's menu link: its own menu page in the site's language, or none when the site has no menu page. */
export function siteMenuHref(menu: Menu | null, language: string): string | null {
  return hasMenuPage(menu) ? localizedPath("our-menu", language) : null
}

export type TagCtaKey = "order_online" | "full_menu" | "book_table"
export type TagCta = { key: TagCtaKey; label: string; href: string }

export type TagPageLabels = { menuItems: string; faq: string } & Record<TagCtaKey, string>

/** The dish page's texts in every language the template ships; written by hand for de and en. Unknown languages get en. */
export const TAG_PAGE_LABELS: Record<string, TagPageLabels> = {
  de: { menuItems: "Auf unserer Karte", faq: "Häufige Fragen", order_online: "Online bestellen", full_menu: "Ganze Speisekarte ansehen", book_table: "Tisch reservieren" },
  en: { menuItems: "On our menu", faq: "Frequently asked questions", order_online: "Order online", full_menu: "View full menu", book_table: "Book a table" },
  fr: { menuItems: "À notre carte", faq: "Questions fréquentes", order_online: "Commander en ligne", full_menu: "Voir toute la carte", book_table: "Réserver une table" },
  es: { menuItems: "En nuestra carta", faq: "Preguntas frecuentes", order_online: "Pedir en línea", full_menu: "Ver la carta completa", book_table: "Reservar una mesa" },
  it: { menuItems: "Nel nostro menù", faq: "Domande frequenti", order_online: "Ordina online", full_menu: "Vedi il menù completo", book_table: "Prenota un tavolo" },
}

export function tagPageLabels(language: string): TagPageLabels {
  return TAG_PAGE_LABELS[language] ?? TAG_PAGE_LABELS.en
}

/**
 * The dish page's calls to action, only for what the site has: Order online (the shop under /menu) with the online shop
 * on, View full menu through the site's menu link, Book a table with reservations on. No link to a page that 404s.
 */
export function tagPageCtas(project: Project | null, menu: Menu | null, language: string): TagCta[] {
  const labels = tagPageLabels(language)
  const menuHref = siteMenuHref(menu, language)
  const ctas: TagCta[] = []
  if (onlineShopOn(project)) ctas.push({ key: "order_online", label: labels.order_online, href: "/menu" })
  if (menuHref) ctas.push({ key: "full_menu", label: labels.full_menu, href: menuHref })
  if (reservationsOn(project)) ctas.push({ key: "book_table", label: labels.book_table, href: localizedPath("reservations", language) })
  return ctas
}

/**
 * The hosts menu photos may come from. The site shows them through its own image optimizer (/_next/image), so a guest's
 * browser never asks a third party for them (consent: no new third-party request). Keep in step with next.config.mjs's
 * images.remotePatterns (tests/tag-pages.test.tsx checks it); a photo from any other host is left out.
 */
export const MENU_IMAGE_HOSTS: readonly string[] = ["**.cloudinary.com", "**.cloudfront.net", "**.amazonaws.com", "*.public.blob.vercel-storage.com"]

function hostMatches(host: string, pattern: string): boolean {
  if (pattern.startsWith("**.")) return host.endsWith(pattern.slice(2))
  if (pattern.startsWith("*.")) {
    const rest = pattern.slice(1)
    return host.endsWith(rest) && !host.slice(0, -rest.length).includes(".")
  }
  return host === pattern
}

/** Whether a menu photo can be shown through the site's image optimizer: https and an allowed host. */
export function menuImageAllowed(url: string | null): url is string {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" && MENU_IMAGE_HOSTS.some((pattern) => hostMatches(parsed.hostname, pattern))
  } catch {
    return false
  }
}
