import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { Checker } from "@/components/ui/decor"
import { PHOTO, type Media } from "@/lib/media"

const PHOTOS: Media[] = [PHOTO.chilli, PHOTO.bbq, PHOTO.gordo, PHOTO.hero]

export function PhotoStrip() {
  return (
    <section className="overflow-hidden bg-charcoal">
      <Checker />
      <ul className="grid grid-cols-2 md:grid-cols-4">
        {PHOTOS.map((photo, index) => (
          <li key={photo.src}>
            <Reveal index={index}>
              <div className="relative aspect-[4/3]">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <Checker />
    </section>
  )
}
