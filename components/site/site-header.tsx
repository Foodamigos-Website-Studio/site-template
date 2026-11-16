import Link from "next/link"

import { mainNav, reservationLink, sitePaths } from "@/lib/nav"
import { getProject } from "@/lib/studio-api"

import { NavOverlay } from "./mobile-menu"

export async function SiteHeader() {
  const project = await getProject()
  const nav = mainNav(project)
  const reserve = reservationLink(project)
  const paths = sitePaths()
  const name = project?.name ?? ""

  return (
    <>
      <header className="on-dark sticky top-0 z-40 bg-ink">
        <div className="mx-auto grid h-14 w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center">
            <NavOverlay links={nav} contactHref={paths.contact} orderHref={paths.order} reserveHref={reserve?.href ?? null} />
          </div>

          <Link href="/" className="display-caps text-center text-sm hover:opacity-80 sm:text-base" aria-label={`${name} – Startseite`}>
            {name}
          </Link>

          <div className="flex items-center justify-end gap-3">
            {reserve ? (
              <Link href={reserve.href} className="btn btn-sm hidden lg:inline-flex" style={{ color: "var(--color-background)" }}>
                {reserve.label}
              </Link>
            ) : null}
            <Link href={paths.order} className="btn btn-sm btn-solid hidden md:inline-flex">
              Jetzt bestellen
            </Link>
          </div>
        </div>
      </header>

      <div className="on-dark fixed inset-x-0 bottom-0 z-40 bg-ink p-2.5 md:hidden">
        <Link href={paths.order} className="btn btn-solid w-full">
          Jetzt bestellen
        </Link>
      </div>
    </>
  )
}
