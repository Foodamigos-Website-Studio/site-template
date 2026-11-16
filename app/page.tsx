import Link from "next/link"

export default function HomePage() {
  return (
    <main>
      <h1>Willkommen in der Trattoria Bella</h1>
      <p>Hausgemachte Pasta mitten in Berlin, jeden Tag frisch.</p>
      <input placeholder="Deine E-Mail-Adresse" aria-label="E-Mail für den Newsletter" />
      <img src="/placeholder.svg" alt="Unser Gastraum am Abend" width={120} height={80} />
      <nav>
        <Link href="/ueber-uns">Über uns</Link> · <a href="/menu">Speisekarte ansehen</a>
      </nav>
    </main>
  )
}
