// The restaurant's own photos and the mascots made for it: the only media the site uses.
const PHOTOS = "https://d1d3y7hwnj9i8h.cloudfront.net/01a15e53-074d-738a-970c-7b47788b6249"
const MASCOTS = "https://rrjrdb6wa7fojdf9.public.blob.vercel-storage.com/01a15e53-074d-738a-970c-7b47788b6249/websites/5/photos"

export type Media = { src: string; alt: string }

export const PHOTO = {
  hero: { src: `${PHOTOS}/1bbe7730c045695b153b1359ab4d590f-web.webp`, alt: "Double Flamin Hot Burger with two beef patties and hot cheddar" },
  bbq: { src: `${PHOTOS}/dc7fdf2d1aa3cf2e82ffcc158de2ad55-web.webp`, alt: "BBQ Bacon Burger" },
  gordo: { src: `${PHOTOS}/8b47d8434adaaf2fe168ce2e0d894b54-web.webp`, alt: "El Gordo Burger with two beef patties, bacon and guacamole" },
  chilli: { src: `${PHOTOS}/8ec289c3561feca7731dd667c86243f8-web.webp`, alt: "Chilli Cheese Burger with jalapeños and cheddar" },
  fries: { src: `${PHOTOS}/4bf625ee4f0b32ccc82f74552c531b95-web.webp`, alt: "Hot Cheese Fries with cheddar sauce" },
  shake: { src: `${PHOTOS}/c43b0b2170c1e80ce3cf6c27884440f9-web.webp`, alt: "Homemade Oreo milkshake" },
  ingredients: { src: `${PHOTOS}/ead4c87bd13bc063e86565b7ff5ea8b2-web.webp`, alt: "Fresh burger ingredients: lettuce, tomato, onion and cucumber on a blue background" },
  cheese: { src: `${PHOTOS}/54e09790ea66db76e1898b5b0d426bb6-web.webp`, alt: "Melted cheddar and sesame bun on a blue background" },
} satisfies Record<string, Media>

export const MASCOT = {
  burger: { src: `${MASCOTS}/gallery-generated-mvjtpzzc.jpg`, alt: "Cartoon burger mascot in red line art holding a milkshake" },
  fries: { src: `${MASCOTS}/gallery-generated-mvjtq0l5.jpg`, alt: "Dancing cartoon fries mascot in red line art" },
  shake: { src: `${MASCOTS}/gallery-generated-mvjtq0m2.jpg`, alt: "Cool cartoon milkshake mascot with sunglasses in red line art" },
  chili: { src: `${MASCOTS}/gallery-generated-mvjtq1o8.jpg`, alt: "Cartoon chili pepper and chicken mascots in red line art" },
} satisfies Record<string, Media>
