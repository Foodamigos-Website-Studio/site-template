import Link from "next/link"

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="mt-4">
        <Link href="/" className="underline underline-offset-4">
          ←
        </Link>
      </p>
    </section>
  )
}
