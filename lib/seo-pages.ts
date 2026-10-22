// Pages the site has only to be found and indexed, as on the storefront: not in the navigation, but in the sitemap.
// The texts start as the storefront's (storefront-backend CouponPageService, store_setup.php and seo.php) and live
// here, statically; the restaurant's name, city and email are filled in from the site API. Other languages get English.
//
// SEO optimization: rewrite these texts (meta title and description, keywords, the h1, the FAQ) only to rank better,
// with the restaurant's name, cuisine, city and dietary options, in the site's language. Keep the structure: one h1,
// the FAQ items, the :name / :city / :contact placeholders or the real values. Never promise concrete offers, codes or
// prices the restaurant has not given.

export type SeoPageKey = "coupons"

type SeoPageTexts = {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  title: string
  faq: { question: string; answer: string }[]
  /** The last answer's contact sentence, with the restaurant's email or without when it has none. */
  contact: { withEmail: string; withoutEmail: string }
}

const COUPONS: Record<"de" | "en", SeoPageTexts> = {
  de: {
    metaTitle: "Coupons | :name :city",
    metaDescription:
      "Hol dir die besten Angebote und Rabatte bei :name in :city! Schau dir unsere exklusiven Gutscheine an und spar noch heute richtig!",
    keywords: ["angebote", "belohnungen", "coupons", ":name :city"],
    title: "Beste Angebote & Rabatte bei :name in :city",
    faq: [
      {
        question: "Entdecken Sie unsere aufregenden Aktionen",
        answer:
          "In unserem Restaurant legen wir großen Wert darauf, Ihnen großartigen Genuss zu unschlagbaren Preisen zu bieten. Entdecken Sie unsere saisonalen Aktionen und monatlichen Highlights, die sorgfältig zusammengestellt wurden, um Ihnen ein außergewöhnliches kulinarisches Erlebnis zu bieten. Von attraktiven Bundles bis zu exklusiven Rabatten für Online-Bestellungen gibt es bei uns immer etwas Besonderes zu entdecken.",
      },
      {
        question: "So lösen Sie unsere Angebote ein",
        answer:
          "Das Einlösen unserer Angebote ist ganz einfach! Für Online-Bestellungen geben Sie einfach den angegebenen Rabattcode beim Checkout ein. Wenn Sie bei uns im Restaurant speisen, nennen Sie das Angebot einfach Ihrem Servicepersonal, um die Ersparnisse zu genießen. Achten Sie darauf, die Gültigkeitsdaten jeder Aktion zu überprüfen, damit Sie nichts verpassen.",
      },
      {
        question: "Allgemeine Geschäftsbedingungen",
        answer:
          "Bitte beachten Sie, dass einige Aktionen spezifische Geschäftsbedingungen haben können. Diese können unter anderem einen Mindestbestellwert oder Einschränkungen für bestimmte Gerichte umfassen. Wir empfehlen, die Details jeder Aktion zu prüfen, um über mögliche Ausschlüsse oder Anforderungen informiert zu sein.",
      },
      {
        question: "Berechtigung und Ausschlüsse",
        answer:
          "Einige Aktionen stehen nur neuen Kunden zur Verfügung, während andere für alle Gäste gelten. Bestimmte Artikel oder Dienstleistungen können von Aktionen ausgeschlossen sein. Prüfen Sie die Angebotsdetails, um eine vollständige Liste der Ausschlüsse zu erhalten.",
      },
      {
        question: "Fragen?",
        answer:
          "Wenn Sie Fragen haben oder weitere Informationen zu unseren Angeboten benötigen, zögern Sie nicht, uns zu kontaktieren. Unser freundliches Team hilft Ihnen gerne, unsere Sonderangebote zu nutzen. :contact",
      },
    ],
    contact: {
      withEmail: "Kontaktieren Sie uns unter :email oder besuchen Sie uns im Restaurant für Unterstützung.",
      withoutEmail: "Besuchen Sie uns im Restaurant für Unterstützung.",
    },
  },
  en: {
    metaTitle: "Coupons | :name :city",
    metaDescription:
      "Get the best deals and discounts at :name in :city! Check out our exclusive vouchers and start saving big today!",
    keywords: ["offers", "rewards", "coupons", ":name :city"],
    title: "Best Offers & Discounts at :name in :city",
    faq: [
      {
        question: "Discover Our Exciting Promotions",
        answer:
          "At our restaurant, we always strive to bring you great value and delicious food. Discover our seasonal promotions and monthly highlights, carefully curated to provide you with an exceptional dining experience at unbeatable prices. From delightful bundles to exclusive discounts for online orders, there's always something special waiting for you.",
      },
      {
        question: "How to Redeem Our Offers",
        answer:
          "Redeeming our offers is simple! For online orders, just enter the discount code provided at checkout. When dining at our restaurant, mention the offer to your server to enjoy the savings. Make sure to check the validity dates of each promotion so you don't miss out.",
      },
      {
        question: "Terms and Conditions",
        answer:
          "Please note that some promotions may come with specific terms and conditions. These could include, but are not limited to, a minimum purchase amount or restrictions on certain menu items. We recommend reviewing the details of each offer to ensure you are aware of any exclusions or requirements.",
      },
      {
        question: "Eligibility and Exclusions",
        answer:
          "Some promotions are only available to new customers, while others are available to all guests. Certain items or services may be excluded from promotions. Check the offer details for a comprehensive list of exclusions.",
      },
      {
        question: "Questions?",
        answer:
          "If you have any questions or need more information about our offers, do not hesitate to contact us. Our friendly team is available to help you take advantage of our special offers. :contact",
      },
    ],
    contact: {
      withEmail: "Contact us via :email or visit us in the restaurant for assistance.",
      withoutEmail: "Visit us in the restaurant for assistance.",
    },
  },
}

export const SEO_PAGES: readonly SeoPageKey[] = ["coupons"]

export function seoSlug(page: SeoPageKey, language: string): string {
  switch (page) {
    case "coupons":
      return language === "de" ? "/angebote" : "/coupons"
  }
}

export function seoPaths(language: string): string[] {
  return SEO_PAGES.map((page) => seoSlug(page, language))
}

export type SeoPageContent = Omit<SeoPageTexts, "contact">

/** The page's texts in the site's language, filled with the restaurant's name, city and email. */
export function seoPageContent(
  page: SeoPageKey,
  language: string,
  restaurant: { name: string; city: string; email: string },
): SeoPageContent {
  const texts = COUPONS[language === "de" ? "de" : "en"]
  const contact = (restaurant.email ? texts.contact.withEmail : texts.contact.withoutEmail).replace(":email", restaurant.email)
  const fill = (text: string) =>
    text
      .replace(":contact", contact)
      .replaceAll(":name", restaurant.name)
      .replaceAll(":city", restaurant.city)
      .replace(/ {2,}/g, " ")
      .trim()
  return {
    metaTitle: fill(texts.metaTitle),
    metaDescription: fill(texts.metaDescription),
    keywords: texts.keywords.map(fill),
    title: fill(texts.title),
    faq: texts.faq.map((item) => ({ question: fill(item.question), answer: fill(item.answer) })),
  }
}
