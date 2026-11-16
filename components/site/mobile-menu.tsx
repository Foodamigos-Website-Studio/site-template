"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import type { NavLink } from "@/lib/nav"

/** Hamburger on the left of the header that opens a full-screen navigation overlay. */
export function NavOverlay({ links, contactHref, orderHref, reserveHref }: { links: NavLink[]; contactHref: string; orderHref: string; reserveHref: string | null }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="site-nav" aria-label="Menü öffnen" className="-ml-2 flex size-10 items-center justify-center hover:opacity-70">
        <Menu className="size-5" aria-hidden="true" />
      </button>
      {open ? (
        <div id="site-nav" role="dialog" aria-modal="true" aria-label="Navigation" className="on-dark fixed inset-0 z-50 flex flex-col bg-ink px-6 py-3">
          <div className="flex h-14 items-center">
            <button type="button" onClick={close} aria-label="Menü schließen" className="-ml-2 flex size-10 items-center justify-center hover:opacity-70">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <ul className="flex flex-1 flex-col items-center justify-center gap-6 text-center sm:gap-8">
            {links.map((link) => (
              <li key={link.href + link.label}>
                <Link href={link.href} onClick={close} className="display-caps text-2xl hover:text-accent sm:text-4xl">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-4 pb-6">
            <div className="flex flex-wrap justify-center gap-3">
              {reserveHref ? (
                <Link href={reserveHref} onClick={close} className="btn" style={{ color: "var(--color-background)" }}>
                  Tisch reservieren
                </Link>
              ) : null}
              <Link href={orderHref} onClick={close} className="btn btn-solid">
                Jetzt bestellen
              </Link>
            </div>
            <Link href={contactHref} onClick={close} className="label hover:text-accent">
              Kontakt
            </Link>
          </div>
        </div>
      ) : null}
    </>
  )
}
