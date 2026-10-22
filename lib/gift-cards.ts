// Gift cards: sold by the online shop embedded under /menu, the balance checked through the site API. The rules live
// with the module (Max's module-gift-cards skill); this is their current implementation.
import { PROJECT_UUID, STUDIO_API_URL } from "./config"

export const GIFT_CARD_PRESETS = [25, 50, 100, 200] as const
export const GIFT_CARD_MIN = 10
export const GIFT_CARD_MAX = 1000
export const GIFT_CARD_MAX_QUANTITY = 10

export type GiftCardOrder = { amount: number; quantity: number; email: string; emailRepeat: string }
export type GiftCardProblem = "amount" | "quantity" | "email" | "email_mismatch"

export function giftCardProblems(order: GiftCardOrder): GiftCardProblem[] {
  const problems: GiftCardProblem[] = []
  if (!Number.isFinite(order.amount) || order.amount < GIFT_CARD_MIN || order.amount > GIFT_CARD_MAX) problems.push("amount")
  if (!Number.isInteger(order.quantity) || order.quantity < 1 || order.quantity > GIFT_CARD_MAX_QUANTITY) problems.push("quantity")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email.trim())) problems.push("email")
  else if (order.email.trim().toLowerCase() !== order.emailRepeat.trim().toLowerCase()) problems.push("email_mismatch")
  return problems
}

/** The site's own embedded checkout: value in minor units (25 € → 2500), relative, /menu kept. */
export function giftCardCheckoutUrl(order: Pick<GiftCardOrder, "amount" | "quantity" | "email">): string {
  const params = new URLSearchParams({
    value: String(Math.round(order.amount * 100)),
    quantity: String(order.quantity),
    email: order.email.trim(),
  })
  return `/menu/gift-cards/checkout?${params.toString()}`
}

export type GiftCardBalance = { code: string; value: number; balance: number; currency: string; expires_at: string | null; redemption_mode: string | null }
export type BalanceResult =
  | { status: "ok"; balance: GiftCardBalance }
  | { status: "invalid" | "not_found" | "rate_limited" | "failed" }

/** The 16-digit code without spaces, or null. */
export function normalizeGiftCardCode(code: string): string | null {
  const digits = code.replace(/\s+/g, "")
  return /^\d{16}$/.test(digits) ? digits : null
}

export async function checkGiftCardBalance(code: string, fetcher: typeof fetch = fetch): Promise<BalanceResult> {
  const normalized = normalizeGiftCardCode(code)
  if (!normalized) return { status: "invalid" }
  try {
    const response = await fetcher(`${STUDIO_API_URL}/api/projects/${PROJECT_UUID}/shop/gift-cards/check-balance`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ code: normalized }),
    })
    if (response.ok) return { status: "ok", balance: (await response.json()) as GiftCardBalance }
    if (response.status === 404) return { status: "not_found" }
    if (response.status === 422) return { status: "invalid" }
    if (response.status === 429) return { status: "rate_limited" }
    return { status: "failed" }
  } catch {
    return { status: "failed" }
  }
}
