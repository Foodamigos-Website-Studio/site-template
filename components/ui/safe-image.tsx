"use client"

import { useEffect, useRef, useState } from "react"

import { MASCOT } from "@/lib/media"
import { cn } from "@/lib/utils"

const FALLBACKS = [MASCOT.burger, MASCOT.fries, MASCOT.shake, MASCOT.chili]

/**
 * A plain <img> that fills its (relatively positioned) parent. If the photo fails to load it is replaced by a
 * red-line mascot on a light tile, so a broken or blank image box never shows.
 */
export function SafeImage({
  src,
  alt,
  eager = false,
  contain = false,
  fallbackIndex = 0,
  className,
}: {
  src: string
  alt: string
  eager?: boolean
  contain?: boolean
  fallbackIndex?: number
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const [fallbackFailed, setFallbackFailed] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const image = ref.current
    if (image && image.complete && image.naturalWidth === 0) setFailed(true)
  }, [])

  if (failed) {
    const mascot = FALLBACKS[fallbackIndex % FALLBACKS.length]
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        {fallbackFailed ? null : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mascot.src}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFallbackFailed(true)}
            className="size-full object-contain p-2 mix-blend-multiply"
          />
        )}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("absolute inset-0 size-full", contain ? "object-contain p-3" : "object-cover", className)}
    />
  )
}
