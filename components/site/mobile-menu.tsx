"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import type { NavLink } from "@/lib/nav"

export function MobileMenu({ links, reserve, orderHref }: { links: NavLink[]; reserve: NavLink | null; orderHref: string }) {
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
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu" className="label flex items-center gap-2 py-2 text-sm">
        <Menu className="size-5" aria-hidden="true" />
        <span>Menü</span>
      </button>
      {open ? (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation" className="tone-dark fixed inset-0 z-50 flex flex-col bg-ink px-6 py-5">
          <div className="flex justify-end">
            <button type="button" onClick={close} aria-label="Menü schließen" className="p-2">
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>
          <ul className="mt-6 flex flex-1 flex-col gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={close} className="display text-4xl hover:opacity-70">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pb-4">
            {reserve ? (
              <Link href={reserve.href} onClick={close} className="btn">
                {reserve.label}
              </Link>
            ) : null}
            <Link href={orderHref} onClick={close} className="btn btn-solid">
              Jetzt bestellen
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
