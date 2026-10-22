"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const FAILSAFE_MS = 4000

/**
 * Scroll reveal that never hides content unless that is safe. The server HTML is always visible; after mount only an
 * element that is entirely below the viewport is hidden (opacity 0, translateY 24px), and it eases in as soon as it
 * enters the viewport. Nothing is hidden for automated browsers (navigator.webdriver), without IntersectionObserver
 * or with reduced motion, and everything still hidden is revealed after 4 seconds if the visitor has not scrolled.
 */
export function Reveal({
  children,
  index = 0,
  className,
  style,
}: {
  children: ReactNode
  index?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (navigator.webdriver || typeof IntersectionObserver === "undefined") return
    if (element.getBoundingClientRect().top < window.innerHeight) return

    element.style.opacity = "0"
    element.style.transform = "translateY(24px)"

    let scrolled = false
    let revealed = false
    let failsafe: ReturnType<typeof setTimeout> | undefined

    const cleanup = () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      if (failsafe) clearTimeout(failsafe)
    }
    const reveal = () => {
      if (revealed) return
      revealed = true
      cleanup()
      element.style.transition = `opacity 700ms ${EASE}, transform 700ms ${EASE}`
      element.style.transitionDelay = `${Math.min(index, 5) * 80}ms`
      element.style.opacity = "1"
      element.style.transform = "none"
    }
    const onScroll = () => {
      scrolled = true
      // The last 5% of the viewport is outside the observer's root, so the page end is checked here.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) reveal()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal()
      },
      { rootMargin: "0px 0px -5% 0px" },
    )
    observer.observe(element)
    window.addEventListener("scroll", onScroll, { passive: true })
    failsafe = setTimeout(() => {
      if (!scrolled) reveal()
    }, FAILSAFE_MS)

    return () => {
      cleanup()
      // A stale hidden state must never survive an unmount/remount cycle.
      if (!revealed) {
        element.style.opacity = ""
        element.style.transform = ""
      }
    }
  }, [index])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
