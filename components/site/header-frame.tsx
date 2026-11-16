"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/** Transparent over the dark intro on the home page, cream with a hairline everywhere else. */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const home = usePathname() === "/"
  return (
    <header
      className={
        home
          ? "tone-dark absolute inset-x-0 top-0 z-30 bg-transparent"
          : "relative z-30 border-b border-text-primary/20 bg-background"
      }
    >
      {children}
    </header>
  )
}
