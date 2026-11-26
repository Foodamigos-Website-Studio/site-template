"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import type { SitePhoto } from "@/lib/site-media"

export function GallerySlider({ photos }: { photos: SitePhoto[] }) {
  const scroller = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [update])

  function scrollByPanel(direction: 1 | -1) {
    const el = scroller.current
    if (!el) return
    const panel = el.firstElementChild as HTMLElement | null
    el.scrollBy({ left: direction * (panel?.clientWidth ?? el.clientWidth), behavior: "smooth" })
  }

  return (
    <section aria-label="Zutaten und Handwerk" className="relative bg-secondary">
      <h2 className="sr-only">Zutaten und Handwerk</h2>
      <ul ref={scroller} onScroll={update} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((photo, i) => (
          <li key={photo.src} className="group relative aspect-[0.56] shrink-0 basis-[82%] snap-start overflow-hidden sm:basis-1/2 lg:basis-1/3">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 82vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              priority={i === 0 ? false : undefined}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/70 to-transparent px-6 pb-8 pt-24">
              <p className="eyebrow text-center text-sm text-paper md:text-base">{photo.caption}</p>
            </div>
          </li>
        ))}
      </ul>
      {canPrev ? (
        <button
          type="button"
          onClick={() => scrollByPanel(-1)}
          aria-label="Vorheriges Bild"
          className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded bg-secondary/50 text-paper transition-colors duration-200 hover:bg-secondary md:left-6"
        >
          <ChevronLeft className="size-6" strokeWidth={1.25} />
        </button>
      ) : null}
      {canNext ? (
        <button
          type="button"
          onClick={() => scrollByPanel(1)}
          aria-label="Nächstes Bild"
          className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded bg-secondary/50 text-paper transition-colors duration-200 hover:bg-secondary md:right-6"
        >
          <ChevronRight className="size-6" strokeWidth={1.25} />
        </button>
      ) : null}
    </section>
  )
}
