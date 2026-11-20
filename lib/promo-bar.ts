// The promo bar (F-PB): the restaurant's active promo codes at the top of every page, linking to the online shop under
// /menu. Shown only while the online shop is on and there is a code; a visitor who closes it doesn't see it again
// during that visit (sessionStorage).
import { onlineShopOn } from "./modules"
import type { Project, PromoCode } from "./studio-api"

export const PROMO_BAR_DISMISSED_KEY = "promo-bar-dismissed"

export type PromoBarTexts = { label: string; close: string }

const TEXTS: Record<string, PromoBarTexts> = {
  en: { label: "Promo code", close: "Close" },
  de: { label: "Aktionscode", close: "Schließen" },
}

/** The bar's own texts in the site's language; English for any other language. */
export function promoBarTexts(language: string): PromoBarTexts {
  return TEXTS[language] ?? TEXTS.en
}

/** The codes the bar shows: none while the online shop is off (the bar links to it), and never a blank one. */
export function promoBarCodes(codes: PromoCode[] | null, project: Project | null): PromoCode[] {
  if (!onlineShopOn(project) || !Array.isArray(codes)) return []
  return codes.filter((promo) => typeof promo?.code === "string" && promo.code.trim() !== "")
}

type SessionStore = Pick<Storage, "getItem" | "setItem">

/** Whether the visitor closed the bar during this visit. A store that throws (private mode, blocked storage) counts as not. */
export function promoBarDismissed(store: SessionStore | null | undefined): boolean {
  try {
    return store?.getItem(PROMO_BAR_DISMISSED_KEY) === "1"
  } catch {
    return false
  }
}

/** Remembers for this visit that the visitor closed the bar; the bar closes either way. */
export function dismissPromoBar(store: SessionStore | null | undefined): void {
  try {
    store?.setItem(PROMO_BAR_DISMISSED_KEY, "1")
  } catch {
    // Storage blocked: the bar still closes, it just comes back on the next page.
  }
}
