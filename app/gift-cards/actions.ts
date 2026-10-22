"use server"

// The gift card forms as Server Actions: validated on the server, the balance checked from the server (no API call
// from the browser), the purchase redirected to the embedded checkout. Work without JavaScript, too.
import { redirect } from "next/navigation"

import { checkGiftCardBalance, giftCardCheckoutUrl, giftCardProblems, type BalanceResult, type GiftCardOrder, type GiftCardProblem } from "@/lib/gift-cards"

export type PurchaseState = { step: "form" | "confirm"; order: GiftCardOrder; problems: GiftCardProblem[] }

function orderFrom(formData: FormData): GiftCardOrder {
  const custom = Number(formData.get("custom_amount"))
  const preset = Number(formData.get("amount"))
  return {
    amount: Number.isFinite(custom) && custom > 0 ? custom : preset,
    quantity: Number(formData.get("quantity") ?? 1),
    email: String(formData.get("email") ?? ""),
    emailRepeat: String(formData.get("email_repeat") ?? ""),
  }
}

/** intent=review shows the confirmation step, edit goes back to the form, checkout leaves for the shop's checkout. */
export async function giftCardPurchase(_previous: PurchaseState, formData: FormData): Promise<PurchaseState> {
  const order = orderFrom(formData)
  if (formData.get("intent") === "edit") return { step: "form", order, problems: [] }
  const problems = giftCardProblems(order)
  if (problems.length > 0) return { step: "form", order, problems }
  if (formData.get("intent") === "checkout") redirect(giftCardCheckoutUrl(order))
  return { step: "confirm", order, problems: [] }
}

export async function giftCardBalance(_previous: BalanceResult | null, formData: FormData): Promise<BalanceResult> {
  return checkGiftCardBalance(String(formData.get("code") ?? ""))
}
