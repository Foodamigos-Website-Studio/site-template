"use client"

// The default balance check (unstyled) on useGiftCardBalance. v0 may replace the markup; keep the field name code.
import { useGiftCardBalance } from "@/hooks/use-gift-card-balance"
import { formatPrice } from "@/lib/format"

export type BalanceLabels = { code: string; check: string; balance: string; expires: string; results: Record<"invalid" | "not_found" | "rate_limited" | "failed", string> }

export function GiftCardBalanceForm({ language, labels }: { language: string; labels: BalanceLabels }) {
  const { result, action, pending } = useGiftCardBalance()
  return (
    <form action={action} data-slot="gift-card-balance">
      <label>
        {labels.code}
        <input name="code" inputMode="numeric" autoComplete="off" required pattern="[0-9 ]{16,19}" />
      </label>
      <button type="submit" disabled={pending}>
        {labels.check}
      </button>
      {result?.status === "ok" ? (
        <dl role="status">
          <dt>{labels.balance}</dt>
          <dd>{formatPrice(result.balance.balance, result.balance.currency, language)}</dd>
          {result.balance.expires_at ? (
            <>
              <dt>{labels.expires}</dt>
              <dd>{new Date(result.balance.expires_at).toLocaleDateString(language)}</dd>
            </>
          ) : null}
        </dl>
      ) : result ? (
        <p role="alert">{labels.results[result.status]}</p>
      ) : null}
    </form>
  )
}
