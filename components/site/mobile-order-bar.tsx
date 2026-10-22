import { ButtonLink } from "@/components/ui/button-link"

/** The sticky red Order button on small screens. */
export function MobileOrderBar({ href }: { href: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 md:hidden">
      <ButtonLink href={href} className="pointer-events-auto w-full">
        Order now
      </ButtonLink>
    </div>
  )
}
