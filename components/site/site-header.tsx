// The site's header: design it like the inspiration (logo, navigation, the "Order online" link to /menu when the
// online shop module is on). A placeholder until v0 builds it.
import Link from "next/link"

import { getProject } from "@/lib/studio-api"

export async function SiteHeader() {
  const project = await getProject()
  return (
    <header>
      <div>
        <Link href="/">
          {project?.name}
        </Link>
      </div>
    </header>
  )
}
