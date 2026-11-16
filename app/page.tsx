import type { Metadata } from "next"

import { Dessert } from "@/components/home/dessert"
import { DishSlider } from "@/components/home/dish-slider"
import { Editorial } from "@/components/home/editorial"
import { EntryCards } from "@/components/home/entry-cards"
import { FeatureSection } from "@/components/home/feature-section"
import { GiftTeaser } from "@/components/home/gift-teaser"
import { Hero } from "@/components/home/hero"
import { LocationBand } from "@/components/home/location-band"
import { Reviews } from "@/components/home/reviews"
import { PHOTOS } from "@/lib/media"
import { reservationLink, sitePaths } from "@/lib/nav"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getMenu, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  return pageMetadata({
    title: `${name} – italienisches Restaurant in Berlin`,
    description: `${name}: hausgemachte Pasta, Holzofenpizza, vegetarische, vegane und glutenfreie Gerichte in Berlin Mitte und Kreuzberg. Reserviere deinen Tisch.`,
    path: "/",
  })
}

export default async function Home() {
  const [project, companies, menu] = await Promise.all([getProject(), getCompanies(), getMenu()])
  const paths = sitePaths()
  const reserve = reservationLink(project)

  return (
    <>
      <Hero project={project} />
      <Editorial project={project} />
      <EntryCards project={project} />

      <FeatureSection
        section={4}
        large
        eyebrow="Hausgemachte Pasta"
        heading="Frische Pasta, Pizza aus dem Holzofen und alles, was dazugehört"
        actions={[{ href: paths.menu, label: "Speisekarte ansehen" }, ...(reserve ? [reserve] : [])]}
        big={{ photo: PHOTOS.pasta, caption: "Frische Pasta, von Hand gemacht" }}
        small={[
          { photo: PHOTOS.pizza, caption: "Pizza und Pasta aus unserer Küche" },
          { photo: PHOTOS.dish, caption: "Frisch zubereitet, jeden Tag" },
        ]}
      >
        <p>Bei uns bekommst du italienische Hausmannskost, wie sie sein soll: frische Pasta, jeden Tag von Hand gemacht, dazu Pizza aus dem Holzofen und eine Karte, die Platz für alle hat.</p>
        <p>
          <strong>Glutenfreie Pasta</strong> gibt es selbstverständlich auch, und wer vegetarisch oder vegan isst, findet auf der Speisekarte viele Gerichte, die richtig satt und glücklich machen. Mittags erwartet dich außerdem ein fair kalkuliertes Mittagsmenü.
        </p>
        <p>Dazu schenken wir italienische Weine aus und beenden den Abend am liebsten mit einem Tiramisù.</p>
      </FeatureSection>

      <LocationBand project={project} companies={companies ?? []} />

      <FeatureSection
        section={6}
        from="left"
        eyebrow="Familienbrunch am Sonntag"
        heading="Sonntags decken wir für die ganze Familie"
        actions={[...(reserve ? [{ href: reserve.href, label: "Tisch reservieren" }] : []), { href: paths.menu, label: "Zur Speisekarte" }]}
        big={{ photo: PHOTOS.kitchen, caption: "Italienische Küche für Groß und Klein" }}
        small={[
          { photo: PHOTOS.room, caption: "Viel Platz für lange Sonntage" },
          { photo: PHOTOS.view, caption: "Bei uns sitzt du gemütlich" },
        ]}
      >
        <p>
          <strong>Jeden Sonntag laden wir zum Familienbrunch ein.</strong> Komm mit Kindern, Eltern und Freunden vorbei und lass dir in Ruhe schmecken, was unsere Küche für den Tisch bereithält.
        </p>
        <p>Am liebsten reservierst du vorab, damit für alle ein Platz bereitsteht. Wir freuen uns auf dich.</p>
      </FeatureSection>

      <Dessert />
      <DishSlider menu={menu} />
      <GiftTeaser project={project} />
      <Reviews companies={companies ?? []} />
    </>
  )
}
