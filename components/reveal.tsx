"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)"

/**
 * Scroll reveal: server-rendered HTML stays visible. After mount, an element whose top is below 59% of the viewport is
 * hidden; when its top reaches that line it fades in once (index x 383 ms stagger). `from="left"` slides in from the left.
 */
export function Reveal({
  children,
  index = 0,
  from = "below",
  className,
  style,
}: {
  children: ReactNode
  index?: number
  from?: "below" | "left"
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (element.getBoundingClientRect().top < window.innerHeight * 0.59) return

    const duration = from === "left" ? 500 : 1000
    element.style.opacity = "0"
    element.style.transform = from === "left" ? "translateX(-32px)" : "translateY(24px)"

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        element.style.transition = `opacity ${duration}ms ${EASE} ${index * 383}ms, transform ${duration}ms ${EASE} ${index * 383}ms`
        element.style.opacity = "1"
        element.style.transform = "none"
        observer.unobserve(element)
      },
      { rootMargin: "0px 0px -41% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [from, index])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
