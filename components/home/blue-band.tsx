import { Marquee } from "@/components/site/marquee"

/** The tilted blue diagonal; its lower part merges into the blue block below (reviews). */
export function BlueBand({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden pt-16 md:pt-24 ${className ?? ""}`}>
      <div className="-mx-[10%] -mb-24 -rotate-3 bg-hero-background pb-36 pt-8 md:pt-12">
        <Marquee text="Zeit für deinen Burger!" className="text-[clamp(3.5rem,9vw,8rem)] text-primary" />
        <Marquee text="Zeit für deinen Burger!" direction="right" className="mt-2 text-[clamp(3.5rem,9vw,8rem)] text-background" />
      </div>
    </div>
  )
}
