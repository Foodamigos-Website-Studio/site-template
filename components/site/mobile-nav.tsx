"use client"

import Link from "next/link"
import { Menu, Phone, X } from "lucide-react"
import { useEffect, useState } from "react"

import type { OpenStatus } from "@/lib/open-status"
import { telHref } from "@/lib/routes"

import { CtaLink } from "./cta"
import { StatusPill } from "./status-pill"

type NavLink = { href: string; label: string }

export function MobileNav({
  links,
  phone,
  status,
  orderHref,
}: {
  links: NavLink[]
  phone: string | null
  status: OpenStatus | null
  orderHref: string | null
}) {
  const [open, setOpen] = useState(false)

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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menü öffnen"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex size-11 items-center justify-center rounded border-2 border-secondary text-secondary transition-colors duration-[150ms] ease-in-out hover:bg-secondary hover:text-primary"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      {open ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-hero-background"
        >
          <div className="container-x flex h-20 shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Menü schließen"
              className="flex size-11 items-center justify-center rounded border-2 border-secondary text-secondary transition-colors duration-[150ms] ease-in-out hover:bg-secondary hover:text-primary"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile Navigation" className="container-x flex flex-1 flex-col gap-2 pb-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={link.href !== "/menu"}
                onClick={() => setOpen(false)}
                className="display-heading py-1 text-6xl text-secondary transition-colors duration-[150ms] ease-in-out hover:text-background"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col items-start gap-4">
              {status ? <StatusPill status={status} /> : null}
              {phone ? (
                <a href={telHref(phone)} className="flex items-center gap-2 font-heading text-3xl text-secondary">
                  <Phone className="size-6" aria-hidden="true" />
                  {phone}
                </a>
              ) : null}
              {orderHref ? (
                <CtaLink href={orderHref} size="lg">
                  Jetzt bestellen
                </CtaLink>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}
