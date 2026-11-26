import Link from "next/link"

import { SITE_LANGUAGE } from "@/lib/config"
import { localizedPath } from "@/lib/localized-routes"

export function ReservationTab() {
  return (
    <Link
      href={localizedPath("reservations", SITE_LANGUAGE)}
      className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center justify-center rounded-l bg-primary px-3 py-6 text-xs font-medium uppercase tracking-[0.3em] text-secondary transition-colors duration-200 [writing-mode:vertical-rl] hover:bg-secondary hover:text-paper md:px-4 md:py-8"
    >
      Reservieren
    </Link>
  )
}
