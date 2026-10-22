import Image from "next/image"

import type { Media } from "@/lib/media"
import { cn } from "@/lib/utils"

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20 0C21.5 11 29 18.5 40 20C29 21.5 21.5 29 20 40C18.5 29 11 21.5 0 20C11 18.5 18.5 11 20 0Z" />
    </svg>
  )
}

/** The checkerboard strip between sections. */
export function Checker({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("checker w-full", className)} />
}

/** A hand-drawn wavy edge painted over the top of a section in the colour of the section above (set with text-*). */
export function WaveEdge({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      fill="currentColor"
      className={cn("pointer-events-none absolute inset-x-0 -top-px z-10 block h-6 w-full sm:h-10", className)}
    >
      <path d="M0 0H1440V20C1390 30 1340 12 1280 22C1210 34 1150 16 1080 24C1000 33 940 12 860 22C790 31 720 14 650 24C570 35 500 14 420 23C350 31 290 13 220 24C150 34 80 14 0 24Z" />
    </svg>
  )
}

/** Red line-art mascot. On white it blends into the page; as a sticker it gets a tile, border and offset shadow. */
export function Mascot({
  media,
  className,
  sticker = false,
  sizes = "(min-width: 1024px) 320px, 200px",
}: {
  media: Media
  className?: string
  sticker?: boolean
  sizes?: string
}) {
  const image = (
    <Image
      src={media.src}
      alt={media.alt}
      width={1024}
      height={1024}
      sizes={sizes}
      className={cn("h-auto w-full", !sticker && "mix-blend-multiply")}
    />
  )
  if (!sticker) return <div className={className}>{image}</div>
  return (
    <div
      className={cn(
        "rounded-[7px] border-2 border-charcoal bg-background p-2 shadow-[6px_6px_0_0_var(--color-charcoal)]",
        className,
      )}
    >
      {image}
    </div>
  )
}
