import type { Metadata } from "next"

import { BlueBand } from "@/components/home/blue-band"
import { DietaryStrip } from "@/components/home/dietary-strip"
import { GuestCards } from "@/components/home/guest-cards"
import { Hero } from "@/components/home/hero"
import { LocationsBlock } from "@/components/home/locations-block"
import { Reviews } from "@/components/home/reviews"
import { Showcase } from "@/components/home/showcase"
import { Statement } from "@/components/home/statement"
import { onlineShopOn } from "@/lib/modules"
import { cityOf, seoDescription, seoTitle } from "@/lib/page-text"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  return pageMetadata({
    title: seoTitle(project, companies, "Smash Burger"),
    description: seoDescription(project, companies, "frische Smash Burger, hausgemachte Saucen, knuspriges Chicken und Shakes. Online bestellen"),
    path: "/",
  })
}

export default async function Home() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const city = cityOf(project, companies)
  const shopOn = onlineShopOn(project)
  return (
    <>
      <Hero name={project?.name ?? ""} city={city} shopOn={shopOn} />
      <GuestCards city={city} />
      <Showcase city={city} shopOn={shopOn} />
      <Statement />
      <DietaryStrip project={project} />
      <BlueBand />
      <Reviews companies={companies ?? []} />
      <LocationsBlock companies={companies ?? []} shopOn={shopOn} />
    </>
  )
}
