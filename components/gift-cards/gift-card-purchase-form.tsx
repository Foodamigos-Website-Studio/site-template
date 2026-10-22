"use client"

// The default gift card purchase form (unstyled) on useGiftCardPurchase: amount, quantity, email twice, review, then
// checkout. v0 may replace the markup; keep the field names and the two intents.
import { useGiftCardPurchase } from "@/hooks/use-gift-card-purchase"
import { formatPrice } from "@/lib/format"

export type PurchaseLabels = { amount: string; custom: string; quantity: string; email: string; emailRepeat: string; review: string; total: string; back: string; checkout: string; problems: Record<string, string> }

export function GiftCardPurchaseForm({ currency, language, labels }: { currency: string; language: string; labels: PurchaseLabels }) {
  const { state, action, pending, total, limits } = useGiftCardPurchase()
  const { order } = state
  const price = (amount: number) => formatPrice(amount, currency, language)

  if (state.step === "confirm") {
    return (
      <form action={action} data-slot="gift-card-confirm">
        {Object.entries({ amount: order.amount, quantity: order.quantity, email: order.email, email_repeat: order.emailRepeat }).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={String(value)} />
        ))}
        <dl>
          <dt>{labels.amount}</dt>
          <dd>{price(order.amount)}</dd>
          <dt>{labels.quantity}</dt>
          <dd>{order.quantity}</dd>
          <dt>{labels.total}</dt>
          <dd>{price(total)}</dd>
          <dt>{labels.email}</dt>
          <dd>{order.email}</dd>
        </dl>
        <button type="submit" name="intent" value="edit" disabled={pending}>
          {labels.back}
        </button>
        <button type="submit" name="intent" value="checkout" disabled={pending}>
          {labels.checkout}
        </button>
      </form>
    )
  }

  return (
    <form action={action} data-slot="gift-card-purchase">
      <fieldset>
        <legend>{labels.amount}</legend>
        {limits.presets.map((preset) => (
          <label key={preset}>
            <input type="radio" name="amount" value={preset} defaultChecked={preset === order.amount} />
            {price(preset)}
          </label>
        ))}
        <label>
          {labels.custom}
          <input type="number" name="custom_amount" min={limits.min} max={limits.max} step="1" />
        </label>
      </fieldset>
      <label>
        {labels.quantity}
        <input type="number" name="quantity" min={1} max={limits.maxQuantity} defaultValue={order.quantity} required />
      </label>
      <label>
        {labels.email}
        <input type="email" name="email" defaultValue={order.email} required autoComplete="email" />
      </label>
      <label>
        {labels.emailRepeat}
        <input type="email" name="email_repeat" defaultValue={order.emailRepeat} required autoComplete="email" />
      </label>
      {state.problems.length ? (
        <ul role="alert">
          {state.problems.map((problem) => (
            <li key={problem}>{labels.problems[problem] ?? problem}</li>
          ))}
        </ul>
      ) : null}
      <button type="submit" name="intent" value="review" disabled={pending}>
        {labels.review}
      </button>
    </form>
  )
}
