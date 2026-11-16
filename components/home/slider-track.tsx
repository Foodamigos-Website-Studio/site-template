"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

import type { Dish } from "./dish-slider"

export function SliderTrack({ dishes }: { dishes: Dish[] }) {
  const track = useRef<HTMLUListElement>(null)
  const scroll = (direction: 1 | -1) => {
    const element = track.current
    if (!element) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" })
  }

  return (
    <div className="relative mt-10">
      <ul ref={track} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Klassiker der Speisekarte">
        {dishes.map((dish) => (
          <li key={dish.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-[calc(25%-1.125rem)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-ink">
              <Image src={dish.photo.src} alt={dish.photo.alt} fill sizes="(min-width: 1024px) 280px, 72vw" className="object-cover" />
            </div>
            <p className="label mt-3 text-xs">{dish.category}</p>
            <p className="display mt-1 text-xl">{dish.name}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={() => scroll(-1)} aria-label="Zurück" className="flex size-12 items-center justify-center rounded-[3px] border border-text-primary hover:bg-text-primary hover:text-background">
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label="Weiter" className="flex size-12 items-center justify-center rounded-[3px] border border-text-primary hover:bg-text-primary hover:text-background">
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
