"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import type { SitePhoto } from "@/lib/site-media"

const INTERVAL_MS = 6500

export function HeroSlider({ slides }: { slides: SitePhoto[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const count = slides.length

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const go = useCallback((next: number) => setIndex((next + count) % count), [count])

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [paused, reduceMotion, count])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Bildergalerie"
      className="relative h-[68svh] min-h-[420px] w-full overflow-hidden bg-secondary md:h-[832px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} von ${count}`}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={slide.src} alt={slide.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
        </div>
      ))}

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Vorheriges Bild"
        className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded bg-secondary/40 text-paper transition-colors duration-200 hover:bg-secondary md:left-6"
      >
        <ChevronLeft className="size-6" strokeWidth={1.25} />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Nächstes Bild"
        className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded bg-secondary/40 text-paper transition-colors duration-200 hover:bg-secondary md:right-16"
      >
        <ChevronRight className="size-6" strokeWidth={1.25} />
      </button>

      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Bild ${i + 1} anzeigen`}
            aria-current={i === index}
            className="group flex size-8 items-center justify-center"
          >
            <span className={`block size-2 rounded-full transition-colors duration-200 ${i === index ? "bg-paper" : "bg-paper/50 group-hover:bg-paper/80"}`} />
          </button>
        ))}
      </div>
    </section>
  )
}
