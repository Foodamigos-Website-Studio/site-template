// The dish page fixture (/tags/preview) v0 styles /tags/[slug] on: a sample dish page with placeholder copy in the
// site's language and the menu's first products, so v0 styles real item cards with photos. Served only outside
// production (PRODUCTION_DEPLOYMENT in lib/config.ts: v0's sandbox, pnpm dev and preview deployments), never linked,
// never in the sitemap, always noindex. It reads only GET /project and GET /menu; no new site API call.
import type { Menu, MenuProduct, Project, TagPage } from "./studio-api"

export const PREVIEW_TAG_SLUG = "preview"

/** How many of the menu's first products the fixture shows. */
export const PREVIEW_PRODUCT_COUNT = 3

type FaqItem = { question: string; answer: string }

export type TagPagePreviewCopy = {
  /** The dish when the menu has no products. */
  sampleDish: string
  /** The dish page's H1 format, "[Dish] at [Restaurant]". */
  title: (dish: string, restaurant: string) => string
  paragraphs: (dish: string) => [string, string]
  faq: (dish: string) => [FaqItem, FaqItem, FaqItem]
  metaTitle: (dish: string) => string
  metaDescription: (dish: string) => string
}

/** The fixture's placeholder copy, for every language TAG_PAGE_LABELS has; written by hand for de and en. */
export const TAG_PAGE_PREVIEW_COPY: Record<string, TagPagePreviewCopy> = {
  de: {
    sampleDish: "Hausgemachte Pasta",
    title: (dish, restaurant) => `${dish} bei ${restaurant}`,
    paragraphs: (dish) => [
      `${dish} gehört zu den Gerichten, für die unsere Gäste immer wieder kommen. Wir bereiten es jeden Tag frisch zu, mit Zutaten, die wir sorgfältig auswählen.`,
      `Ob zum Mittag, am Abend oder zum Mitnehmen: ${dish} schmeckt bei uns so, wie es schmecken soll. Hier steht später der Text, den Max für dieses Gericht schreibt.`,
    ],
    faq: (dish) => [
      { question: `Ist ${dish} frisch zubereitet?`, answer: `Ja, wir bereiten ${dish} jeden Tag frisch zu.` },
      { question: `Kann ich ${dish} online bestellen?`, answer: `Ja, ${dish} können Sie zum Abholen oder mit Lieferung bestellen, wo wir das anbieten.` },
      { question: `Gibt es ${dish} auch vegetarisch?`, answer: "Fragen Sie uns gern: Viele Gerichte bereiten wir auf Wunsch auch vegetarisch zu." },
    ],
    metaTitle: (dish) => `${dish}: frisch zubereitet`,
    metaDescription: (dish) => `${dish} frisch zubereitet: bestellen Sie online, holen Sie ab oder reservieren Sie einen Tisch bei uns.`,
  },
  en: {
    sampleDish: "Homemade pasta",
    title: (dish, restaurant) => `${dish} at ${restaurant}`,
    paragraphs: (dish) => [
      `${dish} is one of the dishes our guests keep coming back for. We make it fresh every day, with ingredients we choose with care.`,
      `For lunch, dinner or to take away: ${dish} tastes the way it should here. This is where the text Max writes for this dish will go.`,
    ],
    faq: (dish) => [
      { question: `Is the ${dish} made fresh?`, answer: `Yes, we make ${dish} fresh every day.` },
      { question: `Can I order ${dish} online?`, answer: `Yes, you can order ${dish} for pickup, or for delivery where we offer it.` },
      { question: `Is there a vegetarian ${dish}?`, answer: "Just ask us: we can make many of our dishes vegetarian." },
    ],
    metaTitle: (dish) => `${dish}: made fresh`,
    metaDescription: (dish) => `${dish}, made fresh every day: order online, pick it up or book a table with us.`,
  },
  fr: {
    sampleDish: "Pâtes maison",
    title: (dish, restaurant) => `${dish} chez ${restaurant}`,
    paragraphs: (dish) => [
      `${dish} fait partie des plats pour lesquels nos clients reviennent. Nous le préparons frais chaque jour, avec des ingrédients choisis avec soin.`,
      `Au déjeuner, au dîner ou à emporter : ${dish} a ici le goût qu'il doit avoir. C'est ici que figurera le texte que Max écrit pour ce plat.`,
    ],
    faq: (dish) => [
      { question: `${dish} est-il préparé frais ?`, answer: `Oui, nous préparons ${dish} frais chaque jour.` },
      { question: `Puis-je commander ${dish} en ligne ?`, answer: `Oui, vous pouvez commander ${dish} à emporter, ou en livraison là où nous la proposons.` },
      { question: `Existe-t-il une version végétarienne de ${dish} ?`, answer: "Demandez-nous : nous pouvons préparer beaucoup de nos plats en version végétarienne." },
    ],
    metaTitle: (dish) => `${dish} : préparé frais`,
    metaDescription: (dish) => `${dish}, préparé frais chaque jour : commandez en ligne, à emporter, ou réservez une table chez nous.`,
  },
  es: {
    sampleDish: "Pasta casera",
    title: (dish, restaurant) => `${dish} en ${restaurant}`,
    paragraphs: (dish) => [
      `${dish} es uno de los platos por los que nuestros clientes siempre vuelven. Lo preparamos fresco cada día, con ingredientes elegidos con cuidado.`,
      `Para comer, para cenar o para llevar: ${dish} sabe aquí como debe saber. Aquí irá el texto que Max escribe para este plato.`,
    ],
    faq: (dish) => [
      { question: `¿${dish} se prepara fresco?`, answer: `Sí, preparamos ${dish} fresco cada día.` },
      { question: `¿Puedo pedir ${dish} en línea?`, answer: `Sí, puede pedir ${dish} para recoger, o a domicilio donde lo ofrecemos.` },
      { question: `¿Hay ${dish} vegetariano?`, answer: "Pregúntenos: podemos preparar muchos de nuestros platos en versión vegetariana." },
    ],
    metaTitle: (dish) => `${dish}: preparado fresco`,
    metaDescription: (dish) => `${dish}, preparado fresco cada día: pida en línea, recójalo o reserve una mesa con nosotros.`,
  },
  it: {
    sampleDish: "Pasta fatta in casa",
    title: (dish, restaurant) => `${dish} da ${restaurant}`,
    paragraphs: (dish) => [
      `${dish} è uno dei piatti per cui i nostri ospiti tornano sempre. Lo prepariamo fresco ogni giorno, con ingredienti scelti con cura.`,
      `A pranzo, a cena o da asporto: ${dish} qui ha il sapore che deve avere. Qui andrà il testo che Max scrive per questo piatto.`,
    ],
    faq: (dish) => [
      { question: `${dish} è preparato fresco?`, answer: `Sì, prepariamo ${dish} fresco ogni giorno.` },
      { question: `Posso ordinare ${dish} online?`, answer: `Sì, può ordinare ${dish} da asporto, o con consegna dove la offriamo.` },
      { question: `C'è ${dish} vegetariano?`, answer: "Ci chieda pure: molti dei nostri piatti li prepariamo anche in versione vegetariana." },
    ],
    metaTitle: (dish) => `${dish}: preparato fresco`,
    metaDescription: (dish) => `${dish}, preparato fresco ogni giorno: ordini online, ritiri da noi o prenoti un tavolo.`,
  },
}

