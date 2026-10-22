import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const VARIANTS = {
  red: "border-charcoal bg-primary text-background shadow-[0_4px_0_0_var(--color-charcoal)]",
  charcoal: "border-charcoal bg-charcoal text-background shadow-[0_4px_0_0_var(--color-charcoal)]",
  light: "border-charcoal bg-background text-charcoal shadow-[0_4px_0_0_var(--color-charcoal)]",
  outline: "border-background bg-transparent text-background",
} as const

const SIZES = {
  lg: "px-6 py-4 text-base sm:px-[30px] sm:py-5 sm:text-[22px]",
  md: "px-5 py-3 text-base",
  sm: "px-4 py-2 text-sm",
} as const

export type ButtonVariant = keyof typeof VARIANTS

export function buttonClasses(variant: ButtonVariant = "red", size: keyof typeof SIZES = "lg", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[7px] border-2 text-center font-heading uppercase leading-none tracking-wide",
    "transition-transform duration-[150ms] ease-[ease] hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    VARIANTS[variant],
    SIZES[size],
    className,
  )
}

/** The shop (/menu is the embedded online shop) and external links need a full navigation, not a client transition. */
const isPlainLink = (href: string) => href === "/menu" || href.startsWith("/menu/") || /^(https?:|tel:|mailto:)/.test(href)

export function ButtonLink({
  href,
  variant = "red",
  size = "lg",
  className,
  children,
  external,
}: {
  href: string
  variant?: ButtonVariant
  size?: keyof typeof SIZES
  className?: string
  children: ReactNode
  external?: boolean
}) {
  const classes = buttonClasses(variant, size, className)
  if (isPlainLink(href)) {
    return (
      <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
