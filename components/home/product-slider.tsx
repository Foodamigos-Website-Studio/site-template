"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

import { ButtonLink } from "@/components/ui/button-link"

type Item = { id: string; name: string; imageUrl: string; price: string | null }

const arrowClasses =
  "inline-flex h-14 w-16 items-center justify-center rounded-full border-2 border-charcoal bg-background text-charcoal transition-transform duration-[150ms] ease-[ease] hover:-translate-y-0.5"

export function ProductSlider({ items, href }: { items: Item[]; href: string }) {
  const list = useRef<HTMLUListElement>(null)

  const scroll = (direction: 1 | -1) => {
    const element = list.current
    if (!element) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" })
  }

  return (
    <div aria-roledescription="carousel" aria-label="Popular products">
      <ul
        ref={list}
        tabIndex={0}
        aria-label="Popular products, scroll sideways"
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 pt-2 sm:px-[max(1.5rem,calc((100vw-1160px)/2))]"
      >
        {items.map((item) => (
          <li key={item.id} className="w-64 shrink-0 snap-start sm:w-72">
            <a
              href={href}
              className="group block overflow-hidden rounded-[7px] border-2 border-charcoal bg-background text-charcoal transition-transform duration-[150ms] ease-[ease] hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="288px"
                  className="object-cover transition-transform duration-[362ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1 p-4">
                <h3 className="line-clamp-2 min-h-[2.5rem] font-heading text-base uppercase leading-tight">{item.name}</h3>
                {item.price ? <p className="text-lg font-bold text-primary">{item.price}</p> : null}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-center justify-center gap-4 px-6">
        <button type="button" onClick={() => scroll(-1)} aria-label="Previous products" className={arrowClasses}>
          <ArrowLeft className="size-6" strokeWidth={3} aria-hidden="true" />
        </button>
        <ButtonLink href={href} size="md">
          See all
        </ButtonLink>
        <button type="button" onClick={() => scroll(1)} aria-label="Next products" className={arrowClasses}>
          <ArrowRight className="size-6" strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
