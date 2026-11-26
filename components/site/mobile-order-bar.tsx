import Link from "next/link"

import { onlineShopOn } from "@/lib/modules"
import { getProject } from "@/lib/studio-api"

export async function MobileOrderBar() {
  const project = await getProject()
  if (!onlineShopOn(project)) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex h-[var(--order-bar-height)] items-center bg-secondary px-4 md:hidden">
      <Link href="/menu" className="btn w-full">
        Jetzt bestellen
      </Link>
    </div>
  )
}
