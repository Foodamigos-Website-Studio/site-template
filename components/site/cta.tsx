import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const VARIANTS = {
  primary: "border-secondary bg-primary text-secondary hover:bg-secondary hover:text-primary",
  dark: "border-secondary bg-secondary text-primary hover:bg-primary hover:text-secondary",
  onDark: "border-primary bg-primary text-secondary hover:border-background hover:bg-background hover:text-secondary",
  outline: "border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-primary",
} as const

const SIZES = {
  sm: "px-4 py-2 text-lg",
  md: "px-6 py-3 text-2xl",
  lg: "px-8 py-4 text-3xl",
} as const

export function ctaClass(variant: keyof typeof VARIANTS = "primary", size: keyof typeof SIZES = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded border-2 font-heading uppercase leading-none tracking-wide transition-colors duration-[150ms] ease-in-out",
    VARIANTS[variant],
    SIZES[size],
    className,
  )
}

/** A link styled as the site's yellow button. /menu is the online shop (rewritten by proxy.ts), so it is a plain anchor. */
export function CtaLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  href: string
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  className?: string
  children: ReactNode
  "aria-label"?: string
}) {
  const classes = ctaClass(variant, size, className)
  if (href.startsWith("/menu") || href.startsWith("http") || href.startsWith("tel:")) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  )
}
