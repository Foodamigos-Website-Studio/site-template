// The home page: v0 designs it from the brief (a placeholder until then).
import type { Metadata } from "next"

import { pageMetadata } from "@/lib/seo"
import { getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Restaurant"
  return pageMetadata({ title: name, description: project?.tagline ?? name, path: "/" })
}

export default async function Home() {
  const project = await getProject()
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="text-4xl font-semibold">{project?.name}</h1>
      {project?.tagline ? <p className="mt-4 text-lg">{project.tagline}</p> : null}
    </section>
  )
}
