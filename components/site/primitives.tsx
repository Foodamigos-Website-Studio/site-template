import Image from "next/image"

import type { Photo } from "@/lib/media"

/** A photo with a slow hover zoom and an optional small uppercase caption plus short text below. */
export function PhotoFigure({
  photo,
  ratio = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  title,
  children,
  className = "",
}: {
  photo: Photo
  ratio?: string
  sizes?: string
  priority?: boolean
  title?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <figure className={className}>
      <div className={`img-zoom relative w-full rounded-[4px] ${ratio}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      {title || children ? (
        <figcaption className="mt-6 max-w-sm">
          {title ? <span className="label block text-accent">{title}</span> : null}
          {children ? <p className="mt-3 leading-relaxed">{children}</p> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
