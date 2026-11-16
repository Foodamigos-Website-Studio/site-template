import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { PHOTOS, type Photo } from "@/lib/media"
import { sitePaths } from "@/lib/nav"
import type { Menu } from "@/lib/studio-api"

import { SliderTrack } from "./slider-track"

const fold = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

const SIGNATURES: { keyword: string; photo: Photo; exclude?: string }[] = [
  { keyword: "carbonara", photo: PHOTOS.pasta },
  { keyword: "pasta", photo: PHOTOS.dish, exclude: "carbonara" },
  { keyword: "pizza", photo: PHOTOS.pizza },
  { keyword: "tiramisu", photo: PHOTOS.tiramisu },
]

export type Dish = { id: string; name: string; category: string; photo: Photo }

/** Signature dishes that really exist in the shop menu: matched by name, never invented. */
export function signatureDishes(menu: Menu | null): Dish[] {
  const company = menu?.companies?.[0]
  if (!company) return []
  const entries = company.menus.flatMap((group) => group.categories.flatMap((category) => category.products.map((product) => ({ product, category: category.name }))))
  const used = new Set<number>()
  const dishes: Dish[] = []
  for (const signature of SIGNATURES) {
    const match =
      entries.find((entry) => !used.has(entry.product.id) && fold(entry.product.name).includes(signature.keyword) && !(signature.exclude && fold(entry.product.name).includes(signature.exclude))) ??
      entries.find((entry) => !used.has(entry.product.id) && fold(entry.category).includes(signature.keyword) && !(signature.exclude && fold(entry.product.name).includes(signature.exclude)))
    if (!match) continue
    used.add(match.product.id)
    dishes.push({ id: String(match.product.id), name: match.product.name, category: match.category, photo: signature.photo })
  }
  return dishes
}

export function DishSlider({ menu }: { menu: Menu | null }) {
  const dishes = signatureDishes(menu)
  if (!dishes.length) return null
  return (
    <section data-section="7" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <Reveal>
          <span className="label block">Unsere Klassiker</span>
          <h2 className="display mt-1 text-3xl sm:text-4xl">Das kommt bei uns am liebsten auf den Tisch</h2>
        </Reveal>
        <Reveal index={1}>
          <SliderTrack dishes={dishes} />
        </Reveal>
        <Link href={sitePaths().menu} className="btn mt-10">
          Alle Gerichte ansehen
        </Link>
      </div>
    </section>
  )
}
