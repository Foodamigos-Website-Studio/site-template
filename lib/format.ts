// Formatting in the site's language and the restaurant's currency (Intl, no libraries).

/** de → de-DE style locale for Intl; any ISO 639-1 code works as an Intl locale on its own. */
export function siteLocale(language: string): string {
  return language || "en"
}

/** 14.5 → "14,50 €" on a German site. Prices from the site API are decimals in the major unit. */
export function formatPrice(amount: number, currency: string, language: string): string {
  return new Intl.NumberFormat(siteLocale(language), { style: "currency", currency }).format(amount)
}