/** The fixture's copy in the site's language; unknown languages get en, like tagPageLabels(). */
export function tagPagePreviewCopy(language: string): TagPagePreviewCopy {
  return TAG_PAGE_PREVIEW_COPY[language] ?? TAG_PAGE_PREVIEW_COPY.en
}

/** The menu's first products in menu order (every location, menu and category), each once. */
function firstProducts(menu: Menu | null, count: number): MenuProduct[] {
  const products = new Map<number, MenuProduct>()
  for (const company of menu?.companies ?? []) {
    for (const group of company.menus) {
      for (const category of group.categories) {
        for (const product of category.products) {
          if (products.size >= count) return [...products.values()]
          if (!products.has(product.id)) products.set(product.id, product)
        }
      }
    }
  }
  return [...products.values()]
}

/**
 * The /tags/preview fixture as a TagPage: the H1 "[Dish] at [Restaurant]" with the menu's first product and the
 * project's name (a sample dish from the copy when the menu has no products; the dish alone when the project can't be
 * read), 2 paragraphs and 3 FAQ of placeholder copy, meta texts, and the menu's first 3 products.
 */
export function previewTagPage(project: Project | null, menu: Menu | null, language: string): TagPage {
  const copy = tagPagePreviewCopy(language)
  const products = firstProducts(menu, PREVIEW_PRODUCT_COUNT)
  const dish = products[0]?.name ?? copy.sampleDish
  return {
    slug: PREVIEW_TAG_SLUG,
    keyword: dish,
    title: project?.name ? copy.title(dish, project.name) : dish,
    paragraphs: copy.paragraphs(dish),
    faq: copy.faq(dish),
    metaTitle: copy.metaTitle(dish),
    metaDescription: copy.metaDescription(dish),
    productIds: products.map((product) => product.id),
    updatedAt: null,
  }
}

