import Link from "next/link"

import { PageTitle } from "@/components/site/page-title"

export default function NotFound() {
  return (
    <>
      <PageTitle intro="Diese Seite gibt es nicht. Vielleicht finden Sie auf unserer Startseite, was Sie suchen.">Seite nicht gefunden</PageTitle>
      <section className="bg-background px-6 py-20 text-center md:py-28">
        <Link href="/" className="btn">
          Zur Startseite
        </Link>
      </section>
    </>
  )
}
