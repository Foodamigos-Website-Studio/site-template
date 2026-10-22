// The restaurant's own photos from the brief (exact URLs). Nothing else is used as imagery on the site.
const BASE = "https://d1d3y7hwnj9i8h.cloudfront.net/01a15e53-074d-738a-970c-7b47788b6249"

export type Photo = { src: string; alt: string; width: number; height: number }

export const MEDIA = {
  hero: {
    src: `${BASE}/1bbe7730c045695b153b1359ab4d590f-web.webp`,
    alt: "Double Flamin Hot Burger mit zwei Beef Patties, Hot Cheddar und Hot Cheetos",
    width: 335,
    height: 225,
  },
  fries: {
    src: `${BASE}/4bf625ee4f0b32ccc82f74552c531b95-web.webp`,
    alt: "Hot Cheese Fries mit Cheddarsauce",
    width: 335,
    height: 225,
  },
  chilli: {
    src: `${BASE}/8ec289c3561feca7731dd667c86243f8-web.webp`,
    alt: "Chilli Cheese Burger mit Jalapeños und Cheddar",
    width: 335,
    height: 225,
  },
  elGordo: {
    src: `${BASE}/8b47d8434adaaf2fe168ce2e0d894b54-web.webp`,
    alt: "El Gordo Burger mit zwei Beef Patties, Bacon und Guacamole",
    width: 335,
    height: 225,
  },
  bbq: {
    src: `${BASE}/dc7fdf2d1aa3cf2e82ffcc158de2ad55-web.webp`,
    alt: "BBQ Bacon Burger",
    width: 335,
    height: 225,
  },
  shake: {
    src: `${BASE}/c43b0b2170c1e80ce3cf6c27884440f9-web.webp`,
    alt: "Hausgemachter Oreo Milchshake",
    width: 335,
    height: 225,
  },
  ingredients: {
    src: `${BASE}/ead4c87bd13bc063e86565b7ff5ea8b2.jpg`,
    alt: "Frische Burger-Zutaten: Salat, Tomate, Zwiebel und Gurke auf blauem Hintergrund",
    width: 1600,
    height: 896,
  },
  cheese: {
    src: `${BASE}/54e09790ea66db76e1898b5b0d426bb6.jpg`,
    alt: "Geschmolzener Cheddar und Sesam-Brötchen auf blauem Hintergrund",
    width: 1024,
    height: 1280,
  },
} satisfies Record<string, Photo>
