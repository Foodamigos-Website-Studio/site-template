import type { Metadata } from "next"

import { Hero } from "@/components/home/hero"
import { ImageDuo } from "@/components/home/image-duo"
import { Locations } from "@/components/home/locations"
import { Reviews } from "@/components/home/reviews"
import { Statement } from "@/components/home/statement"
import { WinePanel } from "@/components/home/wine-panel"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  return pageMetadata({
    title: `${name} – italienisches Restaurant in Berlin`,
    description: `${name}: hausgemachte Pasta, Holzofenpizza und italienische Weine in Berlin. Reserviere deinen Tisch.`,
    path: "/",
  })
}

export default async function Home() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const locations = companies ?? []

  return (
    <main>
      <Hero project={project} />
      <Statement />
      <ImageDuo />
      <WinePanel project={project} />
      <Locations project={project} companies={locations} />
      <Reviews companies={locations} />
    </main>
  )
}
