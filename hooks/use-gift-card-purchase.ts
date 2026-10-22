"use client"

// The gift card purchase form's state, without markup: a <form action={action}> with the fields amount (a preset) or
// custom_amount, quantity, email, email_repeat, and a submit button named intent (review, then checkout). Build any
// UI on top of it; the rules and the redirect run in the Server Action.
import { useActionState } from "react"

import { giftCardPurchase, type PurchaseState } from "@/app/gift-cards/actions"
import { GIFT_CARD_MAX, GIFT_CARD_MAX_QUANTITY, GIFT_CARD_MIN, GIFT_CARD_PRESETS } from "@/lib/gift-cards"

const INITIAL: PurchaseState = { step: "form", order: { amount: GIFT_CARD_PRESETS[1], quantity: 1, email: "", emailRepeat: "" }, problems: [] }

export function useGiftCardPurchase() {
  const [state, action, pending] = useActionState(giftCardPurchase, INITIAL)
  return {
    state,
    action,
    pending,
    total: state.order.amount * state.order.quantity,
    limits: { presets: GIFT_CARD_PRESETS, min: GIFT_CARD_MIN, max: GIFT_CARD_MAX, maxQuantity: GIFT_CARD_MAX_QUANTITY },
  }
}
