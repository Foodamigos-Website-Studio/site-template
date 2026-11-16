import Link from "next/link"

import { mainNav, reservationLink, sitePaths } from "@/lib/nav"
import { getProject } from "@/lib/studio-api"

import { HeaderFrame } from "./header-frame"
import { MobileMenu } from "./mobile-menu"

export async function SiteHeader() {
  const project = await getProject()
  const nav = mainNav(project)
  const reserve = reservationLink(project)
  const paths = sitePaths()
  const name = project?.name ?? ""

  return (
    <>
      <HeaderFrame>
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 lg:px-10">
          <nav aria-label="Hauptnavigation" className="flex items-center">
            <MobileMenu links={nav} reserve={reserve} orderHref={paths.order} />
            <ul className="hidden items-center gap-7 lg:flex">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="label text-sm hover:opacity-70">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="display-caps text-center text-xl tracking-[0.28em] hover:opacity-80 md:text-2xl" aria-label={`${name} – Startseite`}>
            {name}
          </Link>

          <div className="flex items-center justify-end gap-3">
            {reserve ? (
              <Link href={reserve.href} className="btn btn-pill hidden lg:inline-flex">
                {reserve.label}
              </Link>
            ) : null}
            <Link href={paths.order} className="btn btn-pill btn-solid hidden md:inline-flex">
              Jetzt bestellen
            </Link>
          </div>
        </div>
      </HeaderFrame>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-text-primary/30 bg-background p-2.5 md:hidden">
        <Link href={paths.order} className="btn btn-solid w-full">
          Jetzt bestellen
        </Link>
      </div>
    </>
  )
}
