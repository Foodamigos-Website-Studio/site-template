import type { Metadata } from "next"
import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { CtaLink } from "@/components/site/cta"
import { Marquee } from "@/components/site/marquee"
import { MEDIA } from "@/lib/media"
import { onlineShopOn } from "@/lib/modules"
import { cityOf, dietPhrase, seoDescription, seoTitle } from "@/lib/page-text"
import { ROUTES } from "@/lib/routes"
import { pageMetadata } from "@/lib/seo"
import { getCompanies, getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  return pageMetadata({
    title: seoTitle(project, companies, "Über uns"),
    description: seoDescription(project, companies, "Smash Burger, hausgemachte Saucen, frische Zubereitung und ein freundliches Team"),
    path: ROUTES.about,
  })
}

const PILLARS = [
  { title: "Smash Burger", text: "Das Patty wird auf dem heißen Grill flachgedrückt, bis es außen knusprig und innen saftig ist." },
  { title: "Hausgemachte Saucen", text: "Unsere Saucen rühren wir selbst an: vom Burger-Special bis zum Cheddar-Dip." },
  { title: "Frisch zubereitet", text: "Salat, Tomaten, Zwiebeln und Gurken landen frisch auf deinem Burger, nicht auf Vorrat." },
  { title: "Freundliches Team", text: "Schnell, locker und herzlich: bei uns bist du Gast, nicht Bestellnummer." },
]

export default async function UeberUnsPage() {
  const [project, companies] = await Promise.all([getProject(), getCompanies()])
  const city = cityOf(project, companies)
  const diets = dietPhrase(project)
  const shopOn = onlineShopOn(project)

  return (
    <>
      <section className="overflow-hidden bg-hero-background pb-20 pt-8 md:pb-28">
        <div className="container-x grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="display-heading hero-in text-[clamp(3.5rem,12vw,10rem)] text-background">Über uns</h1>
            <p className="hero-in mt-4 max-w-xl text-lg leading-relaxed text-secondary" style={{ ["--i" as string]: 1 }}>
              {project?.about ??
                `Frische Smash Burger mit hausgemachten Saucen${city ? ` in ${city}` : ""}: zum Mitnehmen, Liefern oder direkt vor Ort.`}
            </p>
          </div>
          <div className="hero-in relative mx-auto w-full max-w-md rotate-3" style={{ ["--i" as string]: 2 }}>
            <div className="overflow-hidden rounded border-4 border-background shadow-[0_24px_40px_-18px_rgb(7_92_64_/_0.55)]">
              <Image
                src={MEDIA.hero.src}
                alt={MEDIA.hero.alt}
                width={MEDIA.hero.width}
                height={MEDIA.hero.height}
                sizes="(min-width: 768px) 448px, 90vw"
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container-x flex flex-col gap-14">
          <Reveal>
            <h2 className="display-heading max-w-4xl text-[clamp(3rem,8vw,7rem)] text-secondary">
              Burger, die man nicht erklären muss
            </h2>
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar, index) => (
              <li key={pillar.title} className="flex">
                <Reveal index={index} className="flex w-full">
                  <article
                    className={`flex w-full flex-col gap-3 rounded border-2 border-secondary p-6 transition-colors duration-[150ms] ease-in-out hover:bg-primary ${index % 2 === 0 ? "bg-background" : "bg-hero-background/30"}`}
                  >
                    <h3 className="font-heading text-4xl uppercase leading-none text-secondary">{pillar.title}</h3>
                    <p className="leading-relaxed">{pillar.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden bg-background pb-20 md:pb-28">
        <div className="container-x grid items-center gap-12 md:grid-cols-2">
          <Reveal className="relative mx-auto w-full max-w-lg">
            <div className="-rotate-2 overflow-hidden rounded border-4 border-secondary shadow-[12px_12px_0_0_var(--color-primary)]">
              <Image
                src={MEDIA.ingredients.src}
                alt={MEDIA.ingredients.alt}
                width={MEDIA.ingredients.width}
                height={MEDIA.ingredients.height}
                sizes="(min-width: 768px) 512px, 90vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
          <div className="flex flex-col items-start gap-5">
            <Reveal>
              <h2 className="display-heading text-[clamp(3rem,7vw,6rem)] text-secondary">Unsere Geschichte</h2>
            </Reveal>
            <Reveal index={1}>
              <p className="text-lg leading-relaxed">
                N Test burger shop gibt es in Gütersloh in der Kaiserstraße 15, ein zweiter Standort, Golt&apos;z Burger, steht in
                Berlin-Lichtenrade. Inhaberin Nishita Gupta setzt auf ein einfaches Konzept: ein lockerer Burger-Laden, in dem alles
                frisch zubereitet wird und das Bestellen online schnell geht.
              </p>
            </Reveal>
            <Reveal index={2}>
              <p className="text-lg leading-relaxed">
                Neben Smash Burgern und Double Cheese Burgern findest du bei uns knuspriges Chicken, French Tacos, Bowls,
                Hot Cheese Fries und Oreo-Milchshakes
                {diets ? ` – natürlich auch ${diets}` : ""}. Zu Stoßzeiten kann es voll werden, aber das Warten lohnt sich.
              </p>
            </Reveal>
            {shopOn ? (
              <Reveal index={3}>
                <CtaLink href={ROUTES.shop} size="lg">
                  Jetzt bestellen
                </CtaLink>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-hero-background py-10">
        <div className="-mx-[5%] -rotate-2 bg-secondary py-2">
          <Marquee text="Zeit für deinen Burger!" className="text-[clamp(3.5rem,9vw,8rem)] text-primary" />
        </div>
      </div>
    </>
  )
}
