"use client"

import { useEffect } from "react"

const FAILSAFE_MS = 4000

/**
 * Entrance animations (headline, photo fan) start from opacity 0. For automated browsers they are skipped at once,
 * and for everyone else they are switched off after 4 seconds at the latest, so nothing stays hidden if an animation
 * never runs. The attribute only affects the entrance animations, never marquees or the sticker.
 */
export function MotionGuard() {
  useEffect(() => {
    const root = document.documentElement
    if (navigator.webdriver) {
      root.dataset.static = ""
      return
    }
    const timer = setTimeout(() => {
      root.dataset.static = ""
    }, FAILSAFE_MS)
    return () => clearTimeout(timer)
  }, [])

  return null
}
