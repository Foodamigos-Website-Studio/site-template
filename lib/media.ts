const BLOB = "https://iq2d9ztjcqneejj5.public.blob.vercel-storage.com/5f0c2a9e-3b1d-4e8a-9c7f-1a2b3c4d5e6f/websites/42/photos/"

export type Photo = { src: string; alt: string }

export const PHOTOS = {
  hero: {
    src: `${BLOB}hero-mwjtopty0-photo-1-864H1WUO5SuuH97EQZjP5udUTjek3O.jpg`,
    alt: "Trattoria Bella – Hausgemachte Pasta und italienische Gerichte",
  },
  dish: {
    src: `${BLOB}food-mwjtopty1-photo-2-d69EG0LWn3Bd5srtZC2LnpZIRpYZG2.jpg`,
    alt: "Frisch zubereitetes Gericht in der Trattoria Bella",
  },
  kitchen: {
    src: `${BLOB}food-mwjtopty2-photo-3-p1UxINWhL2qh8kHO5MbGDEme9mt5Gu.jpg`,
    alt: "Italienisches Gericht aus der Küche der Trattoria Bella",
  },
  pasta: {
    src: `${BLOB}food-mwjtopty3-photo-4-juq77vWHC91LoBNPWY2CdOYp4h1V5b.jpg`,
    alt: "Hausgemachte Pasta in der Trattoria Bella",
  },
  pizza: {
    src: `${BLOB}food-mwjtopty4-photo-5-XTwUbmUU50CXSavdv9Kjioozcbpd9T.jpg`,
    alt: "Pizza und Pasta der Trattoria Bella",
  },
  tiramisu: {
    src: `${BLOB}food-mwjtx8c39-tiramisu-e13CPcucTq1gcVA3upvPLR7T7eFySg.webp`,
    alt: "Hausgemachtes Tiramisù der Trattoria Bella",
  },
  room: {
    src: `${BLOB}interior-mwjtoptz5-photo-6-N55J5mQxKDxGkCoVqSMaDwcCd6xjWo.jpg`,
    alt: "Gemütlicher Gastraum der Trattoria Bella",
  },
  tables: {
    src: `${BLOB}interior-mwjtoptz6-photo-7-9nA7Z7jJJFhvOIRGzEPdIYgcY0sOxS.jpg`,
    alt: "Gastraum mit Tischen in der Trattoria Bella",
  },
  view: {
    src: `${BLOB}interior-mwjtoptz7-photo-8-tuFXF84Ef8EZMaUbn1tvGITxO7SEbP.jpg`,
    alt: "Blick in die Trattoria Bella",
  },
} satisfies Record<string, Photo>

export const TOUR_VIDEO = {
  src: `${BLOB}gallery-mwjtoptz8-restaurant-tour-xhwabma1QMKJhoePr5SIrB9l2fyl5M.mp4`,
  label: "Rundgang durch die Trattoria Bella",
}
