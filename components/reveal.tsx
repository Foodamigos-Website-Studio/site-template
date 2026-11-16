"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

const EASE = "ease-out"
const DURATION = 700

/**
 * Scroll reveal: server-rendered HTML stays visible. After mount, an element below the fold is hidden; when it
 * scrolls into view it fades up once (700 ms, ease-out, index x 120 ms stagger).
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
    if (element.getBoundingClientRect().top < window.innerHeight * 0.85) return

    element.style.opacity = "0"
    element.style.transform = "translateY(24px)"

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        element.style.transition = `opacity ${DURATION}ms ${EASE} ${index * 120}ms, transform ${DURATION}ms ${EASE} ${index * 120}ms`
        element.style.opacity = "1"
        element.style.transform = "none"
        observer.unobserve(element)
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [index])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
