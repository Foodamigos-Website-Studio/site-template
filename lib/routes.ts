// The site's own pages, with paths in the site's language (de).
export const ROUTES = {
  home: "/",
  about: "/ueber-uns",
  locations: "/standorte",
  contact: "/kontakt",
  shop: "/menu",
} as const

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`
