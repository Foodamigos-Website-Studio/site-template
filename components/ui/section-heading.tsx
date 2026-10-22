import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Sparkle } from "./decor"

const SIZES = {
  md: "text-4xl sm:text-5xl lg:text-6xl",
  lg: "text-4xl sm:text-6xl lg:text-[80px]",
  xl: "text-5xl sm:text-7xl lg:text-[120px]",
} as const

/** Huge chunky uppercase heading flanked by sparkle stars; colour comes from the surrounding text colour. */
export function SectionHeading({
  as: Tag = "h2",
  size = "lg",
  children,
  className,
  sparkleClassName,
}: {
  as?: "h1" | "h2"
  size?: keyof typeof SIZES
  children: ReactNode
  className?: string
  sparkleClassName?: string
}) {
  return (
    <div className={cn("flex items-center justify-center gap-3 sm:gap-8", className)}>
      <Sparkle className={cn("size-6 shrink-0 sm:size-10", sparkleClassName)} />
      <Tag className={cn("text-balance text-center font-heading uppercase leading-[0.92]", SIZES[size])}>{children}</Tag>
      <Sparkle className={cn("size-6 shrink-0 sm:size-10", sparkleClassName)} />
    </div>
  )
}
