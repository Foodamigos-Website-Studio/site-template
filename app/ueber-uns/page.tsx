import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { PageIntro } from "@/components/site/page-intro"
import { FramedPhoto } from "@/components/site/primitives"
import { PHOTOS } from "@/lib/media"
import { ABOUT_PATH, reservationLink, sitePaths } from "@/lib/nav"
import { pageMetadata } from "@/lib/seo"
import { getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  return pageMetadata({
    title: `${name} – Über uns, italienisches Restaurant in Berlin`,
    description: `Lerne die Familie hinter der ${name} kennen: hausgemachte Pasta, Holzofenpizza sowie vegetarische, vegane und glutenfreie Gerichte in Berlin Mitte und Kreuzberg.`,
    path: ABOUT_PATH,
  })
}

const VALUES = [
  { title: "Von Hand gemacht", text: "Unsere Pasta entsteht frisch in der Küche, so wie sie in einer italienischen Familie auf den Tisch kommt." },
  { title: "Platz für alle", text: "Vegetarisch, vegan oder glutenfrei: Bei uns findest du Gerichte, die dich satt und glücklich machen." },
  { title: "Herzlich und schnell", text: "Wir sind lebendig, warm und flott im Service – zum Mittagsmenü genauso wie am vollen Freitagabend." },
]

export default async function AboutPage() {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  const paths = sitePaths()
  const reserve = reservationLink(project)

  return (
    <main className="pb-24">
      <PageIntro kicker="Eine Familie, zwei Standorte, ein Tisch" title="Über uns" />

      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="max-w-[30rem]">
            <span className="eyebrow">Unsere Geschichte</span>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Italienisch kochen, wie zu Hause</h2>
            <div className="justify mt-6 flex flex-col gap-5 text-lg leading-relaxed">
              <p>{project?.about ?? `${name} ist eine familiengeführte Trattoria in Berlin.`}</p>
              <p>Bei uns steht frische, hausgemachte Pasta im Mittelpunkt. Dazu kommen Pizza aus dem Holzofen, italienische Weine und ein Tiramisù, das du so schnell nicht vergisst.</p>
            </div>
          </div>
        </Reveal>
        <Reveal index={1}>
          <FramedPhoto photo={PHOTOS.room} caption="Unser Gastraum" ratio="aspect-[4/3]" />
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-[1180px] px-5 sm:px-8">
        <Reveal>
          <h2 className="display-caps text-center text-2xl sm:text-3xl">Das ist uns wichtig</h2>
        </Reveal>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {VALUES.map((value, index) => (
            <li key={value.title}>
              <Reveal index={index}>
                <div className="card-label !text-left !p-7">
                  <h3 className="display text-2xl">{value.title}</h3>
                  <p className="mt-3 text-base leading-relaxed">{value.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-24 grid max-w-[1180px] items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-16">
        <Reveal className="md:order-2">
          <div className="max-w-[30rem]">
            <span className="eyebrow">Vegetarisch, vegan, glutenfrei</span>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Gutes Essen für alle am Tisch</h2>
            <p className="justify mt-6 text-lg leading-relaxed">
              Wir kochen für Familien, Paare und Freunde, die verschieden essen und trotzdem zusammen am Tisch sitzen wollen. Deshalb gibt es bei uns vegetarische und vegane Gerichte und glutenfreie Pasta. Sag uns einfach Bescheid, wir beraten dich gern.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={paths.menu} className="btn">
                Speisekarte ansehen
              </Link>
              {reserve ? (
                <Link href={reserve.href} className="btn">
                  {reserve.label}
                </Link>
              ) : null}
            </div>
          </div>
        </Reveal>
        <Reveal index={1} className="md:order-1">
          <FramedPhoto photo={PHOTOS.pasta} caption="Hausgemachte Pasta" ratio="aspect-[4/3]" />
        </Reveal>
      </section>
    </main>
  )
}
