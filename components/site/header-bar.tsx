"use client"

import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { ButtonLink } from "@/components/ui/button-link"
import { Checker, Sparkle } from "@/components/ui/decor"
import { cn } from "@/lib/utils"

type NavLink = { href: string; label: string }

export function HeaderBar({
  name,
  logoUrl,
  links,
  orderHref,
}: {
  name: string
  logoUrl: string | null
  links: NavLink[]
  orderHref: string | null
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const overHero = pathname === "/"

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <header className={cn("z-30 w-full text-background", overHero ? "absolute inset-x-0 top-0" : "relative bg-charcoal")}>
      <div className="mx-auto grid min-h-[96px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 sm:min-h-[140px] sm:px-8 sm:py-6">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Open menu"
            className="inline-flex size-12 items-center justify-center rounded-[999px] border-2 border-charcoal bg-background text-charcoal shadow-[4px_4px_0_0_var(--color-charcoal)] transition-transform duration-[150ms] ease-[ease] hover:-translate-y-[2px]"
          >
            <Menu className="size-6" strokeWidth={3} aria-hidden="true" />
          </button>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center text-center font-heading text-xl uppercase leading-none transition-transform duration-[150ms] ease-[ease] hover:-translate-y-[3px] sm:text-4xl lg:text-5xl"
        >
          {logoUrl ? <Image src={logoUrl} alt={name} width={240} height={96} className="h-12 w-auto sm:h-20 lg:h-24" /> : name}
        </Link>

        <div className="flex justify-end">
          {orderHref ? (
            <>
              <ButtonLink
                href={orderHref}
                size="sm"
                className="h-10 min-h-10 px-4 py-0 text-sm shadow-[3px_3px_0_0_var(--color-charcoal)] sm:hidden"
              >
                Order
              </ButtonLink>
              <ButtonLink href={orderHref} size="md" className="hidden sm:inline-flex">
                Order online
              </ButtonLink>
            </>
          ) : null}
        </div>
      </div>

      {open ? (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="texture-dots-red fixed inset-0 z-50 flex flex-col overflow-y-auto text-background"
        >
          <Checker />
          <div className="flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
            <span className="font-heading text-lg uppercase sm:text-2xl">{name}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-12 items-center justify-center rounded-[999px] border-2 border-charcoal bg-background text-charcoal shadow-[4px_4px_0_0_var(--color-charcoal)] transition-transform duration-[150ms] ease-[ease] hover:-translate-y-[2px]"
            >
              <X className="size-6" strokeWidth={3} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Main" className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10">
            <ul className="flex flex-col items-center gap-4 sm:gap-6">
              {links.map((link) => (
                <li key={link.href} className="flex items-center gap-4">
                  <Sparkle className="hidden size-6 sm:block sm:size-8" />
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-heading text-5xl uppercase leading-none transition-transform duration-[150ms] ease-[ease] hover:-translate-y-1 sm:text-7xl"
                  >
                    {link.label}
                  </Link>
                  <Sparkle className="hidden size-6 sm:block sm:size-8" />
                </li>
              ))}
            </ul>
            {orderHref ? (
              <ButtonLink href={orderHref} variant="charcoal" className="mt-4">
                Order online
              </ButtonLink>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
