// The one client for the Website Studio site API: every page reads restaurant data through it, never hard-coded.
// Responses are {data: ...}; a failed request returns null, so the page leaves that part out instead of guessing.
import { PROJECT_UUID, REVALIDATE_SECONDS, SITE_LANGUAGE, STUDIO_API_URL } from "./config"

const BASE_URL = `${STUDIO_API_URL}/api/projects/${PROJECT_UUID}`

export type Project = {
  uuid: string
  name: string
  slug: string
  default_language: string
  dietary_attributes: string[]
  tagline: string | null
  about: string | null
  socials: Record<string, string>
  delivery_links: Record<string, string>
  has_reservations: boolean
  reservation_url: string | null
  has_online_shop: boolean
  online_shop_url: string | null
  has_gift_cards: boolean
  logo_url: string | null
  favicon_url: string | null
  og_image_url: string | null
  google_maps_api_key: string | null
  umami_website_id?: string | null
}

export type OpeningPoint = { day: number; hour: number; minute: number }
export type OpeningPeriod = { open: OpeningPoint; close: OpeningPoint }

export type GoogleReview = {
  author_name: string
  rating: number
  text: string
  language: string | null
  published_at: string
  profile_photo_url: string | null
}

export type Company = {
  uuid: string
  slug: string
  name: string
  phone_number: string | null
  email: string | null
  address: string | null
  zip_code: string | null
  city: string | null
  country: string | null
  lat: number | null
  lon: number | null
  timezone: string
  currency: string
  opening_hours: OpeningPeriod[]
  is_live: boolean
  business_profile: BusinessProfile | null
  google_place: {
    place_id: string
    rating: number | null
    rates_count: number | null
    reviews: GoogleReview[]
  } | null
}

export type BusinessProfile = {
  legal_name: string | null
  owner: string | null
  business_type: string | null
  address: string | null
  zip_code: string | null
  city: string | null
  country: string | null
  phone_number: string | null
  email: string | null
  website_url: string | null
  vat_id: string | null
  tax_id: string | null
  commercial_register: string | null
  commercial_register_number: string | null
  supervisory_authority: string | null
  grantor: string | null
  legal_disclosure: string | null
}

export type MenuProduct = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  price: number | null
}

export type MenuCategory = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  products: MenuProduct[]
}

export type MenuGroup = {
  id: number
  name: string
  schedule: unknown
  categories: MenuCategory[]
}

export type MenuCompany = {
  company_uuid: string
  name: string
  currency: string
  menus: MenuGroup[]
}

export type Menu = {
  currency: string | null
  companies: MenuCompany[]
}

async function request<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return null
    const json = (await response.json()) as { data?: T }
    return json.data ?? null
  } catch {
    return null
  }
}

export function getProject() {
  return request<Project>("")
}

export function getCompanies() {
  return request<Company[]>("/companies")
}

export function getMenu() {
  return request<Menu>("/menu")
}

export type LegalPageKey = "impressum" | "privacy-policy" | "cookie-policy"

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "definition_list"; heading?: string | null; items: { term: string; value: string }[] }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "link"; label: string; url: string }

export type LegalPage = {
  page: LegalPageKey
  language: string
  fallback: boolean
  slug: string
  title: string
  sections: { heading: string | null; blocks: LegalBlock[] }[]
}

export type ConsentBannerTexts = { text: string; accept: string; decline: string; settings: string }

export type LegalIndex = {
  language: string
  fallback: boolean
  pages: { page: LegalPageKey; slug: string; label: string; title: string }[]
  consent_banner: ConsentBannerTexts
}

export function getLegal(language = SITE_LANGUAGE) {
  return request<LegalIndex>(`/legal?lang=${encodeURIComponent(language)}`)
}

export function getLegalPage(page: LegalPageKey, language = SITE_LANGUAGE) {
  return request<LegalPage>(`/legal/${page}?lang=${encodeURIComponent(language)}`)
}

export type SeoPage = {
  page: "coupons"
  language: string
  fallback: boolean
  slug: string
  overridden: boolean
  meta_title: string
  meta_description: string
  keywords: string[]
  title: string
  faq: { question: string; answer: string }[]
}

export function getSeoPage(page: SeoPage["page"], language = SITE_LANGUAGE) {
  return request<SeoPage>(`/seo-pages/${page}?lang=${encodeURIComponent(language)}`)
}

/** One page's meta tags, managed in Website Studio (Max or the manager in the SEO tab). */
export type PageMetaEntry = {
  path: string
  title: string
  description: string
  keywords: string[]
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  noindex: boolean
}

export function getPageMeta(language = SITE_LANGUAGE) {
  return request<PageMetaEntry[]>(`/page-meta?lang=${encodeURIComponent(language)}`)
}
