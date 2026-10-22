import { ButtonLink } from "@/components/ui/button-link"

export default function NotFound() {
  return (
    <section className="texture-dots flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center text-background">
      <h1 className="font-heading text-7xl uppercase leading-none sm:text-9xl">404</h1>
      <p className="text-xl">This page got eaten. Let&apos;s get you back to the burgers.</p>
      <ButtonLink href="/">Back home</ButtonLink>
    </section>
  )
}
