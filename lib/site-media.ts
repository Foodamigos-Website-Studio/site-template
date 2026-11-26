const PHOTOS = "https://iq2d9ztjcqneejj5.public.blob.vercel-storage.com/5f0c2a9e-3b1d-4e8a-9c7f-1a2b3c4d5e6f/websites/43/photos"

export type SitePhoto = { src: string; alt: string; caption?: string }

export const HERO_PHOTO: SitePhoto = {
  src: `${PHOTOS}/hero-generated-mvfe9pul.jpg`,
  alt: "Frische Pasta-Nester auf hellem Marmor",
}

export const GALLERY_PHOTOS: SitePhoto[] = [
  { src: `${PHOTOS}/gallery-generated-mvfe9q7b.jpg`, alt: "Tomaten, Basilikum und Olivenöl auf Leinen", caption: "Tomaten & Olivenöl" },
  { src: `${PHOTOS}/gallery-generated-mvfe9q0f.jpg`, alt: "Mehl, Eier und Nudelholz auf hellem Holztisch", caption: "Mehl & Eier" },
  { src: `${PHOTOS}/gallery-generated-mvfe9piq.jpg`, alt: "Weingläser vor heller Wand", caption: "Wein & Gastfreundschaft" },
]

export const HERO_SLIDES: SitePhoto[] = [HERO_PHOTO, ...GALLERY_PHOTOS]
