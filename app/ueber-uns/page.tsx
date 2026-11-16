import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { PageIntro } from "@/components/site/page-intro"
import { PhotoFigure } from "@/components/site/primitives"
import { PHOTOS } from "@/lib/media"
import { ABOUT_PATH, reservationLink, sitePaths } from "@/lib/nav"
import { pageMetadata } from "@/lib/seo"
import { getProject } from "@/lib/studio-api"

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject()
  const name = project?.name ?? "Trattoria Bella"
  return pageMetadata({
    title: `${name} – Über uns`,
    description: project?.about?.slice(0, 160) ?? `Lerne die Familie hinter der ${name} kennen.`,
    path: ABOUT_PATH,
  })
}

export default async function AboutPage() {
  const project = await getProject()
  const paths = sitePaths()
  const reserve = reservationLink(project)

  return (
    <main className="pb-32">
      <PageIntro kicker="Unsere Geschichte" title="Über uns" />

      <section className="mx-auto grid max-w-[1180px] items-center gap-14 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
        <Reveal>
          <div className="max-w-[30rem]">
            <h2 className="display-caps text-xl sm:text-2xl">Familie Rossi</h2>
            {project?.about ? <p className="mt-8 text-lg leading-relaxed">{project.about}</p> : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={paths.menu} className="btn">
                Speisekarte
              </Link>
              {reserve ? (
                <Link href={reserve.href} className="btn">
                  {reserve.label}
                </Link>
              ) : null}
            </div>
          </div>
        </Reveal>
        <Reveal index={1}>
          <PhotoFigure photo={PHOTOS.flour} ratio="aspect-[4/5]" sizes="(min-width: 768px) 45vw, 100vw" />
        </Reveal>
      </section>
    </main>
  )
}
