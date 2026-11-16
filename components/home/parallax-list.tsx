"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

/** Large serif list of locations that drifts slightly against the scroll direction. */
export function ParallaxList({ items, heading }: { items: { href: string; label: string }[]; heading: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      element.style.transform = `translate3d(0, ${Math.max(-1, Math.min(1, progress)) * -48}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="will-change-transform lg:text-right">
      <p className="label text-sm">{heading}</p>
      <ul className="mt-3 flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="display text-5xl hover:opacity-70 sm:text-6xl lg:text-7xl">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
