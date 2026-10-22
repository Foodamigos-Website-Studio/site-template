import type { Metadata } from "next"

import { Dietary } from "@/components/home/dietary"
import { Gallery } from "@/components/home/gallery"
import { Hero } from "@/components/home/hero"
import { Intro } from "@/components/home/intro"
import { LocationsSection } from "@/components/home/locations-section"
import { OrderSection } from "@/components/home/order-section"
import { PhotoStrip } from "@/components/home/photo-strip"
import { Reviews } from "@/components/home/reviews"
import { ShopCards } from "@/components/home/shop-cards"
import { WhatsHot } from "@/components/home/whats-hot"
import { onlineShopOn } from "@/lib/modules"
import { featuredProducts, googleRating, latestReviews, ORDER_PATH, primaryCompany, primaryFirst } from "@/lib/restaurant"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getMenu, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const name = project?.name ?? "Burger shop"
  const city = primaryCompany(project, companies)?.city
  return pageMetadata({
    title: `${name} – Smash burgers${city ? ` in ${city}` : ""}`,
    description: `Fresh smash burgers, crispy chicken, loaded fries and shakes${city ? ` in ${city}` : ""}. Vegetarian, vegan, halal and gluten-free options. Order online for pickup or delivery.`,
    path: "/",
  })
}

export default async function Home() {
  const [project, companies, menu] = await Promise.all([getProject(), getCompanies(), getMenu()])
  const orderOn = onlineShopOn(project)
  const primary = primaryCompany(project, companies)
  const locations = primaryFirst(project, companies)

  return (
    <>
      <Hero name={project?.name ?? ""} city={primary?.city ?? null} orderOn={orderOn} />
      <Intro about={project?.about ?? null} orderOn={orderOn} />
      <ShopCards href={orderOn ? ORDER_PATH : "/our-menu"} />
      {locations.length ? <OrderSection companies={locations} orderOn={orderOn} /> : null}
      <PhotoStrip orderOn={orderOn} />
      <WhatsHot products={featuredProducts(menu)} orderOn={orderOn} />
      <Dietary options={project?.dietary_attributes ?? []} />
      {locations.length ? <LocationsSection companies={locations} orderOn={orderOn} /> : null}
      <Reviews reviews={latestReviews(companies)} rating={googleRating(companies)} />
      <Gallery orderOn={orderOn} />
    </>
  )
}
