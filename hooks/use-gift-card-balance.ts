"use client"

// The gift card balance check's state, without markup: a <form action={action}> with one field, code (16 digits).
import { useActionState } from "react"

import { giftCardBalance } from "@/app/gift-cards/actions"
import type { BalanceResult } from "@/lib/gift-cards"

export function useGiftCardBalance() {
  const [result, action, pending] = useActionState<BalanceResult | null, FormData>(giftCardBalance, null)
  return { result, action, pending }
}
