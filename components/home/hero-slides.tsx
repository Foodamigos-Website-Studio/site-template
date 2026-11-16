"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import type { Photo } from "@/lib/media"

const INTERVAL_MS = 6000

/** Slow cross-fading image slider with small dots at the bottom centre. Fills its (relative, isolated) parent. */
export function HeroSlides({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (photos.length < 2) return
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % photos.length), INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [active, photos.length])

  return (
    <>
      <div className="absolute inset-0 -z-20">
        {photos.map((photo, index) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            aria-hidden={index === active ? undefined : true}
            className={`hero-zoom object-cover transition-opacity duration-[2000ms] ease-in-out ${index === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      {photos.length > 1 ? (
        <div className="absolute inset-x-0 bottom-20 z-10 flex items-center justify-center md:bottom-8" role="group" aria-label="Bildauswahl">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Bild ${index + 1} von ${photos.length}`}
              aria-current={index === active ? "true" : undefined}
              className="group flex size-6 items-center justify-center"
            >
              <span className={`block size-2 rounded-full border border-background transition-colors duration-500 ${index === active ? "bg-background" : "bg-transparent group-hover:bg-background/50"}`} />
            </button>
          ))}
        </div>
      ) : null}
    </>
  )
}
