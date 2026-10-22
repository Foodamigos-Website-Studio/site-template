"use client"

import Image from "next/image"
import { useEffect, useRef, type CSSProperties } from "react"

import type { Photo } from "@/lib/media"

/** A hand of photo cards along a curve; the whole fan drifts and tilts slightly while the page scrolls. */
export function HeroFan({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      ref.current?.style.setProperty("--drift", String(Math.min(window.scrollY, 900)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const middle = Math.floor(photos.length / 2)
  const seen = new Set<string>()

  return (
    <div
      ref={ref}
      className="fan-drift relative mt-10 h-[clamp(300px,38vw,580px)] w-full [--radius:96vw] md:mt-14"
    >
      {photos.map((photo, index) => {
        const offset = index - middle
        const first = !seen.has(photo.src)
        seen.add(photo.src)
        return (
          <div
            key={index}
            className="fan-card absolute left-1/2 top-8 w-[clamp(120px,17vw,280px)]"
            style={
              {
                "--o": offset,
                "--n": index,
                "--lift": offset === 0 ? "-2.2vw" : "0px",
                zIndex: 10 - Math.abs(offset),
              } as CSSProperties
            }
          >
            <div className="fan-card-inner relative aspect-[4/5] overflow-hidden rounded border-4 border-background bg-background shadow-[0_18px_36px_-14px_rgb(7_92_64_/_0.5)]">
              <Image
                src={photo.src}
                alt={first ? photo.alt : ""}
                fill
                sizes="(min-width: 1647px) 280px, 17vw"
                className="object-cover"
                priority={offset === 0}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
