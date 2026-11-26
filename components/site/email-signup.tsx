import { formatPrice } from "@/lib/format"
import { SITE_LANGUAGE } from "@/lib/config"
import { getCompanies, getMarketingSettings, SITE_API_BASE_URL, type MarketingSettings } from "@/lib/studio-api"

import { EmailSignupPopup } from "./email-signup-popup"

/** "10 %" or "5,00 €" from the live settings: the sum of all components' discounts. */
function describeOffer(settings: MarketingSettings, currency: string): string | null {
  const total = settings.components.reduce((sum, component) => sum + (component.discount ?? 0), 0)
  if (total <= 0) return null
  const isPercent = settings.discount_type === "percentage"
  const amount = isPercent ? `${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(total)} % Rabatt` : `${formatPrice(total, currency, SITE_LANGUAGE)} Rabatt`
  const first = settings.components[0]
  const parts = [amount]
  if (first?.usage_threshold) parts.push(`ab ${formatPrice(first.usage_threshold, currency, SITE_LANGUAGE)} Bestellwert`)
  if (first?.max_discount) parts.push(`höchstens ${formatPrice(first.max_discount, currency, SITE_LANGUAGE)}`)
  return parts.join(", ")
}

export async function EmailSignup() {
  const [marketing, companies] = await Promise.all([getMarketingSettings(), getCompanies()])
  if (!marketing) return null
  const currency = companies?.[0]?.currency ?? "EUR"
  const offer = marketing.settings ? describeOffer(marketing.settings, currency) : null
  return <EmailSignupPopup apiUrl={SITE_API_BASE_URL} offer={offer} />
}
