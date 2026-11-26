"use client"

import { X } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

export type MenuLink = { href: string; label: string }

export function HeaderMenu({ links, name }: { links: MenuLink[]; name: string }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menü öffnen"
        aria-expanded={open}
        aria-controls="site-menu"
        className="group -ml-2 flex size-11 flex-col items-center justify-center gap-[5px]"
      >
        <span className="h-px w-6 bg-paper transition-all duration-200 group-hover:w-5" />
        <span className="h-px w-6 bg-paper" />
        <span className="h-px w-6 bg-paper transition-all duration-200 group-hover:w-5" />
      </button>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Hauptmenü"
        hidden={!open}
        className="fixed inset-0 z-[60] flex flex-col bg-secondary text-paper"
      >
        <div className="flex h-[var(--header-height)] items-center px-4 md:px-8">
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Menü schließen"
            className="-ml-2 flex size-11 items-center justify-center text-paper transition-colors duration-200 hover:text-primary"
          >
            <X className="size-6" strokeWidth={1.25} />
          </button>
        </div>
        <nav aria-label="Hauptnavigation" className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-16">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="eyebrow text-balance text-center text-2xl text-paper transition-colors duration-200 hover:text-primary md:text-4xl"
            >
              {link.label}
            </Link>
          ))}
          <p className="eyebrow mt-8 text-xs text-primary">{name}</p>
        </nav>
      </div>
    </>
  )
}
