// The home page: v0 designs it from the brief (a placeholder until then). Keep <SiteFaq />: the FAQ Max writes, with
// "What are you known for?" linking the dish pages; pass the home's own questions to it as extraItems.
import type { Metadata } from "next"

import { SiteFaq } from "@/components/seo/site-faq"
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
    <>
      <section>
        <h1>{project?.name}</h1>
        {project?.tagline ? <p>{project.tagline}</p> : null}
      </section>
      <SiteFaq />
    </>
  )
}
