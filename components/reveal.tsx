"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

/**
 * Scroll reveal: the server HTML is visible; after mount an element below 15% of the viewport is hidden
 * (opacity 0, translateY 24px) and eases in once its top reaches 15% of the viewport height.
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
    if (element.getBoundingClientRect().top <= window.innerHeight * 0.15) return

    element.style.opacity = "0"
    element.style.transform = "translateY(24px)"

    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      observer.disconnect()
      window.removeEventListener("scroll", check)
      element.style.transition = `opacity 700ms ${EASE}, transform 700ms ${EASE}`
      element.style.transitionDelay = `${Math.min(index, 5) * 80}ms`
      element.style.opacity = "1"
      element.style.transform = "none"
    }
    const check = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.15 || atBottom) reveal()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal()
      },
      { rootMargin: "0px 0px -85% 0px" },
    )
    observer.observe(element)
    // Fast scrolls can jump over the 15% band, and the page end may never reach it: check on scroll as well.
    window.addEventListener("scroll", check, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", check)
    }
  }, [index])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
