"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type Direction = "up" | "left" | "right"

const HIDDEN: Record<Direction, string> = {
  up: "translateY(24px)",
  left: "translateX(-96px)",
  right: "translateX(96px)",
}

/**
 * Scroll reveal: server-rendered HTML stays visible; once mounted, an element below 45% of the viewport is pushed
 * down (or sideways for the mascots) and slides to its place when its top reaches 45% of the viewport, once.
 * Content is never fully transparent, so screenshots, crawlers and print always show it.
 */
export function Reveal({
  children,
  index = 0,
  direction = "up",
  className,
}: {
  children: ReactNode
  index?: number
  direction?: Direction
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (element.getBoundingClientRect().top <= window.innerHeight * 0.45) return

    setHidden(true)
    const show = () => {
      setHidden(false)
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
    // A jump past the element (anchor, fast scroll) never intersects, so the scroll check reveals it too.
    const onScroll = () => {
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.45) show()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) show()
      },
      { rootMargin: "0px 0px -55% 0px" },
    )
    observer.observe(element)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: hidden ? HIDDEN[direction] : "none",
        opacity: hidden && direction === "up" ? 0.85 : 1,
        transition: hidden
          ? "none"
          : direction === "up"
            ? `opacity 330ms ease-out ${index * 100}ms, transform 330ms ease-out ${index * 100}ms`
            : `transform 1070ms ease-out ${index * 100}ms`,
      }}
    >
      {children}
    </div>
  )
}
