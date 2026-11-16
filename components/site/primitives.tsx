import Image from "next/image"
import type { ReactNode } from "react"

import type { Photo } from "@/lib/media"

/** A framed photo with a small caption ("OBEN: …" or a rotated side caption). */
export function FramedPhoto({
  photo,
  caption,
  captionLabel = "Oben",
  ratio = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 640px, 100vw",
  priority,
  side,
}: {
  photo: Photo
  caption?: string
  captionLabel?: string
  ratio?: string
  sizes?: string
  priority?: boolean
  side?: "left" | "right"
}) {
  const figure = (
    <figure className="min-w-0 flex-1">
      <div className={`frame ${ratio}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      {caption && !side ? (
        <figcaption className="caption">
          <strong className="uppercase">{captionLabel}:</strong> {caption}
        </figcaption>
      ) : null}
    </figure>
  )
  if (!side || !caption) return figure
  const sideCaption = (
    <p className="caption text-sm [writing-mode:vertical-rl] rotate-180 self-end m-0">
      <strong className="uppercase">{captionLabel}:</strong> {caption}
    </p>
  )
  return (
    <div className="flex gap-2">
      {side === "left" ? sideCaption : null}
      {figure}
      {side === "right" ? sideCaption : null}
    </div>
  )
}

export function Diamonds() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-1">
      {Array.from({ length: 11 }).map((_, index) => (
        <span key={index} className="block size-1.5 rotate-45 bg-text-primary" />
      ))}
    </div>
  )
}

export function SectionShell({
  section,
  className = "",
  children,
  label,
}: {
  section: number
  className?: string
  children: ReactNode
  label?: string
}) {
  return (
    <section data-section={section} aria-label={label} className={className}>
      {children}
    </section>
  )
}
