const BLOB = "https://iq2d9ztjcqneejj5.public.blob.vercel-storage.com/5f0c2a9e-3b1d-4e8a-9c7f-1a2b3c4d5e6f/websites/43/photos/"

export type Photo = { src: string; alt: string }

export const PHOTOS = {
  hero: {
    src: `${BLOB}hero-generated-mvfe9pul.jpg`,
    alt: "Frische Pasta-Nester auf hellem Marmor",
  },
  tomatoes: {
    src: `${BLOB}gallery-generated-mvfe9q7b.jpg`,
    alt: "Tomaten, Basilikum und Olivenöl auf Leinen",
  },
  flour: {
    src: `${BLOB}gallery-generated-mvfe9q0f.jpg`,
    alt: "Mehl, Eier und Nudelholz auf hellem Holztisch",
  },
  wine: {
    src: `${BLOB}gallery-generated-mvfe9piq.jpg`,
    alt: "Weingläser vor heller Wand",
  },
} satisfies Record<string, Photo>
