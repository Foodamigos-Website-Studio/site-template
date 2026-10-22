// The site's header: design it like the inspiration (logo, navigation, the "Order online" link to /menu when the
// online shop module is on). A placeholder until v0 builds it.
import Link from "next/link"

import { getProject } from "@/lib/studio-api"

export async function SiteHeader() {
  const project = await getProject()
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold">
          {project?.name}
        </Link>
      </div>
    </header>
  )
}
