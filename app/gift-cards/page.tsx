// Gift cards: buy (amount, quantity, email; the payment is the online shop's checkout under /menu) and check a
// balance. Only when the module is on. Unstyled default markup v0 may replace, keeping the forms' hooks and actions.
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { GiftCardBalanceForm, type BalanceLabels } from "@/components/gift-cards/gift-card-balance-form"
import { GiftCardPurchaseForm, type PurchaseLabels } from "@/components/gift-cards/gift-card-purchase-form"
import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"
import { giftCardsOn } from "@/lib/modules"
import { pageMetadata } from "@/lib/seo"
import { getMenu, getProject } from "@/lib/studio-api"

/** Default labels; v0 writes the page's texts in the site's language. */
const LABELS: Record<"de" | "en", { purchase: PurchaseLabels; balance: BalanceLabels }> = {
  de: {
    purchase: {
      amount: "Betrag", custom: "Eigener Betrag", quantity: "Anzahl", email: "E-Mail", emailRepeat: "E-Mail wiederholen",
      review: "Weiter", total: "Gesamt", back: "Zurück", checkout: "Zur Kasse",
      problems: { amount: "Bitte einen Betrag zwischen 10 und 1000 wählen.", quantity: "Bitte 1 bis 10 Gutscheine.", email: "Bitte eine gültige E-Mail-Adresse.", email_mismatch: "Die E-Mail-Adressen stimmen nicht überein." },
    },
    balance: {
      code: "Gutscheincode (16 Ziffern)", check: "Guthaben prüfen", balance: "Guthaben", expires: "Gültig bis",
      results: { invalid: "Bitte die 16 Ziffern des Codes eingeben.", not_found: "Dieser Code wurde nicht gefunden.", rate_limited: "Bitte in einer Minute erneut versuchen.", failed: "Das hat nicht geklappt, bitte später erneut versuchen." },
    },
  },
  en: {
    purchase: {
      amount: "Amount", custom: "Your amount", quantity: "Quantity", email: "Email", emailRepeat: "Repeat email",
      review: "Continue", total: "Total", back: "Back", checkout: "Go to checkout",
      problems: { amount: "Choose an amount between 10 and 1000.", quantity: "Choose 1 to 10 gift cards.", email: "Enter a valid email address.", email_mismatch: "The email addresses don't match." },
    },
    balance: {
      code: "Gift card code (16 digits)", check: "Check balance", balance: "Balance", expires: "Valid until",
      results: { invalid: "Enter the code's 16 digits.", not_found: "This code was not found.", rate_limited: "Try again in a minute.", failed: "That didn't work, please try again later." },
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  return pageMetadata({ title: project?.name ?? "", description: project?.tagline ?? project?.name ?? "", path: localizedPath("gift-cards", SITE_LANGUAGE) })
}

export default async function GiftCardsPage() {
  const [project, menu] = await Promise.all([getProject(), getMenu()])
  if (!giftCardsOn(project)) notFound()
  const labels = LABELS[SITE_LANGUAGE === "de" ? "de" : "en"]
  const currency = menu?.currency ?? "EUR"
  return (
    <section data-slot="gift-cards">
      <h1>{project?.name}</h1>
      <GiftCardPurchaseForm currency={currency} language={SITE_LANGUAGE} labels={labels.purchase} />
      <GiftCardBalanceForm language={SITE_LANGUAGE} labels={labels.balance} />
    </section>
  )
}
