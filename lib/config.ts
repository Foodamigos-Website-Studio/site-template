// The website's settings: the env vars Studio sets on the Vercel project (site_env_set), else the values Studio wrote
// into lib/site-defaults.ts for the v0 preview. Keep this file: the legal pages, the banner and /menu use it.
import { SITE_DEFAULTS } from "./site-defaults"

/** The Website Studio site API, e.g. https://studio-api-dev-v2.foodamigos.io. */
export const STUDIO_API_URL = process.env.NEXT_PUBLIC_STUDIO_API_URL ?? SITE_DEFAULTS.studioApiUrl

/** The restaurant (project) the site belongs to. */
export const PROJECT_UUID = process.env.NEXT_PUBLIC_PROJECT_UUID ?? SITE_DEFAULTS.projectUuid

/** The modules the manager switched on in the brief, comma-separated: online_shop, reservations, gift_cards, mobile_app. */
export const SITE_MODULES = (process.env.NEXT_PUBLIC_SITE_MODULES ?? SITE_DEFAULTS.modules)
  .split(",")
  .map((module) => module.trim())
  .filter(Boolean)

/** The storefront build that runs the online shop under /menu on the custom domain. */
export const ONLINE_SHOP_EMBED_ORIGIN = process.env.ONLINE_SHOP_EMBED_ORIGIN ?? SITE_DEFAULTS.onlineShopEmbedOrigin

/** The custom domain the shop is embedded on (no "www."); set by the deploy, empty on previews. */
export const ONLINE_SHOP_EMBED_DOMAIN = process.env.ONLINE_SHOP_EMBED_DOMAIN ?? ""

/** Umami analytics (loaded only after the visitor accepts cookies). */
export const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js"

/** The site's language (ISO 639-1): texts, <html lang>, the legal pages' language and slugs. */
export const SITE_LANGUAGE = process.env.NEXT_PUBLIC_SITE_LANGUAGE ?? SITE_DEFAULTS.language

export const REVALIDATE_SECONDS = 300

export function hasModule(module: string): boolean {
  return SITE_MODULES.includes(module)
}
